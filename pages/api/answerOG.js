import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log('answerOG.js handler called');
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    const result = url.searchParams.get('result');
    const correctAnswer = url.searchParams.get('correctAnswer');
    const score = url.searchParams.get('score');

    console.log('Received parameters:', { result, correctAnswer, score });

    if (!result || !correctAnswer || !score) {
      console.log('Missing parameters');
      return new Response('Missing parameters', { status: 400 });
    }

    console.log('Generating ImageResponse');
    const imageResponse = new ImageResponse(
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
          <p style={{ marginBottom: '20px', fontSize: 30 }}>The correct answer was:</p>
          <p style={{ marginBottom: '20px', fontSize: 24 }}>{correctAnswer}</p>
          <p style={{ fontSize: 36 }}>{`Score: ${score}`}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    console.log('ImageResponse generated successfully');
    return imageResponse;
  } catch (e) {
    console.error('Error in answerOG.js:', e);
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}