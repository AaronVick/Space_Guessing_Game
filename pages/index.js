import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://space-guessing-game.vercel.app';
  const shareText = encodeURIComponent(`Check out this awesome Space Image Guessing Game!\n\nFrame by @your_username.eth`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

  return (
    <div>
      <Head>
        <title>Space Guessing Game</title>
        <meta name="description" content="A fun game to guess space images from NASA's collection" />
        <meta property="og:title" content="Space Guessing Game" />
        <meta property="og:description" content="Test your knowledge of space objects!" />
        <meta property="og:image" content={`${baseUrl}/spaceGame.png`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/spaceGame.png`} />
        <meta property="fc:frame:button:1" content="Play Game" />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/start-game`} />
      </Head>
      <h1>Space Image Guessing Game</h1>
      <img
        src="/spaceGame.png"
        alt="Space Image Guessing Game"
        width="600"
        height="300"
      />
    </div>
  );
}
