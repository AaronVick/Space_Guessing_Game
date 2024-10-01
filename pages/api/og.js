import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get('title') || 'Space Guessing Game';
    const description = truncateDescription(url.searchParams.get('description') || 'Guess the space object based on the image');
    const imageUrl = url.searchParams.get('image') || '/spaceGame.png';

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
            padding: '40px 20px',
          }}
        >
          <img
            src={imageUrl}
            alt="Space Object"
            style={{
              maxWidth: '80%',
              maxHeight: '50%',
              objectFit: 'contain',
              marginBottom: '20px',
            }}
          />
          <h1 style={{ fontSize: '32px', textAlign: 'center', margin: '0 0 10px' }}>{title}</h1>
          <p style={{ fontSize: '18px', textAlign: 'center', margin: '0', maxWidth: '80%' }}>{description}</p>
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

function truncateDescription(description, maxLength = 200) {
  if (description.length <= maxLength) return description;
  return description.substr(0, maxLength - 3) + '...';
}