export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log('Received request URL:', req.url);

  let searchParams;
  try {
    const url = req.url.startsWith('http') ? new URL(req.url) : new URL(req.url, 'http://dummy.com');
    searchParams = url.searchParams;
    console.log('Parsed URL:', url.toString());
  } catch (error) {
    console.error('Error parsing URL:', error);
    return new Response('Invalid URL', { status: 400 });
  }

  const title = searchParams.get('title') || 'Space Guessing Game';
  const description = searchParams.get('description') || 'Guess the space object based on the image';
  const image = searchParams.get('image') || '/spaceGame.png';

  console.log('Parsed parameters:', { title, description, image });

  const html = `
    <html>
      <head>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
        <img src="${image}" alt="${title}" style="max-width: 100%;" />
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}