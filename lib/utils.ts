import { format, subDays } from 'date-fns';

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function dayKey(daysAgo: number): string {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
}

export function formatMoney(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Late night grind';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Translation key for the current time-of-day greeting. */
export function greetingKey(): string {
  const h = new Date().getHours();
  if (h < 5) return 'home.greeting.night';
  if (h < 12) return 'home.greeting.morning';
  if (h < 18) return 'home.greeting.afternoon';
  return 'home.greeting.evening';
}

/** Consecutive-day streak ending today or yesterday. */
export function computeStreak(activityDates: string[]): number {
  const days = new Set(activityDates);
  let streak = 0;
  // A streak is alive if there is activity today OR yesterday.
  let offset = days.has(todayKey()) ? 0 : 1;
  while (days.has(dayKey(offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

export function levelFromXp(xp: number): { level: number; intoLevel: number; forNext: number } {
  const level = Math.floor(xp / 100) + 1;
  return { level, intoLevel: xp % 100, forNext: 100 };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
