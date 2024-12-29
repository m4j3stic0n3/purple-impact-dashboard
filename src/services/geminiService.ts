import { supabase } from "@/integrations/supabase/client";

async function getGeminiApiKey(): Promise<string> {
  console.log('Fetching Gemini API key from Supabase Edge Function...');
  
  const { data, error } = await supabase.functions.invoke('get-gemini-key');

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
  }

  if (!data?.apiKey) {
    console.error('No Gemini API key found in response:', data);
    throw new Error('Gemini API key not found in response');
  }

  console.log('Successfully retrieved Gemini API key');
  return data.apiKey;
}

export async function chatWithGemini(message: string) {
  try {
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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from Gemini');
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Unexpected response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    throw error;
  }
}