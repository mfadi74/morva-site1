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
