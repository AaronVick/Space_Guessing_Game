import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log('Received request URL:', req.url);

  let url;
  try {
    url = new URL(req.url);
    console.log('Parsed URL:', url.toString());
  } catch (error) {
    console.error('Error parsing URL:', error);
    return new Response('Invalid URL', { status: 400 });
  }

  const title = url.searchParams.get('title') || 'Space Guessing Game';
  const description = url.searchParams.get('description') || 'Guess the space object based on the image';
  const image = url.searchParams.get('image') || '/spaceGame.png';

  console.log('Parsed parameters:', { title, description, image });

  try {
    const imageResponse = new ImageResponse(
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

    console.log('Successfully generated image response');
    return imageResponse;
  } catch (error) {
    console.error('Error generating image response:', error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
}