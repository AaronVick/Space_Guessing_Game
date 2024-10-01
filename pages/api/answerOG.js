import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    const result = searchParams.get('result');  // Correct or Wrong
    const correctAnswer = searchParams.get('correctAnswer');  // The correct answer
    const score = searchParams.get('score');  // User's score: "X out of Y"

    // Basic validation of inputs
    if (result && correctAnswer && score) {
      // Render the answer frame image
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
            <p>{`Score: ${score}`}</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    } else {
      // Handle missing parameters
      return new Response('Missing parameters for result, correct answer, or score.', {
        status: 400,
      });
    }
  } catch (e) {
    console.error('Error generating answer frame image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
