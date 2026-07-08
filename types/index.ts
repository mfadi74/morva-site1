export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

export interface MoodLog {
  id: string;
  mood_score: number; // 1–7 emoji scale
  emotions: string[];
  notes: string;
  logged_at: string; // ISO timestamp
}

export interface JournalEntry {
  id: string;
  content: string;
  prompt: string;
  created_at: string; // ISO timestamp
}

export type HustleStatus = 'planning' | 'launched' | 'earning';

export interface SideHustle {
  id: string;
  name: string;
  type: string; // key of a hustle category
  status: HustleStatus;
  monthly_income: number;
  goal_income: number;
  roadmap_step: number; // 0–6 completed milestones
  created_at: string; // ISO timestamp
}

export interface Profile {
  id: string;
  full_name: string;
  country: string;
  focus_areas: string[]; // module keys picked during onboarding
  xp_points: number;
  achievements: string[]; // earned achievement keys
  activity_dates: string[]; // yyyy-MM-dd days with at least one action (streaks)
  onboarding_complete: boolean;
  is_guest: boolean;
  created_at: string; // ISO timestamp
}

export interface ModuleScore {
  key: 'money' | 'mind' | 'hustle' | 'momentum';
  label: string;
  score: number; // 0–100
}

// ── Phase 2 (Growth) ────────────────────────────────────────────────

export type CareerActionType = 'application' | 'networking' | 'interview' | 'learning';

export interface CareerAction {
  id: string;
  type: CareerActionType;
  note: string;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  target_hours: number;
  logged_hours: number;
  created_at: string; // ISO timestamp
}

export interface HealthLog {
  date: string; // yyyy-MM-dd — one row per day (upserted)
  sleep_hours: number;
  water_cups: number;
  moved_minutes: number;
  screen_hours: number;
  updated_at: string; // ISO timestamp
}

export interface Connection {
  id: string;
  name: string;
  context: string;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

/** Career target + burnout state, stored once per user. */
export interface CareerProfile {
  target_role: string;
  energy: number; // 1–5 self-rated energy (inverse burnout signal)
  workload: number; // 1–5 self-rated workload
  updated_at: string; // ISO timestamp
}

export type GrowthKey = 'career' | 'skills' | 'health' | 'social';

export interface GrowthScore {
  key: GrowthKey;
  label: string;
  score: number; // 0–100
  hasData: boolean;
}
