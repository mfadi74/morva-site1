import { OFFLINE_COACH } from '@/constants/content';

const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const model = process.env.EXPO_PUBLIC_CLAUDE_MODEL || 'claude-sonnet-5';

export const isAiLive = Boolean(apiKey);

export type CoachContext =
  | 'lowMood'
  | 'midMood'
  | 'highMood'
  | 'money'
  | 'hustle'
  | 'general'
  | 'career'
  | 'skills'
  | 'health'
  | 'social'
  | 'brand'
  | 'green'
  | 'nest'
  | 'community';

const SYSTEM_PROMPT = `You are the AI coach inside AchieveOS, a life super-app for Gen Z.
Help users with mental health, money, side hustles, and personal growth.
Keep responses short (2-4 sentences), warm, conversational, and actionable.
Never be clinical, preachy, or corporate. You can use at most one emoji.
You are not a therapist: for serious distress, gently suggest talking to
someone they trust or a professional.`;

function offlineLine(context: CoachContext): string {
  const pool = OFFLINE_COACH[context];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Ask the AchieveOS coach. Uses the Claude API when a key is configured;
 * otherwise falls back to the built-in offline coach so the app always works.
 *
 * ⚠️ Shipping an API key inside a public app exposes it. For production,
 * point this at the Supabase Edge Function proxy (supabase/functions/ask-claude)
 * and keep the key server-side.
 */
export async function askCoach(prompt: string, context: CoachContext = 'general'): Promise<string> {
  if (!apiKey) return offlineLine(context);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for calls from browsers (Expo web). See note above:
        // production apps should proxy this call server-side instead.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return offlineLine(context);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === 'text')?.text;
    return text?.trim() || offlineLine(context);
  } catch {
    return offlineLine(context);
  }
}
