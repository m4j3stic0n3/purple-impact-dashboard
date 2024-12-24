import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://api.polygon.io";

export async function getStockQuote(symbol: string) {
  try {
    const { data: { POLYGON_API_KEY }, error } = await supabase
      .from('secrets')
      .select('POLYGON_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }

    const response = await fetch(
      `${BASE_URL}/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function getHistoricalData(symbol: string, from: string, to: string) {
  try {
    const { data: { POLYGON_API_KEY }, error } = await supabase
      .from('secrets')
      .select('POLYGON_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }

    const response = await fetch(
      `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

export async function getCompanyNews(symbol: string) {
  try {
    const { data: { POLYGON_API_KEY }, error } = await supabase
      .from('secrets')
      .select('POLYGON_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }

    const response = await fetch(
      `${BASE_URL}/v2/reference/news?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company news:', error);
    throw error;
  }
}