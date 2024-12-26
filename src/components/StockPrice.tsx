import React from 'react';
import { getStockQuote } from '../services/polygonService';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StockPriceProps {
  symbol: string;
}

export const StockPrice: React.FC<StockPriceProps> = ({ symbol }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stockPrice', symbol],
    queryFn: () => getStockQuote(symbol),
    refetchInterval: 60000, // Fetch every minute due to rate limiting
    retry: 1 // Only retry once due to rate limiting
  });

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Error fetching price'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{symbol}</h3>
      <p className="text-2xl">${data.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500">End of day data</p>
    </div>
  );
};