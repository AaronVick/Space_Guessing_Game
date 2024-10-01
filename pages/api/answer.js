import { fetchSpaceData, fetchRandomSpaceObjects } from './spaceService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spaceguess.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;

  console.log('Received data:', { buttonIndex, state });

  try {
    let html;
    if (stage === 'question' && buttonIndex !== undefined) {
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const message = isCorrect 
        ? `Correct! The answer was ${correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`
        : `Wrong. The correct answer was ${correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`;

      const shareText = encodeURIComponent(`I've guessed ${newCorrectCount} space objects correctly out of ${newTotalAnswered} questions! Can you beat my score?\n\nPlay now:`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
    <meta property="fc:frame:button:1" content="Next Question" />
    <meta property="fc:frame:button:2" content="Share" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${shareUrl}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
  </head>
  <body></body>
</html>`;
    } else {
      const { title, description, image } = await fetchSpaceData();
      const [wrongAnswer] = await fetchRandomSpaceObjects(1);
      
      const answers = [title, wrongAnswer].sort(() => 0.5 - Math.random());
      const correctIndex = answers.indexOf(title);

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?description=${encodeURIComponent(description)}&image=${encodeURIComponent(image || '')}" />
    <meta property="fc:frame:button:1" content="${answers[0]}" />
    <meta property="fc:frame:button:2" content="${answers[1]}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, correctIndex, totalAnswered, correctCount, stage: 'question' }))}" />
  </head>
  <body></body>
</html>`;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in answer handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
