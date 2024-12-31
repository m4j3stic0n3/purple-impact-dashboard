const POLYGON_API_BASE = 'https://api.polygon.io';

export async function makePolygonRequest(endpoint: string) {
  try {
    // Ensure the endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Construct the full URL properly
    const url = new URL(formattedEndpoint, POLYGON_API_BASE);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making Polygon API request:', error);
    throw error; // Let the calling function handle the error
  }
}