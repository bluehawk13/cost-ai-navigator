
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_email } = await req.json();

    const response = await fetch(Deno.env.get('VITE_AGENT_API_URL')!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('VITE_AGENT_API_KEY')!
      },
      body: JSON.stringify({
        user_id: user_email || Deno.env.get('VITE_DEFAULT_USER_EMAIL'),
        agent_id: Deno.env.get('VITE_AGENT_ID'),
        session_id: Deno.env.get('VITE_SESSION_ID'),
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ response: data.response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-agent function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
