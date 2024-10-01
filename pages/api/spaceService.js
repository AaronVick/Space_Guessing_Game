import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API_KEY;
const BASE_URL = 'https://images-api.nasa.gov/search';

// Function to fetch space data from NASA API
export async function fetchSpaceData(query) {
  try {
    const response = await axios.get(`${BASE_URL}?q=${encodeURIComponent(query)}&media_type=image`);
    const data = response.data.collection.items;

    // Filter out items with missing necessary data
    const validItems = data.filter(item => {
      return item.links && item.links[0].href && item.data && item.data[0].title && item.data[0].description;
    });

    if (validItems.length === 0) {
      throw new Error('No valid items found');
    }

    // Select a random valid item
    const randomItem = validItems[Math.floor(Math.random() * validItems.length)];

    const spaceTitle = randomItem.data[0].title;
    const spaceDescription = randomItem.data[0].description;
    const spaceImage = randomItem.links[0].href;

    return { title: spaceTitle, description: spaceDescription, image: spaceImage };
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    throw new Error('Failed to fetch space data');
  }
}

export async function fetchRandomSpaceNames(count = 1, correctTitle = '') {
  const fallbackSpaceNames = [
    'Andromeda', 'Milky Way', 'Orion Nebula', 'Hubble Space Telescope', 'Mars', 'Saturn', 'Jupiter',
    'Exoplanet', 'Black Hole', 'Supernova', 'Quasar', 'Pulsar', 'Meteor', 'Comet'
  ];

  // Ensure the correctTitle is not repeated
  const spaceNames = fallbackSpaceNames.filter(name => name !== correctTitle);
  return spaceNames.slice(0, count);
}
