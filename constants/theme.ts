// AchieveOS design system — dark-mode-first, per the Gen Z research:
// 82% of Gen Z expect dark mode by default.
export const colors = {
  primary: '#6C63FF', // AchieveOS purple
  primarySoft: 'rgba(108, 99, 255, 0.16)',
  secondary: '#FF6584', // Accent pink
  secondarySoft: 'rgba(255, 101, 132, 0.16)',
  dark: '#0F0F1A', // App background
  card: '#1A1A2E', // Card background
  cardAlt: '#232338', // Elevated / pressed card
  border: '#2D2D44',
  text: '#E2E8F0', // Primary text
  muted: '#64748B', // Secondary / hint text
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.16)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.16)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.16)',
  gold: '#FBBF24',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  full: 999,
} as const;

export const font = {
  title: 30,
  heading: 22,
  subheading: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const;
