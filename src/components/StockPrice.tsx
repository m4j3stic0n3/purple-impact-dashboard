import React from 'react';
import { useStockQuote } from '../services/polygonService';

interface StockPriceProps {
  symbol: string;
}

export const StockPrice: React.FC<StockPriceProps> = ({ symbol }) => {
  const { data, isLoading, error } = useStockQuote(symbol);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching price</div>;

  return (
    <div>
      <h3>{symbol}</h3>
      <p>${data?.price.toFixed(2)}</p>
    </div>
  );
};