import { PolygonQuoteResponse } from './api/polygon/types';
import { mockStockData } from './api/polygon/mockData';
import { rateLimiter } from './api/polygon/rateLimiter';
import { makePolygonRequest } from './api/polygon/client';

export async function getStockQuote(symbol: string): Promise<PolygonQuoteResponse> {
  return rateLimiter.enqueueRequest(async () => {
    try {
      console.log(`Fetching stock quote for ${symbol}...`);
      
      // Ensure the symbol is properly formatted
      const formattedSymbol = symbol.trim().toUpperCase();
      
      // Make the API request with proper error handling
      const data = await makePolygonRequest(`/v2/aggs/ticker/${formattedSymbol}/prev`);
      
      if (!data?.results?.[0]) {
        console.log(`No data available for ${symbol}, using mock data`);
        return mockStockData[formattedSymbol] || {
          price: 0,
          change: 0,
          changePercent: 0,
          timestamp: Date.now()
        };
      }

      const result = data.results[0];
      const quote = {
        price: result.c,
        change: result.c - result.o,
        changePercent: ((result.c - result.o) / result.o) * 100,
        timestamp: result.t
      };

      rateLimiter.trackApiCall();
      return quote;
      
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      console.log(`Falling back to mock data for ${symbol}`);
      
      // Ensure we have a fallback for the symbol
      const fallbackData = mockStockData[symbol] || {
        price: 0,
        change: 0,
        changePercent: 0,
        timestamp: Date.now()
      };
      
      return fallbackData;
    }
  });
}