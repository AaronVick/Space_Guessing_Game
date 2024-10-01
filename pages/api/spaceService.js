import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API; 
const NASA_API_URL = 'https://images-api.nasa.gov/search';

export async function fetchSpaceData(query) {
  try {
    const response = await axios.get(NASA_API_URL, {
      params: {
        q: query || 'galaxy',
        media_type: 'image',
      }
    });

    const items = response.data.collection.items;

    // Filter to make sure we only get images with valid URLs
    const imageItems = items.filter(item => {
      const { data } = item;
      const hasValidImage = item.links && item.links[0] && isValidUrl(item.links[0].href);
      const isImageType = data[0].media_type === 'image';
      return isImageType && hasValidImage;
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

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export async function fetchRandomSpaceNames(numNames, excludeName) {
  const fallbackSpaceNames = [
    'Andromeda Galaxy', 'Milky Way', 'Crab Nebula', 'Orion Nebula', 'Ring Nebula',
    'Sombrero Galaxy', 'Triangulum Galaxy', 'Whirlpool Galaxy', 'Large Magellanic Cloud',
    'Small Magellanic Cloud', 'Omega Nebula', 'Eagle Nebula', 'Helix Nebula',
    'Centaurus A', 'Pinwheel Galaxy', 'Cartwheel Galaxy', 'Tadpole Galaxy',
    'Hoag\'s Object', 'Cigar Galaxy', 'Bode\'s Galaxy', 'Antennae Galaxies',
    'Black Eye Galaxy', 'Messier 87', 'Mayall\'s Object', 'Butterfly Galaxies',
    'Stephan\'s Quintet', 'Centaurus Cluster', 'Fornax Cluster', 'Virgo Cluster',
    'Horsehead Nebula', 'Carina Nebula', 'Tarantula Nebula', 'Pillars of Creation'
  ];

  let spaceNames = fallbackSpaceNames.filter(name => name !== excludeName);
  let randomNames = [];

  for (let i = 0; i < numNames; i++) {
    if (spaceNames.length === 0) break; // Stop if we run out of unique names
    const randomIndex = Math.floor(Math.random() * spaceNames.length);
    randomNames.push(spaceNames[randomIndex]);
    spaceNames.splice(randomIndex, 1); // Remove the selected name to avoid duplicates
  }

  return randomNames;
}
