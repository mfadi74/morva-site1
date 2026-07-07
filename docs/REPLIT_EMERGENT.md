# Uploading AchieveOS to Replit or Emergent

Both platforms run AchieveOS as a **web app** in your browser — no phone, no
Xcode, no local install. Great for showing the app to people and iterating on it.

The app works in **demo mode with zero configuration**, so you can get a live
preview link before touching any keys.

---

## Option A — Replit (recommended for iterating on the code)

### 1. Get the code into Replit
- **From GitHub:** In Replit, click **Create Repl → Import from GitHub** and
  paste this repository's URL. Replit pulls everything in.
- **From a zip:** Or create a blank **Node.js** Repl and drag-and-drop the
  project files into the file tree.

### 2. Install dependencies
Open the **Shell** tab and run:
```bash
npm install
```

### 3. Run it as a web app
```bash
npx expo start --web --port 3000
```
Replit auto-detects the web server and opens a **Webview** with a public URL you
can share. The AchieveOS welcome screen loads in demo mode.

> If Replit's preview looks blank, open the Webview URL in a **new browser tab** —
> some in-frame previews block the bundler's websocket.

### 4. (Optional) Turn on cloud + live AI
In Replit, open the **Secrets** panel (lock icon) and add:
| Key | Value |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `EXPO_PUBLIC_CLAUDE_API_KEY` | your Claude key *(dev only)* |

Then run the Supabase schema (`supabase/schema.sql`) once in your Supabase
dashboard, and restart the Repl. Secrets are injected as environment variables
automatically.

### 5. Build a static site (alternative hosting)
To produce a plain static build you can host anywhere:
```bash
npx expo export --platform web      # outputs the ./dist folder
```
Upload `dist/` to any static host (Replit Static Deployment, Netlify, Vercel, etc.).

---

## Option B — Emergent (or any AI app builder that takes a prompt + repo)

Emergent-style platforms accept an existing codebase and/or a build spec.
Give it these facts so it configures the environment correctly:

**Paste this as the project brief:**
> AchieveOS is an Expo (React Native + TypeScript) app using Expo Router.
> It builds for web with `npx expo export --platform web`, output folder `dist/`.
> Dev server: `npx expo start --web`. Node 20+. It runs in demo mode with no
> environment variables. To enable cloud sync + AI, set the environment
> variables `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and
> `EXPO_PUBLIC_CLAUDE_API_KEY`, and run `supabase/schema.sql` in Supabase.

**Configuration cheat-sheet for any host:**
| Setting | Value |
| --- | --- |
| Language / runtime | Node.js 20+ |
| Install command | `npm install` |
| Dev / preview command | `npx expo start --web --port 3000` |
| Build command | `npx expo export --platform web` |
| Output / publish directory | `dist` |
| Required env vars | none (demo) — optional trio above for full mode |

---

## Common questions

**Do I need API keys to see it work?**
No. Demo mode uses on-device storage and a built-in AI coach. Add keys only when
you want real accounts and live Claude responses.

**Will the mobile app (iOS/Android) also work from here?**
Replit/Emergent host the **web** version. For real App Store / Play Store
binaries, follow [`PUBLISHING.md`](PUBLISHING.md) — that uses Expo's EAS Build,
which runs from your computer or CI, not from these web IDEs.

**Where is my data in demo mode?**
In the browser's local storage. Clearing site data or signing out erases it —
turn on Supabase for durable, multi-device accounts.
