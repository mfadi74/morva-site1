// Supabase Edge Function: secure Claude proxy for AchieveOS.
//
// Why: shipping an API key inside a mobile/web app exposes it to anyone.
// This function keeps the key server-side. Deploy with:
//   supabase functions deploy ask-claude
//   supabase secrets set CLAUDE_API_KEY=sk-ant-...
//
// Then point the app at it by calling this URL from lib/ai.ts instead of
// api.anthropic.com directly (see README → "Production AI setup").

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const MODEL = Deno.env.get('CLAUDE_MODEL') || 'claude-sonnet-5';

const SYSTEM_PROMPT = `You are the AI coach inside AchieveOS, a life super-app for Gen Z.
Help users with mental health, money, side hustles, and personal growth.
Keep responses short (2-4 sentences), warm, conversational, and actionable.
Never be clinical, preachy, or corporate. You can use at most one emoji.
You are not a therapist: for serious distress, gently suggest talking to
someone they trust or a professional.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { prompt } = await req.json();
    if (!CLAUDE_API_KEY) {
      return new Response(JSON.stringify({ error: 'CLAUDE_API_KEY not set' }), {
        status: 500,
        headers: { ...CORS, 'content-type': 'application/json' },
      });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: String(prompt ?? '') }],
      }),
    });

    const data = await res.json();
    const text =
      data?.content?.find((c: { type: string }) => c.type === 'text')?.text ??
      'Keep going — one small step today beats a perfect plan tomorrow.';

    return new Response(JSON.stringify({ text }), {
      headers: { ...CORS, 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'content-type': 'application/json' },
    });
  }
});
