const POLYGON_API_BASE = 'https://api.polygon.io';

export async function makePolygonRequest(endpoint: string) {
  try {
    // Ensure the endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Get API key from environment
    const apiKey = process.env.POLYGON_API_KEY;
    
    // Construct the full URL properly with API key
    const url = new URL(formattedEndpoint, POLYGON_API_BASE);
    url.searchParams.append('apiKey', apiKey || '');
    
    console.log('Making request to:', url.toString());
    
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