import { supabase } from "@/integrations/supabase/client";
import { mockStockData } from "./mockData";

const BASE_URL = "https://api.polygon.io";
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;

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

export async function makePolygonRequest(endpoint: string, retryCount = 0): Promise<any> {
  try {
    const POLYGON_API_KEY = await getPolygonApiKey();
    const url = `${BASE_URL}${endpoint}?apiKey=${POLYGON_API_KEY}`;
    
    const response = await fetch(url);
    
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return makePolygonRequest(endpoint, retryCount + 1);
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error fetching from Polygon:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      // If we hit rate limit after retries or any other error, return mock data
      const symbol = endpoint.split('/')[3]; // Extract symbol from endpoint
      console.log(`Falling back to mock data for ${symbol}`);
      return mockStockData[symbol] || {
        price: 0,
        change: 0,
        changePercent: 0,
        timestamp: Date.now()
      };
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in makePolygonRequest:', error);
    // Return mock data on any error
    const symbol = endpoint.split('/')[3];
    console.log(`Falling back to mock data for ${symbol} due to error`);
    return mockStockData[symbol] || {
      price: 0,
      change: 0,
      changePercent: 0,
      timestamp: Date.now()
    };
  }
}