import { fetchSpaceData, fetchRandomSpaceNames } from './spaceService';

export default async function handler(req, res) {
  console.log('answer.js handler called');
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;

  console.log('Received data:', { buttonIndex, state });

  try {
    let html;
    if (stage === 'question' && buttonIndex !== undefined) {
      console.log('Generating answer frame');
      // This is the answer to a question
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const result = isCorrect ? 'Correct' : 'Wrong';
      const score = `${newCorrectCount} / ${newTotalAnswered}`;

      console.log('Answer check:', { buttonIndex, correctIndex, isCorrect, result, score });

      const shareText = encodeURIComponent(`I've guessed ${newCorrectCount} space objects correctly out of ${newTotalAnswered} questions! Can you beat my score?\n\nFrame by @aaronv.eth`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      const answerOgUrl = `${baseUrl}/api/answerOG?result=${encodeURIComponent(result)}&correctAnswer=${encodeURIComponent(correctTitle)}&score=${encodeURIComponent(score)}`;
      console.log('Answer OG URL:', answerOgUrl);

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${answerOgUrl}" />
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
      console.log('Generating new question');
      // This is the "Next Question" button or initial state, so we should show a new question
      const { title, description, image } = await fetchSpaceData();
      const [wrongAnswer] = await fetchRandomSpaceNames(1, title);
      
      const answers = [title, wrongAnswer].sort(() => Math.random() - 0.5);
      const newCorrectIndex = answers.indexOf(title) + 1; // Add 1 to make it 1-based

      console.log('New question:', { title, answers, newCorrectIndex });

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?description=${encodeURIComponent(description)}&image=${encodeURIComponent(image || '')}" />
    <meta property="fc:frame:button:1" content="${answers[0]}" />
    <meta property="fc:frame:button:2" content="${answers[1]}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, correctIndex: newCorrectIndex, totalAnswered, correctCount, stage: 'question' }))}" />
  </head>
  <body></body>
</html>`;
    }

    console.log('Sending game HTML response:', html);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in answer handler:', error);
    
    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
    <meta property="fc:frame:button:1" content="Try Again" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
  </head>
  <body></body>
</html>`;

    console.log('Sending error HTML response:', errorHtml);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(errorHtml);
  }
}