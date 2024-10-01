import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { title, description, image } = await req.json();

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            color: 'white',
            padding: '20px',
          }}
        >
          <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '10px' }}>{title}</h1>
          <p style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>{description}</p>
          <img src={image} alt="Space Object" style={{ maxWidth: '80%', maxHeight: '50%', objectFit: 'contain' }} />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error in OG image generation:', error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
}