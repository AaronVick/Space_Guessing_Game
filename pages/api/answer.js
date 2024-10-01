export default async function handler(req, res) {
  console.log('Answer handler started');
  console.log('Request method:', req.method);

  let buttonIndex, state;
  if (req.method === 'POST') {
    const { untrustedData } = req.body;
    buttonIndex = untrustedData?.buttonIndex;
    state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { correctTitle, correctIndex, totalAnswered = 0, correctCount = 0, stage } = state;
  console.log('Received state:', state);
  console.log('Button index:', buttonIndex);

  try {
    if (stage === 'question' && buttonIndex !== undefined) {
      console.log('Processing answer for question');
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === correctIndex;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const result = isCorrect ? 'Correct' : 'Wrong';

      // Return response with only the necessary information
      const responseData = {
        result: result,
        correctAnswer: correctTitle,
        totalAnswered: newTotalAnswered,
        correctCount: newCorrectCount
      };

      return res.status(200).json(responseData);
    } else {
      return res.status(400).json({ error: 'Invalid stage or button index' });
    }
  } catch (error) {
    console.error('Error in answer handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
