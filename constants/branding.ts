// ── White-label branding ────────────────────────────────────────────
// This single file controls the app's identity. For a white-label
// deployment (an employer, a university, a partner), change the values
// here — no other code changes needed for name/tagline/accent.
//
// To fully re-skin the palette, also edit `constants/theme.ts` (the
// `colors` object). `accent` below is surfaced via `useAccent()` for the
// surfaces that read branding dynamically.

export interface Branding {
  appName: string;
  tagline: string;
  accent: string; // primary brand color
  /** Optional partner/org label shown on the profile ("Powered by …"). */
  poweredBy?: string;
}

export const BRANDING: Branding = {
  appName: 'AchieveOS',
  tagline: 'Your life. Engineered.',
  accent: '#6C63FF',
  poweredBy: undefined,
};

// Example white-label presets a partner could switch to (see docs/WHITELABEL.md).
export const BRANDING_PRESETS: Record<string, Branding> = {
  achieveos: { appName: 'AchieveOS', tagline: 'Your life. Engineered.', accent: '#6C63FF' },
  university: {
    appName: 'CampusThrive',
    tagline: 'Student success, all in one place.',
    accent: '#2563EB',
    poweredBy: 'Powered by AchieveOS',
  },
  employer: {
    appName: 'WellWorks',
    tagline: 'Wellbeing that works.',
    accent: '#0EA5E9',
    poweredBy: 'Powered by AchieveOS',
  },
};
