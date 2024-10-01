import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log('OG handler started');
  
  const { searchParams } = new URL(req.url, 'http://localhost');
  const type = searchParams.get('type');

  console.log('Received type:', type);

  let content;
  if (type === 'answer') {
    const result = searchParams.get('result');
    const correct = searchParams.get('correct');
    const total = searchParams.get('total');
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Space Guessing Game</h1>
        <p style={{ fontSize: '36px', marginBottom: '20px' }}>{result}!</p>
        <p style={{ fontSize: '24px' }}>You've guessed {correct} out of {total} correctly.</p>
      </div>
    );
  } else if (type === 'question') {
    const image = searchParams.get('image');
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>What is this space object?</h1>
        {image && <img src={image} alt="Space Object" style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain' }} />}
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'black', color: 'white' }}>
        <h1 style={{ fontSize: '48px' }}>Space Guessing Game</h1>
      </div>
    );
  }

  console.log('Generating image response');
  return new ImageResponse(content, {
    width: 1200,
    height: 630,
  });
}