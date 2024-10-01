import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    const result = searchParams.get('result');
    const correctAnswer = searchParams.get('correctAnswer');
    const score = searchParams.get('score');
    const image = searchParams.get('image');

    if (result && correctAnswer && score) {
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
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h1 style={{ fontSize: 60, marginBottom: '20px' }}>{result}!</h1>
            <p style={{ marginBottom: '20px' }}>The correct answer was: {correctAnswer}</p>
            <p>Score: {score}</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    } else if (image) {
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
            <img src={image} alt="Space Object" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
            <p style={{ marginTop: '20px' }}>What is this space object?</p>
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