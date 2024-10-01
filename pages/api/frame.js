import { fetchSpaceData } from './spaceService';

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';

    if (state.stage === 'question' && buttonIndex !== undefined) {
      const isCorrect = buttonIndex === state.correctIndex;
      const message = isCorrect ? `Correct! The answer was ${state.correctTitle}.` : `Wrong. The correct answer was ${state.correctTitle}.`;

      const shareText = encodeURIComponent(`I've guessed ${isCorrect ? 'correctly' : 'wrong'} in the Space Guessing Game! Can you beat my score?\n\nPlay now:`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      const ogImageUrl = `${baseUrl}/api/og?message=${encodeURIComponent(message)}`;

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
          </head>
          <body></body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      // In case there's no valid state or the user is getting a new question
      const { title, description, image } = await fetchSpaceData('galaxy');
      const correctButtonIndex = Math.random() < 0.5 ? 1 : 2;
      const button1Content = correctButtonIndex === 1 ? title : 'Wrong Answer';
      const button2Content = correctButtonIndex === 2 ? title : 'Wrong Answer';

      const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}`;

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
    console.error('Error in frame handler:', error);

    const errorHtml = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app'}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app'}/api/start-game" />
        </head>
        <body></body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}
