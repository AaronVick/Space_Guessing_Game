import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  let title, description, image;

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      ({ title, description, image } = body);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return new Response('Bad Request', { status: 400 });
    }
  } else {
    const { searchParams } = new URL(req.url);
    title = searchParams.get('title');
    description = searchParams.get('description');
    image = searchParams.get('image');
  }

  title = title || 'Space Guessing Game';
  description = description || 'Guess the space object based on the image';
  image = image || '/spaceGame.png';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          color: 'white',
          padding: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={image} alt="Space Image" style={{ maxWidth: '100%', maxHeight: '70%' }} />
        <h1 style={{ fontSize: '32px', textAlign: 'center', marginTop: '10px' }}>{title}</h1>
        <p style={{ fontSize: '18px', textAlign: 'center' }}>{description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}