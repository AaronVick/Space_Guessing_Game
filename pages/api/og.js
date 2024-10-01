import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  console.log('OG handler started');
  console.log('Request URL:', req.url);

  try {
    const url = new URL(req.url, 'http://localhost');
    console.log('Parsed URL:', url.toString());
    
    const searchParams = url.searchParams;
    console.log('Search params:', Object.fromEntries(searchParams));
    
    const result = searchParams.get('result');
    const answer = searchParams.get('answer');
    const score = searchParams.get('score');
    const total = searchParams.get('total');
    const image = searchParams.get('image');
    const error = searchParams.get('error');

    console.log('Extracted params:', { result, answer, score, total, image, error });

    if (result && answer && score && total) {
      // Answer frame
      console.log('Generating answer frame');
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
      console.log('Generating question frame');
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
      console.log('Generating default frame');
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
    console.error(e.stack);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}