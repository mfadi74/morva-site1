# Publishing AchieveOS to the Apple App Store & Google Play

AchieveOS is an Expo app, so you build and submit with **EAS** (Expo Application
Services). You do **not** need a Mac to build for iOS — EAS builds in the cloud.

---

## 0. Prerequisites & accounts

| Item | Cost | Where |
| --- | --- | --- |
| Apple Developer Program | $99 / year | https://developer.apple.com |
| Google Play Developer | $25 one-time | https://play.google.com/console |
| Expo account | Free | https://expo.dev |

Install the CLI and sign in:
```bash
npm install -g eas-cli
eas login
```

---

## 1. Configure the project

The repo already includes [`eas.json`](../eas.json) and app identifiers in
[`app.json`](../app.json):
- iOS bundle identifier: `com.achieveos.app`
- Android package: `com.achieveos.app`

Link the project to your Expo account (writes an `extra.eas.projectId`):
```bash
eas build:configure
```

If you want cloud + AI in the store build, set the env vars as **EAS secrets**
so they're baked into the build (or, better, use the server-side proxy — see the
README's "Production AI setup"):
```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value https://xxxx.supabase.co
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value eyJ...
```

---

## 2. Build the binaries

```bash
# Both platforms at once
eas build --platform all

# …or one at a time
eas build --platform ios
eas build --platform android
```

This produces:
- **iOS:** a `.ipa` (App Store) — EAS handles signing; sign in with your Apple ID when prompted.
- **Android:** an `.aab` (Play Store). For sideloading/testing, use the `preview`
  profile which outputs an installable `.apk`:
  ```bash
  eas build --platform android --profile preview
  ```

---

## 3. Test before submitting

```bash
npx expo start        # smoke-test locally in Expo Go
```
Run through the checklist in the development guide:
sign up → onboarding → add income & expense → log a mood → navigate all 5 tabs →
start a hustle → sign out and back in.

For a wider beta, upload the build to **TestFlight** (iOS) or Play **Internal
testing** (Android) — `eas submit` can push to both.

---

## 4. Submit to the stores

```bash
eas submit --platform ios
eas submit --platform android
```

Follow prompts to connect your Apple App Store Connect and Google Play Console
accounts.

---

## 5. Store listing checklist

Both stores require these before review:

- [ ] **App icon** — 1024×1024 PNG, no transparency, no rounded corners (`assets/icon.png`)
- [ ] **Splash screen** — centred logo on the dark `#0F0F1A` background (already configured)
- [ ] **Screenshots** — at least 3 per device size (capture Home, Stillwell, LaunchPad)
- [ ] **Privacy policy URL** — required by both stores (generate a free one at Termly.io)
- [ ] **App description** — under 4,000 characters; include search keywords
- [ ] **Age rating questionnaire** — answer honestly (mood/journaling content)
- [ ] **Data safety / privacy form** — declare what you collect. In demo mode: nothing
      leaves the device. With Supabase: account email + the user's own logs, private via RLS.
- [ ] **Content moderation plan** — needed if you enable any user-generated/community
      features (Phase 3), not required for the Phase 1 MVP.

---

## 6. Over-the-air updates (after launch)

Ship JS-only fixes without a new store review:
```bash
eas update --branch production --message "Fix mood chart spacing"
```

---

## Budget recap (Year One)

| Item | Cost |
| --- | --- |
| Expo / EAS free tier | $0 |
| Supabase free tier (≤50k MAU) | $0 |
| Claude API (pay-per-use) | ~$20–100/mo |
| Apple Developer | $99/yr |
| Google Play | $25 once |
| Domain (achieveos.app) | ~$15/yr |
| **Total** | **~$140 to launch** |
