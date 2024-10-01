import axios from 'axios';

const NASA_API_URL = 'https://images-api.nasa.gov/search';

export async function fetchSpaceData(searchTerm = 'galaxy') {
  try {
    const response = await axios.get(NASA_API_URL, {
      params: {
        q: searchTerm,
        media_type: 'image',
        api_key: process.env.NASA_API // Make sure this is set in your environment
      }
    });

    // Ensure we have relevant data
    if (response.data && response.data.collection && response.data.collection.items.length > 0) {
      const data = response.data.collection.items[0].data[0];
      const imageUrl = response.data.collection.items[0].links[0].href;

      return {
        title: data.title || 'Unknown Space Object',
        description: data.description || 'No description available.',
        image: imageUrl || '/default-image.png' // Fallback to a default image if not found
      };
    } else {
      throw new Error('No space data found.');
    }
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    throw error;
  }
}

export async function fetchRandomSpaceNames(count = 1, excludeTitle = '') {
  // Add more space-related names or make another API call for this.
  const fallbackNames = [
    'Milky Way', 'Andromeda', 'Triangulum', 'Whirlpool Galaxy',
    'Pinwheel Galaxy', 'Sombrero Galaxy', 'Centaurus A'
  ];

  return fallbackNames
    .filter(name => name !== excludeTitle)
    .sort(() => 0.5 - Math.random()) // Shuffle the array
    .slice(0, count);
}
