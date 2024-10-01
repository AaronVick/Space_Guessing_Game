import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API || 'DEMO_KEY';
const BASE_URL = 'https://images-api.nasa.gov/search';

export async function fetchSpaceData(query) {
  try {
    const response = await axios.get(`${BASE_URL}?q=${encodeURIComponent(query)}&media_type=image&api_key=${NASA_API_KEY}`);
    const items = response.data.collection.items;

    if (items.length === 0) {
      throw new Error('No items found');
    }

    // Filter and select a random item
    const validItems = items.filter(item => 
      item.links && 
      item.links[0].href && 
      item.data && 
      item.data[0].title && 
      item.data[0].description
    );

    if (validItems.length === 0) {
      throw new Error('No valid items found');
    }

    const randomItem = validItems[Math.floor(Math.random() * validItems.length)];

    return {
      title: randomItem.data[0].title,
      description: randomItem.data[0].description,
      image: randomItem.links[0].href
    };
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    throw new Error('Failed to fetch space data');
  }
}

const fallbackNames = [
  'Andromeda Galaxy', 'Orion Nebula', 'Crab Nebula', 'Whirlpool Galaxy', 'Sombrero Galaxy',
  'Pinwheel Galaxy', 'Eagle Nebula', 'Centaurus A', 'Messier 87', 'Triangulum Galaxy',
  'Cartwheel Galaxy', 'Antennae Galaxies', 'Pillars of Creation', 'Carina Nebula', 'Helix Nebula',
  'Horsehead Nebula', 'Tarantula Nebula', 'Butterfly Nebula', 'Cat\'s Eye Nebula', 'Boomerang Nebula'
];

export async function fetchRandomSpaceNames(count = 1, correctTitle = '') {
  try {
    // Fetch a larger set of potential names to increase variety
    const response = await axios.get(`${BASE_URL}?q=galaxy OR nebula&media_type=image&api_key=${NASA_API_KEY}`);
    const items = response.data.collection.items;

    let titles = items
      .filter(item => item.data && item.data[0].title)
      .map(item => item.data[0].title)
      // Remove any titles that are too similar to the correct answer
      .filter(title => !title.toLowerCase().includes(correctTitle.toLowerCase()) && 
                       !correctTitle.toLowerCase().includes(title.toLowerCase()));

    // If we don't have enough unique titles, add from the fallback list
    if (titles.length < count) {
      titles = [...new Set([...titles, ...fallbackNames])];
    }

    // Shuffle the titles array
    titles = titles.sort(() => Math.random() - 0.5);

    // Return the required number of unique titles, excluding the correct title
    return titles.filter(title => title !== correctTitle).slice(0, count);
  } catch (error) {
    console.error('Error fetching random space names:', error);
    
    // Use the fallback list if API call fails
    return fallbackNames
      .filter(name => name !== correctTitle)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }
}