import { fetchSpaceData, fetchRandomSpaceNames } from './spaceService';

function generateOgUrl(baseUrl, title, description, image) {
  const params = new URLSearchParams({
    title: title,
    description: truncateDescription(description),
    image: image,
  });
  const url = `${baseUrl}/api/og?${params.toString()}`;
  console.log('Generated OG URL:', url);
  return url;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Starting game handler');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';

    // Fetch space data from NASA API
    const spaceData = await fetchSpaceData('galaxy');
    console.log('Fetched space data:', spaceData);
    const { title, description, image } = spaceData;

    // Fetch a random wrong space object name
    const [wrongSpaceName] = await fetchRandomSpaceNames(1, title);
    console.log('Wrong space name:', wrongSpaceName);

    // Randomly assign correct answer to button 1 or 2
    const correctButtonIndex = Math.random() < 0.5 ? 1 : 2;
    const button1Content = correctButtonIndex === 1 ? title : wrongSpaceName;
    const button2Content = correctButtonIndex === 2 ? title : wrongSpaceName;

    // Generate OG URL
    const ogUrl = generateOgUrl(baseUrl, title, description, image);

    const html = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${image}" />
          <meta property="fc:frame:button:1" content="${button1Content}" />
          <meta property="fc:frame:button:2" content="${button2Content}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, correctIndex: correctButtonIndex, totalAnswered: 0, correctCount: 0, stage: 'question' }))}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${truncateDescription(description)}" />
          <meta property="og:image" content="${image}" />
        </head>
        <body>
          <h1>${title}</h1>
          <p>${truncateDescription(description)}</p>
          <img src="${image}" alt="${title}" style="max-width: 100%;" />
        </body>
      </html>
    `;

    console.log('Sending HTML response');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in start-game handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function truncateDescription(description, maxLength = 100) {
  if (description.length <= maxLength) return description;
  return description.substr(0, maxLength - 3) + '...';
}