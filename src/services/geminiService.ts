import { supabase } from "@/integrations/supabase/client";

async function getGeminiApiKey(): Promise<string> {
  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('key', 'GEMINI_API_KEY')
    .single();

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw new Error('Failed to fetch Gemini API key');
  }

  if (!data?.value) {
    throw new Error('Gemini API key not found');
  }

  return data.value;
}

export async function chatWithGemini(message: string) {
  const apiKey = await getGeminiApiKey();
  
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}