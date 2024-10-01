export default async function handler(req, res) {
  console.log('Answer handler started');
  console.log('Request method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;
  console.log('Received state:', state);
  console.log('Button index:', buttonIndex);

  try {
    if (stage === 'question' && buttonIndex !== undefined) {
      console.log('Processing answer for question');
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const result = isCorrect ? 'Correct' : 'Wrong';

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';
      const shareText = encodeURIComponent(`I've guessed ${newCorrectCount} space objects correctly out of ${newTotalAnswered} questions! Can you beat my score?\n\nPlay now:`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      // Generate dynamic OG image URL
      const ogImageUrl = `${baseUrl}/api/og?` + new URLSearchParams({
        result: result,
        correctAnswer: correctTitle,
        score: `${newCorrectCount}/${newTotalAnswered}`
      }).toString();

      // Build HTML response with necessary metatags for Farcaster frame
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${ogImageUrl}" />
    <meta property="fc:frame:button:1" content="Next Question" />
    <meta property="fc:frame:button:2" content="Share" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${shareUrl}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
  </head>
  <body>
    <h1>${result}!</h1>
    <p>The correct answer was: ${correctTitle}</p>
    <p>Your Score: ${newCorrectCount} / ${newTotalAnswered}</p>
  </body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } else {
      return res.status(400).json({ error: 'Invalid stage or button index' });
    }
  } catch (error) {
    console.error('Error in answer handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}