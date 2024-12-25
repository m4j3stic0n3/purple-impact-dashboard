import { useQuery } from "@tanstack/react-query";
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

async function getPolygonApiKey(): Promise<string> {
  const { data, error } = await supabase.functions.invoke('get-polygon-key');
  
  if (error) {
    console.error('Error fetching API key:', error);
    throw new Error('Failed to fetch API key');
  }

  if (!data?.apiKey) {
    throw new Error('API key not found. Please make sure you have added your Polygon API key in the settings.');
  }

  return data.apiKey;
}

export async function getStockQuote(symbol: string) {
  const POLYGON_API_KEY = await getPolygonApiKey();
  
  console.log(`Fetching stock quote for ${symbol}...`);
  
  const response = await fetch(
    `${BASE_URL}/v2/last/trade/${symbol}?apiKey=${POLYGON_API_KEY}`
  );

  if (!response.ok) {
    console.error(`Error fetching ${symbol}:`, response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: StockQuoteResponse = await response.json();
  console.log(`Received data for ${symbol}:`, data);
  
  return {
    price: data.results.last.price,
    change: data.results.todaysChange,
    changePercent: data.results.todaysChangePerc,
    timestamp: data.results.updated
  };
}

export async function getHistoricalData(symbol: string, from: string, to: string) {
  const POLYGON_API_KEY = await getPolygonApiKey();

  const response = await fetch(
    `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function getCompanyNews(symbol: string) {
  const POLYGON_API_KEY = await getPolygonApiKey();

  const response = await fetch(
    `${BASE_URL}/v2/reference/news?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}