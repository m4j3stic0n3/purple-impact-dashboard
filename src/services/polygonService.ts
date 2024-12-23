import { useQuery } from '@tanstack/react-query';

const POLYGON_BASE_URL = 'https://api.polygon.io';

interface StockQuote {
  ticker: string;
  price: number;
  timestamp: number;
}

interface AggregateBar {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export const useStockQuote = (symbol: string) => {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: async () => {
      const response = await fetch(
        `${POLYGON_BASE_URL}/v2/last/trade/${symbol}?apiKey=${process.env.POLYGON_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stock quote');
      }
      const data = await response.json();
      return {
        ticker: data.results.symbol,
        price: data.results.price,
        timestamp: data.results.timestamp,
      } as StockQuote;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useHistoricalData = (symbol: string, from: string, to: string) => {
  return useQuery({
    queryKey: ['historicalData', symbol, from, to],
    queryFn: async () => {
      const response = await fetch(
        `${POLYGON_BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${process.env.POLYGON_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      const data = await response.json();
      return data.results.map((bar: any) => ({
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        timestamp: bar.t,
      })) as AggregateBar[];
    },
  });
};

// Example usage of news API
export const useCompanyNews = (symbol: string) => {
  return useQuery({
    queryKey: ['companyNews', symbol],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${POLYGON_BASE_URL}/v2/reference/news?ticker=${symbol}&published_utc=${today}&apiKey=${process.env.POLYGON_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch company news');
      }
      const data = await response.json();
      return data.results;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};