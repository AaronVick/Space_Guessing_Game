import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Space Guessing Game';
  const description = searchParams.get('description') || 'Guess the space object based on the image';
  const image = searchParams.get('image') || '/spaceGame.png';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          color: 'white',
          padding: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={image} alt="Space Image" style={{ maxWidth: '100%', maxHeight: '70%' }} />
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
