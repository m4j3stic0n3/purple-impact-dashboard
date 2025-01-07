import { supabase } from "@/integrations/supabase/client";

export interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
  timestamp?: number;
}

export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-polygon-key');
    if (error) throw error;

    const polygonKey = data.key;
    const baseUrl = 'https://api.polygon.io/v2';
    const endpoint = `/aggs/ticker/${symbol}/prev`;
    
    const response = await fetch(`${baseUrl}${endpoint}?apiKey=${polygonKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.results || result.results.length === 0) {
      throw new Error('No data available for this symbol');
    }

    const quote = result.results[0];
    
    return {
      price: quote.c,
      change: quote.c - quote.o,
      changePercent: ((quote.c - quote.o) / quote.o) * 100,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}