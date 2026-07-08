export type Lang = 'en' | 'es' | 'ar';

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

export type GrowthKey =
  | 'career'
  | 'skills'
  | 'health'
  | 'social'
  | 'brand'
  | 'green'
  | 'nest';

export interface GrowthScore {
  key: GrowthKey;
  label: string;
  score: number; // 0–100
  hasData: boolean;
}

// ── Phase 3 (Expansion) ─────────────────────────────────────────────

/** BrandSelf: personal-brand identity, set once. */
export interface BrandProfile {
  pillars: string[]; // up to 3 topics you want to be known for
  bio: string; // one-line personal pitch
  updated_at: string; // ISO timestamp
}

export interface BrandPost {
  id: string;
  platform: string; // e.g. TikTok, Instagram, LinkedIn, YouTube, X
  note: string;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

export interface GreenAction {
  id: string;
  category: string; // transport | food | waste | energy | shopping
  note: string;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

/** NestUp: a housing / independence goal, set once. */
export interface NestGoal {
  title: string; // e.g. "Move into my own place"
  target_amount: number; // deposit / savings target
  saved_amount: number;
  target_date: string; // yyyy-MM-dd (optional, '' if unset)
  checklist: string[]; // completed readiness-checklist keys
  updated_at: string; // ISO timestamp
}

export interface NestContribution {
  id: string;
  amount: number;
  date: string; // yyyy-MM-dd
  created_at: string; // ISO timestamp
}

/** Community: a post the user wrote in a peer circle (stored locally). */
export interface CommunityPost {
  id: string;
  circle: string; // circle key
  handle: string; // anonymous display handle
  text: string;
  likes: number;
  likedByMe: boolean;
  created_at: string; // ISO timestamp
}
