import {
  CareerAction,
  CareerProfile,
  Connection,
  GrowthScore,
  HealthLog,
  MoodLog,
  ModuleScore,
  Profile,
  SideHustle,
  Skill,
  Transaction,
} from '@/types';
import { HEALTH_TARGETS } from '@/constants/content';
import { clamp, computeStreak, dayKey, todayKey } from '@/lib/utils';

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

// ── Phase 2 (Growth) module scores ──────────────────────────────────

/** CareerGPS readiness (0–100): recent momentum + energy vs. workload balance. */
export function careerScore(actions: CareerAction[], career: CareerProfile | null): number {
  const recent = actions.filter((a) => a.date >= dayKey(29)).length;
  const momentumPts = clamp(Math.round((recent / 10) * 60), 0, 60); // 10 actions/mo = full
  let balancePts = 0;
  if (career) {
    // High energy, sustainable workload → healthier career state.
    const energy = clamp(career.energy, 1, 5);
    const workload = clamp(career.workload, 1, 5);
    balancePts = clamp(Math.round(((energy - workload + 4) / 8) * 40), 0, 40);
  }
  if (actions.length === 0 && !career) return 0;
  return clamp(momentumPts + balancePts, 0, 100);
}

/** Sprinto skills (0–100): average progress toward each skill's target hours. */
export function skillsScore(skills: Skill[]): number {
  if (skills.length === 0) return 0;
  const avg =
    skills.reduce((s, k) => s + clamp(k.logged_hours / Math.max(1, k.target_hours), 0, 1), 0) /
    skills.length;
  return clamp(Math.round(avg * 100), 0, 100);
}

/** RootHealth (0–100): today's habits vs. targets (sleep, water, movement, screen). */
export function healthScore(logs: HealthLog[]): number {
  const today = logs.find((l) => l.date === todayKey());
  const latest = today ?? [...logs].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return 0;
  const sleep = clamp(latest.sleep_hours / HEALTH_TARGETS.sleep_hours, 0, 1);
  const water = clamp(latest.water_cups / HEALTH_TARGETS.water_cups, 0, 1);
  const moved = clamp(latest.moved_minutes / HEALTH_TARGETS.moved_minutes, 0, 1);
  // Screen time: at/under target = full marks, scaling down as it doubles.
  const screen = clamp(
    1 - Math.max(0, latest.screen_hours - HEALTH_TARGETS.screen_hours_max) / HEALTH_TARGETS.screen_hours_max,
    0,
    1,
  );
  return clamp(Math.round(((sleep + water + moved + screen) / 4) * 100), 0, 100);
}

/** Connekt social confidence (0–100): recent brave actions + real connections. */
export function socialScore(connections: Connection[], challengesLast7: number): number {
  if (connections.length === 0 && challengesLast7 === 0) return 0;
  const recentConnections = connections.filter((c) => c.date >= dayKey(29)).length;
  const connectionPts = clamp(Math.round((recentConnections / 8) * 55), 0, 55);
  const challengePts = clamp(Math.round((challengesLast7 / 7) * 45), 0, 45);
  return clamp(connectionPts + challengePts, 0, 100);
}

export function growthScores(
  actions: CareerAction[],
  career: CareerProfile | null,
  skills: Skill[],
  health: HealthLog[],
  connections: Connection[],
  challengesLast7: number,
): GrowthScore[] {
  return [
    {
      key: 'career',
      label: 'CareerGPS',
      score: careerScore(actions, career),
      hasData: actions.length > 0 || !!career,
    },
    { key: 'skills', label: 'Sprinto', score: skillsScore(skills), hasData: skills.length > 0 },
    { key: 'health', label: 'RootHealth', score: healthScore(health), hasData: health.length > 0 },
    {
      key: 'social',
      label: 'Connekt',
      score: socialScore(connections, challengesLast7),
      hasData: connections.length > 0 || challengesLast7 > 0,
    },
  ];
}

/** Average of only the growth modules the user has actually started. */
export function growthAverage(scores: GrowthScore[]): number {
  const active = scores.filter((s) => s.hasData);
  if (active.length === 0) return 0;
  return clamp(Math.round(active.reduce((s, m) => s + m.score, 0) / active.length), 0, 100);
}

/**
 * Life Score: weighted blend of the core modules plus the Growth layer.
 * Growth only counts once the user starts a Phase 2 module, so it never
 * drags the score down before they've engaged with it.
 */
export function lifeScore(scores: ModuleScore[], growth?: GrowthScore[]): number {
  const active = growth?.filter((g) => g.hasData) ?? [];
  const hasGrowth = active.length > 0;
  const weights: Record<ModuleScore['key'], number> = hasGrowth
    ? { money: 0.24, mind: 0.24, hustle: 0.2, momentum: 0.12 }
    : { money: 0.3, mind: 0.3, hustle: 0.25, momentum: 0.15 };
  let total = scores.reduce((s, m) => s + m.score * weights[m.key], 0);
  if (hasGrowth) total += growthAverage(active) * 0.2;
  return clamp(Math.round(total), 0, 100);
}
