import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

// Rate limiting setup - 5 calls per minute
const CALLS_PER_MINUTE = 5;
const callsQueue: number[] = [];
const requestQueue: (() => Promise<any>)[] = [];
let isProcessingQueue = false;

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

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    if (!canMakeCall()) {
      // Wait for 12 seconds before next attempt (5 calls per minute = 1 call per 12 seconds)
      await new Promise(resolve => setTimeout(resolve, 12000));
      continue;
    }

    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
    }
  }

  isProcessingQueue = false;
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
  },
  'ICLN': {
    price: 15.23,
    change: 0.45,
    changePercent: 3.04,
    timestamp: Date.now()
  },
  'QCLN': {
    price: 35.67,
    change: 0.89,
    changePercent: 2.56,
    timestamp: Date.now()
  },
  'BGRN': {
    price: 45.12,
    change: -0.34,
    changePercent: -0.75,
    timestamp: Date.now()
  },
  'PHO': {
    price: 52.34,
    change: 0.67,
    changePercent: 1.29,
    timestamp: Date.now()
  },
  'GRNB': {
    price: 23.45,
    change: 0.15,
    changePercent: 0.64,
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
  return new Promise((resolve) => {
    const fetchData = async () => {
      try {
        console.log(`Fetching stock quote for ${symbol}...`);
        
        const POLYGON_API_KEY = await getPolygonApiKey();
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
          
          console.log(`Falling back to mock data for ${symbol}`);
          resolve(mockStockData[symbol]);
          return;
        }

        const data = await response.json();
        if (!data.results?.[0]) {
          console.log(`No data available for ${symbol}, using mock data`);
          resolve(mockStockData[symbol]);
          return;
        }

        const result = data.results[0];
        resolve({
          price: result.c, // Close price
          change: result.c - result.o, // Close - Open
          changePercent: ((result.c - result.o) / result.o) * 100,
          timestamp: result.t
        });
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        resolve(mockStockData[symbol]);
      }
    };

    requestQueue.push(fetchData);
    processQueue();
  });
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
