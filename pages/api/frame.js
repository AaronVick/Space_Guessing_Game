import { fetchSpaceData } from './spaceService';

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  try {
    let html = '';
    const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.com';

    if (!state.stage || state.stage === 'initial') {
      const { title, description, image } = await fetchSpaceData();

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}" />
            <meta property="fc:frame:button:1" content="${title}" />
            <meta property="fc:frame:button:2" content="Not ${title}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          </head>
        </html>
      `;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error("Error in frame handler:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
