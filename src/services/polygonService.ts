import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

interface StockQuoteResponse {
  status: string;
  request_id: string;
  results: {
    last: {
      price: number;
      size: number;
      exchange: number;
      timestamp: number;
    };
    todaysChange: number;
    todaysChangePerc: number;
    updated: number;
  };
}

// Mock data for development and fallback
const mockStockData: Record<string, any> = {
  'LLY': {
    price: 598.42,
    change: 2.15,
    changePercent: 0.36,
    timestamp: Date.now()
  },
  'PLTR': {
    price: 17.85,
    change: -0.25,
    changePercent: -1.38,
    timestamp: Date.now()
  }
};

async function getPolygonApiKey(): Promise<string> {
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

export async function getStockQuote(symbol: string) {
  try {
    console.log(`Fetching stock quote for ${symbol}...`);
    
    const POLYGON_API_KEY = await getPolygonApiKey();
    
    // Remove any trailing colons from the URL
    const url = `${BASE_URL}/v2/last/trade/${symbol}?apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error fetching ${symbol}:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      if (response.status === 403) {
        console.error('Polygon.io API access denied. Please check your API key and subscription plan.');
      }
      
      console.log(`Falling back to mock data for ${symbol}`);
      return mockStockData[symbol];
    }

    const data: StockQuoteResponse = await response.json();
    console.log(`Received data for ${symbol}:`, data);
    
    return {
      price: data.results.last.price,
      change: data.results.todaysChange,
      changePercent: data.results.todaysChangePerc,
      timestamp: data.results.updated
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    console.log(`Falling back to mock data for ${symbol}`);
    return mockStockData[symbol];
  }
}

export async function getHistoricalData(symbol: string, from: string, to: string) {
  try {
    const POLYGON_API_KEY = await getPolygonApiKey();
    const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

export async function getCompanyNews(symbol: string) {
  try {
    const POLYGON_API_KEY = await getPolygonApiKey();
    const url = `${BASE_URL}/v2/reference/news?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company news:', error);
    throw error;
  }
}