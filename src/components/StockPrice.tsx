import React from 'react';
import { getStockQuote } from '../services/polygonService';
import { useQuery } from '@tanstack/react-query';

interface StockPriceProps {
  symbol: string;
}

export const StockPrice: React.FC<StockPriceProps> = ({ symbol }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stockPrice', symbol],
    queryFn: () => getStockQuote(symbol),
    refetchInterval: 60000
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching price</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h3>{symbol}</h3>
      <p>${data.price.toFixed(2)}</p>
    </div>
  );
};