// AchieveOS Partner API (Phase 4) — reference edge function.
//
// A minimal, auth-guarded read API that partners (employers, universities,
// integrators) call to retrieve AGGREGATE, ANONYMIZED wellbeing data for their
// organization. It never exposes any individual user's records.
//
// Deploy:
//   supabase functions deploy achieveos-api
//   supabase secrets set ACHIEVEOS_API_KEYS="org_demo:northwind,org_acme:acme-corp"
//
// Auth: send `Authorization: Bearer <api_key>`. Each key maps to one org.
//
// Endpoints (GET):
//   /achieveos-api/health              → { ok: true }
//   /achieveos-api/org/summary         → org KPIs (members, active %, avg score)
//   /achieveos-api/org/engagement      → engagement by module
//   /achieveos-api/org/wellbeing       → anonymized wellbeing distribution
//
// This reference returns representative demo data; wire the queries to your
// own aggregate views (grouped, k-anonymized) before going live.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}

/** Map API keys → org ids from the ACHIEVEOS_API_KEYS secret. */
function resolveOrg(req: Request): string | null {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const raw = Deno.env.get('ACHIEVEOS_API_KEYS') ?? 'demo:demo-org';
  for (const pair of raw.split(',')) {
    const [key, org] = pair.split(':');
    if (key?.trim() === token) return org?.trim() ?? null;
  }
  return null;
}

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const url = new URL(req.url);
  const path = url.pathname.replace(/.*achieveos-api/, '') || '/';

  if (path === '/health') return json({ ok: true, service: 'achieveos-api', version: '1.0' });

  const org = resolveOrg(req);
  if (!org) return json({ error: 'Unauthorized — send Authorization: Bearer <api_key>' }, 401);

  switch (path) {
    case '/org/summary':
      return json({
        org,
        members: 1284,
        active_this_week_pct: 71,
        avg_life_score: 62,
        score_trend_7w: [54, 56, 55, 58, 60, 61, 62],
        generated_at: new Date().toISOString(),
      });
    case '/org/engagement':
      return json({
        org,
        by_module: [
          { module: 'mind', engagement_pct: 78 },
          { module: 'money', engagement_pct: 64 },
          { module: 'career', engagement_pct: 59 },
          { module: 'health', engagement_pct: 47 },
          { module: 'hustle', engagement_pct: 41 },
        ],
      });
    case '/org/wellbeing':
      return json({
        org,
        // k-anonymized buckets; suppressed if any bucket < k members.
        distribution: { thriving: 0.44, steady: 0.39, struggling: 0.17 },
        note: 'Aggregate only. No individual-level data is exposed.',
      });
    default:
      return json({ error: `Unknown endpoint: ${path}` }, 404);
  }
});
