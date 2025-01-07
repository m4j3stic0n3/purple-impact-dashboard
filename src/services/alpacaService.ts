import { supabase } from "@/integrations/supabase/client";

interface AlpacaQuote {
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

async function getAlpacaApiKeys() {
  try {
    const { data: keyData, error: keyError } = await supabase.functions.invoke('get-alpaca-key');
    if (keyError) throw new Error(`Error fetching API key: ${keyError.message}`);
    
    const { data: secretData, error: secretError } = await supabase.functions.invoke('get-alpaca-secret');
    if (secretError) throw new Error(`Error fetching secret key: ${secretError.message}`);
    
    const apiKey = keyData?.apiKey;
    const secretKey = secretData?.secretKey;
    
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
    
    console.log(`Fetching quote for ${symbol} from Alpaca API`);
    
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Alpaca API error for ${symbol}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const price = (data.quote.ap + data.quote.bp) / 2; // Midpoint price
    
    const prevDay = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars/1Day?limit=2`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
      },
    });

    if (!prevDay.ok) {
      throw new Error(`Error fetching previous day data: ${prevDay.statusText}`);
    }

    const prevDayData = await prevDay.json();
    const prevClose = prevDayData.bars[0].c;
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