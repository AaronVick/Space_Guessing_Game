import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const title = decodeURIComponent(url.searchParams.get('title') || '');
  const description = decodeURIComponent(url.searchParams.get('description') || '');
  const image = decodeURIComponent(url.searchParams.get('image') || '');

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
        <h1 style={{ fontSize: '32px', textAlign: 'center', marginTop: '10px' }}>{title}</h1>
        <p style={{ fontSize: '18px', textAlign: 'center' }}>{description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}