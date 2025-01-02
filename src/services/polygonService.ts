import { supabase } from "@/integrations/supabase/client";
import { polygonRateLimiter } from "@/utils/rateLimiter";

export async function getPolygonApiKey() {
  const { data, error } = await supabase.functions.invoke('get-polygon-key');
  if (error) throw error;
  return data.key;
}

export async function getStockQuoteFromPolygon(symbol: string) {
  try {
    const apiKey = await getPolygonApiKey();
    
    return await polygonRateLimiter.enqueue(async () => {
      console.log(`Fetching quote for ${symbol} from Polygon API`);
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.results?.[0]) {
        throw new Error('No data available');
      }

      const result = data.results[0];
      return {
        price: result.c,
        change: result.c - result.o,
        changePercent: ((result.c - result.o) / result.o) * 100,
        timestamp: new Date().getTime()
      };
    });
  } catch (error) {
    console.error('Error fetching from Polygon:', error);
    throw error;
  }
}