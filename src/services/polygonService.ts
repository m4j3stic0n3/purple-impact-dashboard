import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

interface StockQuoteResponse {
  results: {
    c: number;  // closing price
    h: number;  // highest price
    l: number;  // lowest price
    o: number;  // opening price
    v: number;  // volume
  }[];
}

async function getPolygonApiKey(): Promise<string> {
  const { data, error } = await supabase
    .from('secrets')
    .select()
    .eq('key', 'POLYGON_API_KEY')
    .maybeSingle();

  if (error) {
    console.error('Error fetching API key:', error);
    throw new Error('Failed to fetch API key');
  }

  if (!data?.value) {
    throw new Error('API key not found');
  }

  return data.value;
}

export async function getStockQuote(symbol: string) {
  const POLYGON_API_KEY = await getPolygonApiKey();
  
  const response = await fetch(
    `${BASE_URL}/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export function useStockQuote(symbol: string) {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => getStockQuote(symbol),
    select: (data: StockQuoteResponse) => ({
      price: data.results[0].c,
      high: data.results[0].h,
      low: data.results[0].l,
      open: data.results[0].o,
      volume: data.results[0].v
    })
  });
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