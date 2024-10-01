import { fetchSpaceData, fetchRandomSpaceNames } from './spaceService';

function generateOgImageUrl(baseUrl, params) {
  const urlParams = new URLSearchParams(params);
  return `${baseUrl}/api/og?${urlParams.toString()}`;
}

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';

    if (state.stage === 'question' && buttonIndex !== undefined) {
      const newTotalAnswered = state.totalAnswered + 1;
      const isCorrect = buttonIndex === state.correctIndex;
      const newCorrectCount = state.correctCount + (isCorrect ? 1 : 0);

      const message = isCorrect 
        ? `Correct! The answer was ${state.correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`
        : `Wrong. The correct answer was ${state.correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`;

      const shareText = `I've guessed ${newCorrectCount} space objects correctly out of ${newTotalAnswered} questions! Can you beat my score?\n\nPlay now:`;
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(baseUrl)}`;

      const ogImageUrl = generateOgImageUrl(baseUrl, {
        title: 'Space Guessing Game',
        description: truncateDescription(message),
        image: '/spaceGame.png'
      });

      const html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${ogImageUrl}" />
            <meta property="fc:frame:button:1" content="Next Question" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="${shareUrl}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
          </head>
          <body></body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      // In case "Next Question" is clicked or an error occurs
      const { title, description, image } = await fetchSpaceData('galaxy');
      const [wrongSpaceName] = await fetchRandomSpaceNames(1, title);

      const correctButtonIndex = Math.random() < 0.5 ? 1 : 2;
      const button1Content = correctButtonIndex === 1 ? title : wrongSpaceName;
      const button2Content = correctButtonIndex === 2 ? title : wrongSpaceName;

      const ogImageUrl = generateOgImageUrl(baseUrl, {
        title,
        description: truncateDescription(description),
        image
      });

      const html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${ogImageUrl}" />
            <meta property="fc:frame:button:1" content="${button1Content}" />
            <meta property="fc:frame:button:2" content="${button2Content}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, correctIndex: correctButtonIndex, totalAnswered: 0, correctCount: 0, stage: 'question' }))}" />
          </head>
          <body></body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    }
  } catch (error) {
    console.error('Error in answer handler:', error);
    
    const errorHtml = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${generateOgImageUrl(process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app', { message: 'An error occurred. Please try again.' })}" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app'}/api/answer" />
        </head>
        <body></body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}

function truncateDescription(description, maxLength = 200) {
  if (description.length <= maxLength) return description;
  return description.substr(0, maxLength - 3) + '...';
}