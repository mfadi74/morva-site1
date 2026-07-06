# NORCO Executive Suite

A single-file React application: **30 executive AI agents** for NORCO General Trading L.L.C. and MORVA L.L.C., built around one locked source of business truth, a document-aware **Company Brain**, full **Arabic** support, and **voice** input/output.

The entire app lives in [`norco-executive-suite.jsx`](norco-executive-suite.jsx) — the same format as before, so you can keep using it exactly the way you do today (paste it into Claude as an artifact, or drop it into any React project such as a Replit/Vite app).

## What's inside

| Layer | What it does |
|---|---|
| **30 Agents** (was 18) | Six departments. New agents: Executive Assistant, Business Developer, Investor Relations, Software Engineer, Environmental Analyst, Social Media Manager, Copywriter, Public Relations, Advertising Manager, SEO Specialist, Electrical Technical Advisor, Data Analyst |
| **Company Brain** 🧠 | Connects to your Dropbox (or takes pasted documents), reads each document, writes an executive summary, extracts key facts, and files it under one of 10 professional categories. Every agent automatically receives this knowledge in its context |
| **Boardroom** | One question → up to 5 agents answer side by side (now Brain-aware) |
| **AI Network** 🌐 | Ask Claude, GPT (OpenAI) and Gemini (Google) the same question side by side |
| **Voice** 🎤🔊 | Microphone button on every input (English + Arabic speech recognition); every answer can be read aloud; optional auto-speak mode |
| **Full Arabic** | Interface language toggle (complete RTL layout, Arabic agent names and labels), Arabic output mode for all agents, Arabic voice in and out |
| **Library / Business Core / Settings** | Saved outputs, the locked truth layer, and a connections panel |

## Setup

### 1. Company Brain — Dropbox

Apps cannot log into Dropbox with your email/password; the professional way is an API token (takes ~5 minutes, free):

1. Go to **dropbox.com/developers** → *App Console* → **Create app**
2. Choose *Scoped access* → *Full Dropbox* → name it (e.g. `NORCO-Brain`)
3. **Permissions** tab: enable `files.metadata.read` and `files.content.read` → Submit
4. **Settings** tab: click **Generate** under *Generated access token*
5. Paste the token into the app: **Settings → Dropbox** (optionally set a folder like `/NORCO`)
6. Open **Company Brain → Sync Dropbox documents**

Supported file types today: `.txt` `.md` `.csv` `.json`. Export Word/PDF documents to text for now (native PDF/DOCX reading is a good next step — it needs a small backend).

You can also paste any document directly in **Company Brain → Add a document manually** — no Dropbox needed.

### 2. Other AI accounts (important)

No application can log into consumer **ChatGPT / Claude / Gemini subscription accounts** — the providers do not allow it. The professional equivalent is **API keys**, which give the agents the same models on a pay-per-use basis:

- OpenAI (GPT): platform.openai.com → API keys
- Google (Gemini): aistudio.google.com → Get API key
- Anthropic (Claude): console.anthropic.com — only needed if you host the app **outside** Claude; inside Claude it works with no key

Paste them in **Settings → AI providers**, then use the **AI Network** view. Keys are stored only in the app's own local storage.

### 3. Voice

Works out of the box in **Chrome or Edge** (uses the browser's built-in speech engine — no key needed). The 🎤 button appears next to every input; **Listen** on any answer reads it aloud; the 🔊 toggle in the top bar auto-reads every new answer. Arabic recognition and speech are supported.

### 4. Arabic

- **Interface: عربي** toggle in the top bar switches the whole UI to Arabic with proper right-to-left layout and Arabic agent names.
- The **EN / عربي / EN+AR** toggle controls the language agents *answer* in (independent of the interface language).

## Technical notes

- Default model: `claude-opus-4-8` (configurable via settings storage).
- Storage: uses the hosted `window.storage` API when available (Claude artifacts), otherwise `localStorage` — chats, Brain, library and settings all persist.
- If you deploy it as a standalone site, add your Anthropic API key in Settings; the app then calls the API directly from the browser.
