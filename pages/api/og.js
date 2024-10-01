import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    const message = searchParams.get('message');
    const image = searchParams.get('image');
    const description = searchParams.get('description');

    if (message) {
      // Answer frame
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 60,
              color: 'white',
              background: 'black',
              width: '100%',
              height: '100%',
              padding: '50px 200px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {message}
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    } else if (image && description) {
      // Question frame
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 32,
              color: 'white',
              background: 'black',
              width: '100%',
              height: '100%',
              padding: '50px 200px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <img src={image} alt="Space Object" style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain' }} />
            <p style={{ marginTop: '20px' }}>{description}</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    } else {
      // Default frame
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 60,
              color: 'white',
              background: 'black',
              width: '100%',
              height: '100%',
              padding: '50px 200px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Space Guessing Game
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}