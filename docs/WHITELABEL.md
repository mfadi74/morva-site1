# White-labeling AchieveOS (Phase 4)

AchieveOS can be re-skinned for a partner — an employer, a university, or a
reseller — so it ships under their name and colors. This is the "white-label"
piece of the guide's Phase 4.

## 1. One-file branding

Edit [`constants/branding.ts`](../constants/branding.ts):

```ts
export const BRANDING: Branding = {
  appName: 'CampusThrive',
  tagline: 'Student success, all in one place.',
  accent: '#2563EB',
  poweredBy: 'Powered by AchieveOS',
};
```

This controls, app-wide and live:
- the name + tagline on Welcome, Onboarding, and Profile
- the accent color on the tab bar, primary buttons, and the language switcher
- an optional "Powered by" line

Three ready presets (`achieveos`, `university`, `employer`) are in
`BRANDING_PRESETS` as starting points.

## 2. Full palette (optional)

For a deeper re-skin, edit the `colors` object in
[`constants/theme.ts`](../constants/theme.ts) — background, cards, text, and
the semantic colors. Keep contrast high; the app is dark-mode-first.

## 3. App identity (store listing)

For a separate app-store listing per partner:
- change `name`, `slug`, `ios.bundleIdentifier`, and `android.package` in
  [`app.json`](../app.json)
- swap the icons/splash in `assets/`
- build a separate binary with EAS (see [`PUBLISHING.md`](PUBLISHING.md))

## 4. Per-tenant at runtime (advanced)

To serve many orgs from one build, fetch the org's `Branding` from the
AchieveOS API (see [`API.md`](API.md)) after the user joins their org, and feed
it into a theme context. The current build resolves branding at build time,
which covers the common single-tenant white-label case.
