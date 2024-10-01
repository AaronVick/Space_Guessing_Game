import { fetchSpaceData, fetchRandomSpaceNames } from './spaceService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';

    // Fetch space data from NASA API
    const spaceData = await fetchSpaceData('galaxy OR nebula');
    const { title, description, image } = spaceData;

    // Fetch a random wrong space object name
    const [wrongSpaceName] = await fetchRandomSpaceNames(1, title);

    // Randomly assign correct answer to button 1 or 2
    const correctButtonIndex = Math.random() < 0.5 ? 1 : 2;
    const button1Content = correctButtonIndex === 1 ? title : wrongSpaceName;
    const button2Content = correctButtonIndex === 2 ? title : wrongSpaceName;

    const ogImageUrl = `${baseUrl}/api/og?` + new URLSearchParams({
      title,
      description,
      image
    }).toString();

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
  } catch (error) {
    console.error('Error in start-game handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}