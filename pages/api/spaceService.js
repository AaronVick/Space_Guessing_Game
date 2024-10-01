import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API; 
const NASA_API_URL = 'https://images-api.nasa.gov/search';

export async function fetchSpaceData(query) {
  try {
    const response = await axios.get(NASA_API_URL, {
      params: {
        q: query || 'galaxy', // Ensuring 'galaxy' is always passed as a fallback query
        media_type: 'image',
      }
    });

    const items = response.data.collection.items;

    // Filter to make sure we only get images, excluding videos
    const imageItems = items.filter(item => {
      const { data } = item;
      const hasImage = item.links && item.links[0].href.match(/\.(jpg|jpeg|png)$/);
      const isImageType = data[0].media_type === 'image';
      return isImageType && hasImage;
    });

    if (imageItems.length === 0) {
      throw new Error('No valid images found');
    }

    const randomIndex = Math.floor(Math.random() * imageItems.length);
    const selectedItem = imageItems[randomIndex];

    const title = selectedItem.data[0].title;
    const description = selectedItem.data[0].description || 'No description available';
    const image = selectedItem.links[0].href;

    return { title, description, image };
  } catch (error) {
    console.error('Error fetching data from NASA API:', error.message);
    throw new Error('Failed to fetch space data');
  }
}

export async function fetchRandomSpaceNames(numNames, excludeName) {
  const fallbackSpaceNames = [
    'Andromeda Galaxy', 'Milky Way', 'Crab Nebula', 'Orion Nebula', 'Ring Nebula',
    'Sombrero Galaxy', 'Triangulum Galaxy', 'Whirlpool Galaxy', 'Large Magellanic Cloud',
    'Small Magellanic Cloud', 'Omega Nebula', 'Eagle Nebula', 'Helix Nebula'
  ];

  let spaceNames = fallbackSpaceNames.filter(name => name !== excludeName);
  let randomNames = [];

  for (let i = 0; i < numNames; i++) {
    const randomIndex = Math.floor(Math.random() * spaceNames.length);
    randomNames.push(spaceNames[randomIndex]);
    spaceNames = spaceNames.filter((_, index) => index !== randomIndex);
  }

  return randomNames;
}
