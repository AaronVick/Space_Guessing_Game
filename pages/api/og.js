import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    const result = searchParams.get('result');
    const answer = searchParams.get('answer');
    const score = searchParams.get('score');
    const total = searchParams.get('total');
    const image = searchParams.get('image');
    const error = searchParams.get('error');

    if (result && answer && score && total) {
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
            <h1 style={{ marginBottom: '20px' }}>{result === 'correct' ? 'Correct!' : 'Wrong!'}</h1>
            <p style={{ marginBottom: '20px' }}>The answer was: {answer}</p>
            <p>Score: {score} / {total}</p>
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
    } else if (error) {
      // Error frame
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
            An error occurred. Please try again.
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