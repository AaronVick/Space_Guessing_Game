import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { untrustedData } = req.body;  // Assuming req.body is parsed correctly
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;

  if (stage === 'question' && buttonIndex !== undefined) {
    const newTotalAnswered = totalAnswered + 1;
    const isCorrect = buttonIndex === correctIndex;
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    const result = isCorrect ? 'Correct!' : 'Wrong!';
    const message = `${result} The correct answer was ${correctTitle}. You've guessed ${newCorrectCount} out of ${newTotalAnswered} correctly.`;

    // Use lightweight, fast image response
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            fontSize: 40,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <p>{result}</p>
          <p>{`The correct answer was: ${correctTitle}`}</p>
          <p>{`Score: ${newCorrectCount} / ${newTotalAnswered}`}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new Response('Invalid request', { status: 400 });
}
