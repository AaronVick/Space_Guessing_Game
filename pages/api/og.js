import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log('OG handler started');
  
  let searchParams;
  try {
    const url = new URL(req.url, 'http://localhost');
    searchParams = url.searchParams;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return new Response('Invalid URL', { status: 400 });
  }

  const type = searchParams.get('type');
  const message = searchParams.get('message');
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const image = searchParams.get('image');

  console.log('Received params:', { type, message, title, description, image });

  let content;
  if (type === 'answer' && message) {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Space Guessing Game</h1>
        <p style={{ fontSize: '24px' }}>{message}</p>
      </div>
    );
  } else if (type === 'question' && title && description) {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white', padding: '40px', textAlign: 'center' }}>
        {image && <img src={image} alt={title} style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain', marginBottom: '20px' }} />}
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{title}</h1>
        <p style={{ fontSize: '18px' }}>{description}</p>
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white' }}>
        <h1 style={{ fontSize: '48px' }}>Space Guessing Game</h1>
      </div>
    );
  }

  console.log('Generating image response');
  return new ImageResponse(content, {
    width: 1200,
    height: 630,
  });
}