import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

export async function getPolygonApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('get-polygon-key');
    
    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }

    if (!data?.apiKey) {
      throw new Error('API key not found in Supabase secrets');
    }

    return data.apiKey;
  } catch (error) {
    console.error('Error in getPolygonApiKey:', error);
    throw error;
  }
}

export async function makePolygonRequest(endpoint: string): Promise<any> {
  const POLYGON_API_KEY = await getPolygonApiKey();
  const url = `${BASE_URL}${endpoint}?apiKey=${POLYGON_API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Error fetching from Polygon:`, {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}