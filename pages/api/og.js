import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Space Guessing Game';
    const description = searchParams.get('description') || 'Guess the space object based on the image';
    const imageUrl = searchParams.get('image');

    let image = '/spaceGame.png';  // Default fallback image
    if (imageUrl) {
      try {
        new URL(imageUrl);  // Validate the URL
        image = imageUrl;
      } catch (error) {
        console.error('Invalid image URL:', imageUrl);
        // Keep using the fallback image
      }
    }

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
          {/* Use next/image for better image handling */}
          <img
            src={image}
            alt="Space Object Image"
            style={{ maxWidth: '100%', maxHeight: '70%', objectFit: 'contain' }}
          />
          <h1 style={{ fontSize: '24px', textAlign: 'center', margin: '10px 0' }}>{title}</h1>
          <p style={{ fontSize: '16px', textAlign: 'center', margin: '0' }}>{description}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error in OG image generation:', error);
    return new Response('Error generating image', { status: 500 });
  }
}