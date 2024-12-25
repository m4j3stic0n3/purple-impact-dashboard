import { supabase } from "@/integrations/supabase/client";

async function getGeminiApiKey(): Promise<string> {
  console.log('Fetching Gemini API key from Supabase...');
  
  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('key', 'GEMINI_API_KEY')
    .maybeSingle();

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw new Error('Failed to fetch Gemini API key');
  }

  if (!data?.value) {
    console.error('Gemini API key not found in Supabase secrets');
    throw new Error('Gemini API key not found');
  }

  console.log('Successfully retrieved Gemini API key');
  return data.value;
}

export async function chatWithGemini(message: string) {
  console.log('Starting chat with Gemini...');
  const apiKey = await getGeminiApiKey();
  
  console.log('Making request to Gemini API...');
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: message
        }]
      }]
    })
  });

  if (!response.ok) {
    console.error('Gemini API error:', response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Received response from Gemini');
  return data.candidates[0].content.parts[0].text;
}