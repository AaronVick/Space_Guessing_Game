import axios from 'axios';

const NASA_API_URL = 'https://images-api.nasa.gov/search';

export async function fetchSpaceData(searchTerm = 'galaxy') {
  try {
    const response = await axios.get(NASA_API_URL, {
      params: {
        q: searchTerm,
        media_type: 'image',
        api_key: process.env.NASA_API // Ensure this is set correctly
      }
    });

    if (response.data.collection && response.data.collection.items.length > 0) {
      const data = response.data.collection.items[0].data[0];
      const imageUrl = response.data.collection.items[0].links[0].href;

      return {
        title: data.title || 'Unknown Space Object',
        description: data.description || 'No description available.',
        image: imageUrl || '/default-image.png' // Fallback to a default image
      };
    } else {
      console.error('No space data found.');
      throw new Error('No space data found.');
    }
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    throw error;
  }
}
