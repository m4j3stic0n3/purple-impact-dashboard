import { supabase } from "@/integrations/supabase/client";

interface AlpacaQuote {
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

async function getAlpacaApiKeys() {
  try {
    const { data: { apiKey } } = await supabase.functions.invoke('get-alpaca-key');
    const { data: { secretKey } } = await supabase.functions.invoke('get-alpaca-secret');
    
    if (!apiKey || !secretKey) {
      throw new Error('Alpaca API keys not found');
    }

    return { apiKey, secretKey };
  } catch (error) {
    console.error('Error fetching Alpaca API keys:', error);
    throw error;
  }
}

export async function getStockQuote(symbol: string): Promise<AlpacaQuote> {
  try {
    const { apiKey, secretKey } = await getAlpacaApiKeys();
    
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.statusText}`);
    }

    const data = await response.json();
    const price = (data.quote.ap + data.quote.bp) / 2; // Midpoint price
    const prevDay = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars/1Day?limit=2`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
      },
    }).then(res => res.json());

    const prevClose = prevDay.bars[0].c;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return {
      price,
      change,
      changePercent,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} from Alpaca:`, error);
    throw error;
  }
}