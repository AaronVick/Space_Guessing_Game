export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;

  try {
    let html;
    if (stage === 'question' && buttonIndex !== undefined) {
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const result = isCorrect ? 'Correct' : 'Wrong';
      const score = `${newCorrectCount} / ${newTotalAnswered}`;

      // Use /api/answerOG for the answer frame generation
      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/answerOG?result=${encodeURIComponent(result)}&correctAnswer=${encodeURIComponent(correctTitle)}&score=${encodeURIComponent(score)}" />
    <meta property="fc:frame:button:1" content="Next Question" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
  </head>
  <body></body>
</html>`;
    } else {
      // Handle invalid state
      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('Error occurred. Please try again.')}" />
    <meta property="fc:frame:button:1" content="Try Again" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
  </head>
  <body></body>
</html>`;
    }

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

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}
