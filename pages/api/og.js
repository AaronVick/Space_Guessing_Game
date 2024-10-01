import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  const { title, description, image } = req.query;

  const canvasWidth = 1200;
  const canvasHeight = 630;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set background color
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  try {
    // Load and draw the space image
    if (image) {
      const spaceImage = await loadImage(image);
      const imgWidth = canvasWidth * 0.5; // Scale the image width to half the canvas
      const imgHeight = canvasHeight * 0.8; // Scale the image height to 80% of the canvas
      const imgX = canvasWidth - imgWidth - 20; // Position it with padding from the right
      const imgY = (canvasHeight - imgHeight) / 2; // Center the image vertically
      ctx.drawImage(spaceImage, imgX, imgY, imgWidth, imgHeight);
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }

  // Set text style
  ctx.font = 'bold 60px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';

  // Draw the title
  if (title) {
    ctx.fillText(title, 50, 150);
  }

  // Set description text style
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#CCCCCC';

  // Draw the description (truncate if too long)
  const descriptionText = description || 'Guess the Space Object';
  const maxDescriptionLength = 90;
  const truncatedDescription =
    descriptionText.length > maxDescriptionLength
      ? descriptionText.slice(0, maxDescriptionLength) + '...'
      : descriptionText;
  ctx.fillText(truncatedDescription, 50, 250);

  // Send the response with the generated image
  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
}
