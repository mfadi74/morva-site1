# AchieveOS Partner API (Phase 4)

A small, auth-guarded REST API that partners — employers, universities, and
integrators — use to pull **aggregate, anonymized** wellbeing data for their
organization. It is the B2B/monetization surface from the development guide's
Phase 4 ("AchieveOS API").

> **Privacy first.** The API only ever returns aggregate, k-anonymized data.
> No endpoint exposes an individual user's records. This is a hard product
> and contractual guarantee, not a config option.

A working reference implementation ships in
[`supabase/functions/achieveos-api/`](../supabase/functions/achieveos-api/index.ts).

---

## Auth

Every request sends a bearer token:

```
Authorization: Bearer <api_key>
```

Each key maps to exactly one organization. Keys are configured server-side via
the `ACHIEVEOS_API_KEYS` secret (`key:org` pairs, comma-separated).

## Base URL

```
https://<your-project>.functions.supabase.co/achieveos-api
```

## Endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Liveness probe | none |
| GET | `/org/summary` | Members, weekly-active %, avg Life Score, 7-week trend | required |
| GET | `/org/engagement` | Engagement % by module | required |
| GET | `/org/wellbeing` | Anonymized wellbeing distribution (thriving/steady/struggling) | required |

### Example

```bash
curl https://<project>.functions.supabase.co/achieveos-api/org/summary \
  -H "Authorization: Bearer org_demo_key"
```

```json
{
  "org": "northwind",
  "members": 1284,
  "active_this_week_pct": 71,
  "avg_life_score": 62,
  "score_trend_7w": [54, 56, 55, 58, 60, 61, 62],
  "generated_at": "2026-07-08T12:00:00.000Z"
}
```

## Deploy

```bash
supabase functions deploy achieveos-api
supabase secrets set ACHIEVEOS_API_KEYS="org_demo_key:northwind"
```

## Going to production

The reference returns representative demo data. Before launch:

1. Back each endpoint with **aggregate SQL views** (grouped by org), never
   row-level queries.
2. Enforce **k-anonymity**: suppress any bucket with fewer than *k* members
   (e.g. k = 10) so small teams can't be de-anonymized.
3. Rate-limit and rotate API keys; log access for auditing.
4. Add write endpoints only if a partner use-case requires it (SSO provisioning,
   roster sync) — keep them scoped and least-privilege.

## In-app surface

The employer/university view of this data is the **Teams & organizations**
screen (Profile → Teams), which renders the same shape of aggregate metrics.
