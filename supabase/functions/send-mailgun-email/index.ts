import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN') || 'sandbox.mailgun.org'; // Default to sandbox domain

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();
    
    console.log('Attempting to send email with Mailgun:', { to, subject });

    const formData = new FormData();
    formData.append('from', `PEAK <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', html);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      }
    );

    const responseText = await response.text();
    console.log('Mailgun API response:', responseText);

    if (!response.ok) {
      throw new Error(`Mailgun API error: ${response.status} - ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);