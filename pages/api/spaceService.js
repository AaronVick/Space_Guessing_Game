import axios from 'axios';

const BASE_URL = 'https://images-api.nasa.gov/search';
const fallbackObjects = [
  "Andromeda", "Milky Way", "Orion Nebula", "Sombrero Galaxy", "Triangulum Galaxy",
  "Whirlpool Galaxy", "Lagoon Nebula", "Cartwheel Galaxy", "Tarantula Nebula", "Helix Nebula"
];

async function fetchValidSpaceData(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}?q=galaxy&media_type=image`, {
        headers: { Authorization: `Bearer ${process.env.NASA_API}` }
      });
      const spaceObject = response.data.collection.items[0].data[0];
      
      if (spaceObject.title && spaceObject.description) {
        const title = spaceObject.title;
        const description = spaceObject.description;
        const image = response.data.collection.items[0].links[0].href;
        
        return { title, description, image };
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }
  }
  throw new Error('Failed to fetch valid space data after multiple attempts');
}

export async function fetchSpaceData() {
  return await fetchValidSpaceData();
}

export async function fetchRandomSpaceObjects(count = 1) {
  return fallbackObjects.sort(() => 0.5 - Math.random()).slice(0, count);
}
