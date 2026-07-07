import { MoodLog, ModuleScore, Profile, SideHustle, Transaction } from '@/types';
import { clamp, computeStreak, dayKey } from '@/lib/utils';

/**
 * Financial Health Score (0–100).
 * Blend of savings rate (up to 60 pts) and tracking consistency (up to 40 pts).
 */
export function moneyScore(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  let savingsPts = 30; // neutral when there is no income logged yet
  if (income > 0) {
    const savingsRate = (income - expenses) / income; // 1 = saved everything
    savingsPts = clamp(Math.round(((savingsRate + 0.25) / 0.75) * 60), 0, 60);
  }

  // Consistency: how many of the last 14 days have at least one entry.
  const recentDays = new Set(
    transactions.map((t) => t.date).filter((d) => d >= dayKey(13)),
  );
  const consistencyPts = clamp(Math.round((recentDays.size / 7) * 40), 0, 40);

  return clamp(savingsPts + consistencyPts, 0, 100);
}

/** Mind Score (0–100): average mood over the last 7 days, plus check-in bonus. */
export function mindScore(moods: MoodLog[]): number {
  const weekAgo = dayKey(6);
  const recent = moods.filter((m) => m.logged_at.slice(0, 10) >= weekAgo);
  if (recent.length === 0) return 0;
  const avg = recent.reduce((s, m) => s + m.mood_score, 0) / recent.length; // 1–7
  const moodPts = Math.round(((avg - 1) / 6) * 70);
  const daysCheckedIn = new Set(recent.map((m) => m.logged_at.slice(0, 10))).size;
  const habitPts = Math.round((daysCheckedIn / 7) * 30);
  return clamp(moodPts + habitPts, 0, 100);
}

/** Hustle Score (0–100): roadmap progress plus income vs. goal. */
export function hustleScore(hustle: SideHustle | null): number {
  if (!hustle) return 0;
  const roadmapPts = Math.round((hustle.roadmap_step / 6) * 60);
  const incomePts =
    hustle.goal_income > 0
      ? clamp(Math.round((hustle.monthly_income / hustle.goal_income) * 40), 0, 40)
      : 0;
  return clamp(roadmapPts + incomePts, 0, 100);
}

/** Momentum Score (0–100): current streak, capped at 10 days. */
export function momentumScore(profile: Profile): number {
  return clamp(computeStreak(profile.activity_dates) * 10, 0, 100);
}

export function moduleScores(
  profile: Profile,
  transactions: Transaction[],
  moods: MoodLog[],
  hustle: SideHustle | null,
): ModuleScore[] {
  return [
    { key: 'money', label: 'MoneyMap', score: moneyScore(transactions) },
    { key: 'mind', label: 'Stillwell', score: mindScore(moods) },
    { key: 'hustle', label: 'LaunchPad', score: hustleScore(hustle) },
    { key: 'momentum', label: 'Momentum', score: momentumScore(profile) },
  ];
}

/** Life Score: weighted blend of all module scores. */
export function lifeScore(scores: ModuleScore[]): number {
  const weights: Record<ModuleScore['key'], number> = {
    money: 0.3,
    mind: 0.3,
    hustle: 0.25,
    momentum: 0.15,
  };
  const total = scores.reduce((s, m) => s + m.score * weights[m.key], 0);
  return clamp(Math.round(total), 0, 100);
}
