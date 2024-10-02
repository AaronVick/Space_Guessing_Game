import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const result = searchParams.get('result');
    const correctAnswer = searchParams.get('correctAnswer');
    const score = searchParams.get('score');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            color: '#ffffff',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: '60px', margin: '0' }}>{result}</h1>
          <p style={{ fontSize: '30px', margin: '20px 0', textAlign: 'center', maxWidth: '80%' }}>Correct answer: {correctAnswer}</p>
          <p style={{ fontSize: '40px', margin: '0' }}>Score: {score}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}