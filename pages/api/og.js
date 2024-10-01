import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const description = searchParams.get('description') || 'Guess the space image';
  const message = searchParams.get('message') || 'Space Guess Game';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-default-url.com';
  const image = searchParams.get('image') || `${baseUrl}/spaceGame.png`; // Using NEXT_PUBLIC_BASE_URL for static image

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            backgroundColor: '#000',
            width: '1200px',
            height: '630px',
            color: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '60px', fontWeight: 'bold' }}>{message}</div>
          <img
            src={image}
            alt="Space Image"
            style={{ width: '600px', height: '400px', marginTop: '20px' }}
          />
          <div style={{ fontSize: '30px', marginTop: '20px' }}>{description}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Failed to generate the image', { status: 500 });
  }
}
