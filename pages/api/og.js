import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    console.log('OG handler started');
    console.log('Request URL:', req.url);

    let url;
    try {
      url = new URL(req.url, 'http://localhost');
    } catch (error) {
      console.error('Error parsing URL:', error);
      throw new Error('Invalid URL');
    }

    const searchParams = url.searchParams;
    
    const message = searchParams.get('message');
    const image = searchParams.get('image');
    const description = searchParams.get('description');

    console.log('Parsed params:', { message, image, description });

    if (message) {
      // Answer frame
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: 'white',
              background: 'black',
              width: '100%',
              height: '100%',
              padding: '50px 50px',
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
              padding: '50px 50px',
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
              padding: '50px 50px',
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
    console.error(`Error in OG handler: ${e.message}`);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}