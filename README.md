# AchieveOS — *Your Life. Engineered.*

The Gen Z super-app. One platform, the life modules that matter most, an AI
coach in every screen, and gamified progress that actually keeps you coming
back. Built with **React Native + Expo**, so a single codebase runs on
**iOS, Android, and the web**.

> This is a working **Phase 1 MVP** built from the AchieveOS Development Guide.
> It runs out of the box in **local demo mode** — no accounts, no API keys, no
> setup — and upgrades to real cloud accounts + live Claude AI by adding two
> or three environment variables.

<p align="center"><em>Home · Stillwell · LaunchPad · Profile — dark-mode-first, thumb-friendly, gamified.</em></p>

---

## What's inside (Phase 1 MVP)

| Module | What it solves (Gen Z pain point) | Key features |
| --- | --- | --- |
| 🏠 **Home / Life Score** | "Am I actually making progress?" | A single 0–100 Life Score, per-module rings, daily AI insight, XP, levels, streaks |
| 💚 **Stillwell** (Mental health) | 40% stressed/anxious most of the time | 7-point mood check-in, emotion tags, private journaling with prompts, warm AI support, weekly mood chart |
| 💰 **MoneyMap** (Financial health) | 62% money-stressed 3+ days/week | Income/expense logging, net balance, Financial Health Score, category breakdown, AI spending tips |
| 🚀 **LaunchPad** (Side hustle) | 48–70% want a side hustle | 6 hustle lanes, a 30-day launch roadmap with XP, income tracker, AI hustle coach |
| 👤 **Profile** | Motivation & identity | Level/XP, streaks, a 14-badge achievement system, live app status |

### Phase 2 — Growth layer (also built ✅)

Accessed from the **Grow your life** section on Home; each feeds the Life Score.

| Module | Pain point | Key features |
| --- | --- | --- |
| 🧭 **CareerGPS** (Career) | 86% report burnout | Target role, action tracker (applications/networking/interviews), energy-vs-workload burnout check, AI career coach |
| 🎓 **Sprinto** (Skills) | 19% feel unprepared for work | Skill tracks across 6 categories, log practice hours toward a target, AI learning-path coach |
| 💪 **RootHealth** (Health) | Screen-time-driven burnout | Daily sleep/water/movement/screen logging, health score, weekly trend, AI nudge |
| 🫂 **Connekt** (Social) | Near-universal networking fear | Daily "brave move" challenges, connection log, AI conversation starters |

### Phase 3 — Expansion layer (also built ✅)

The **Grow your life** grid now holds all 7 modules; the **Community** section opens the peer circles.

| Module | Pain point | Key features |
| --- | --- | --- |
| 📣 **BrandSelf** (Personal brand) | 44% use social as their main business tool | Brand pillars + one-line bio, content-post streak by platform, AI content-idea coach |
| 🌱 **Greenprint** (Sustainability) | Climate is a top Gen Z concern | One-tap green actions by category, weekly impact chart & streak, AI eco tip |
| 🏠 **NestUp** (Housing) | Only 3.9% can rent alone | Housing goal + deposit savings tracker, 6-point readiness checklist, AI housing coach |
| 💬 **Community Layer** | Isolation & loneliness | Anonymous peer circles (burnout, money, hustle, study, anxiety), post + like, AI-safe framing |

**Cross-cutting, by design (straight from the research):**
- **Dark mode by default** — 82% of Gen Z expect it.
- **AI front-and-centre** — a coach card on every module, not hidden away.
- **Gamification that isn't a gimmick** — XP, levels, streaks, badges, shareable Life Score.
- **No paywall, generous free experience** — the whole MVP is free and works offline.
- **Privacy-first** — in demo mode nothing leaves the device.

---

## Run it in 3 commands

```bash
npm install
npx expo start          # scan the QR code with the Expo Go app on your phone
# press "w" for web, "i" for iOS simulator, "a" for Android emulator
```

That's it. The app boots straight into a working demo — create a profile,
log a mood, add a transaction, start a hustle, watch your Life Score climb.

### See it on your phone right now
1. Install **Expo Go** (App Store / Play Store).
2. Run `npx expo start`.
3. Scan the QR code. The app hot-reloads as you edit.

---

## Demo mode vs. full mode

| | Demo mode (default) | Full mode |
| --- | --- | --- |
| Setup | Nothing | Add env vars (below) |
| Accounts | Local guest profile | Real email/password via Supabase |
| Data | Stored on-device (AsyncStorage) | Synced to Supabase cloud |
| AI coach | Built-in offline coach | Live Claude AI |

### Turn on full mode

1. Copy the env template and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   EXPO_PUBLIC_CLAUDE_API_KEY=sk-ant-...        # dev/testing only — see below
   ```
2. In Supabase → **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. Restart `npx expo start`. Cloud accounts + live AI switch on automatically —
   the Profile tab shows the live status of each.

### ⚠️ Production AI setup (don't ship your API key)

`EXPO_PUBLIC_*` variables are bundled into the app and are **readable by users**.
For a real launch, keep the Claude key server-side:

1. Deploy the included edge function:
   ```bash
   supabase functions deploy ask-claude
   supabase secrets set CLAUDE_API_KEY=sk-ant-...
   ```
2. Point `askCoach()` in [`lib/ai.ts`](lib/ai.ts) at that function URL instead of
   `api.anthropic.com`, and drop `EXPO_PUBLIC_CLAUDE_API_KEY`.

The proxy lives in [`supabase/functions/ask-claude/`](supabase/functions/ask-claude/).

---

## Project structure

```
app/                     Expo Router screens (file-based routing)
  (auth)/                welcome · signup · login · onboarding
  (tabs)/                index(Home) · money · mental · hustle · profile
  _layout.tsx            root layout + hydration + achievement toasts
components/              ScoreRing, BarChart, CoachCard, AchievementToast, ui/
lib/                     supabase · ai (Claude) · scores · utils
stores/                  appStore (Zustand, local-first + cloud sync)
constants/               theme (colors/spacing) · content (modules, coach lines)
types/                   shared TypeScript models
supabase/                schema.sql + ask-claude edge function
assets/                  icons & splash
```

- **`stores/appStore.ts`** is the heart of the app: a local-first store that
  persists to the device and best-effort mirrors to Supabase when configured.
  Every user action flows through one `commit()` that also awards XP, unlocks
  achievements, and tracks streaks.
- **`lib/scores.ts`** computes each module score and the blended Life Score.
- **`lib/ai.ts`** is the single AI entry point with an automatic offline fallback.

---

## Ship to the App Store & Google Play

Full walkthrough in **[`docs/PUBLISHING.md`](docs/PUBLISHING.md)**. Short version:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all        # produces .ipa (iOS) + .aab (Android)
eas submit --platform all       # uploads to the stores
```

| Store | Cost | Register at |
| --- | --- | --- |
| Apple App Store | $99 / year | developer.apple.com |
| Google Play | $25 one-time | play.google.com/console |

---

## Prefer no-code hosting? Replit / Emergent

Want to preview and iterate without a local setup? See
**[`docs/REPLIT_EMERGENT.md`](docs/REPLIT_EMERGENT.md)** for step-by-step upload
instructions for both platforms (the app runs as a web app there instantly).

---

## Roadmap (from the guide)

- **Phase 1 — MVP (done ✅):** MoneyMap, Stillwell, LaunchPad, AI Goals + Life Score.
- **Phase 2 — Growth (core modules done ✅):** CareerGPS, Sprinto (skills), RootHealth, Connekt — all four built and wired into the Life Score. Still to come this phase: Plaid bank sync, therapist booking, Arabic + Spanish.
- **Phase 3 — Expansion (core modules done ✅):** BrandSelf, Greenprint, NestUp, and the Community layer — all built. Still to come this phase: real-time shared circles + moderation.
- **Phase 4 — Scale:** B2B wellness, multilingual, white-label, AchieveOS API.

**All 10 life modules from the guide are now implemented**, plus the AI Life-Score engine, gamification, and the community layer.

---

## Tech

React Native 0.86 · Expo SDK 57 · Expo Router · TypeScript · Zustand ·
Supabase · Claude API · react-native-svg. No secrets committed;
`.env` is git-ignored.

*AchieveOS — build one small thing, see it work, build the next. Progress compounds.*
