import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

// Rate limiting setup - 5 calls per minute
const CALLS_PER_MINUTE = 5;
const callsQueue: number[] = [];

function canMakeCall(): boolean {
  const now = Date.now();
  // Remove calls older than 1 minute
  while (callsQueue.length > 0 && callsQueue[0] < now - 60000) {
    callsQueue.shift();
  }
  return callsQueue.length < CALLS_PER_MINUTE;
}

function trackApiCall() {
  callsQueue.push(Date.now());
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
    if (!canMakeCall()) {
      console.log(`Rate limit reached, using mock data for ${symbol}`);
      return mockStockData[symbol];
    }

    console.log(`Fetching stock quote for ${symbol}...`);
    
    const POLYGON_API_KEY = await getPolygonApiKey();
    
    // Use previous day close endpoint instead of last trade
    const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');
    
    trackApiCall();
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

    const data = await response.json();
    const result = data.results[0];
    
    return {
      price: result.c, // Close price
      change: result.c - result.o, // Close - Open
      changePercent: ((result.c - result.o) / result.o) * 100,
      timestamp: result.t
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return mockStockData[symbol];
  }
}

export async function getHistoricalData(symbol: string, from: string, to: string) {
  try {
    if (!canMakeCall()) {
      throw new Error('Rate limit reached');
    }

    const POLYGON_API_KEY = await getPolygonApiKey();
    const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');

    trackApiCall();
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
    if (!canMakeCall()) {
      throw new Error('Rate limit reached');
    }

    const POLYGON_API_KEY = await getPolygonApiKey();
    const url = `${BASE_URL}/v2/reference/news?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`.replace('://', '://').replace(/:[^/]/, '');

    trackApiCall();
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