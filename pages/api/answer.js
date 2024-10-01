import { fetchSpaceData, fetchRandomSpaceNames } from './spaceService';

export default async function handler(req, res) {
  console.log('Answer handler started');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;

  console.log('Received state:', state);
  console.log('Button index:', buttonIndex);

  try {
    let html;
    if (stage === 'question' && buttonIndex !== undefined) {
      console.log('Processing answer for question');
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const result = isCorrect ? 'Correct' : 'Wrong';
      const message = `${result}! The answer was ${correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`;

      const shareText = encodeURIComponent(`I've guessed ${newCorrectCount} space objects correctly out of ${newTotalAnswered} questions! Can you beat my score?\n\nPlay now:`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/answer-background.png" />
    <meta property="fc:frame:button:1" content="Next Question" />
    <meta property="fc:frame:button:2" content="Share" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${shareUrl}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
  </head>
  <body>
    <h1>${result}!</h1>
    <p>The answer was: ${correctTitle}</p>
    <p>Score: ${newCorrectCount} / ${newTotalAnswered}</p>
  </body>
</html>`;
    } else {
      console.log('Generating new question');
      const { title, description, image } = await fetchSpaceData('galaxy');
      console.log('Fetched space data:', { title, description, image });
      const [wrongSpaceName] = await fetchRandomSpaceNames(1, title);
      const answers = [title, wrongSpaceName].sort(() => Math.random() - 0.5);
      const newCorrectIndex = answers.indexOf(title) + 1;

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    <meta property="fc:frame:button:1" content="${answers[0]}" />
    <meta property="fc:frame:button:2" content="${answers[1]}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, correctIndex: newCorrectIndex, totalAnswered, correctCount, stage: 'question' }))}" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
  </body>
</html>`;
    }

    console.log('Sending HTML response');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in answer handler:', error);

    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/error-background.png" />
    <meta property="fc:frame:button:1" content="Try Again" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
  </head>
  <body>
    <h1>Error</h1>
    <p>An error occurred. Please try again.</p>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}