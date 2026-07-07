import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, MoodLog, Profile, SideHustle, Transaction } from '@/types';
import { ACHIEVEMENTS } from '@/constants/content';
import { cloudInsert } from '@/lib/supabase';
import { todayKey, uid } from '@/lib/utils';

const STORAGE_KEY = 'achieveos:v1';

interface PersistedState {
  profile: Profile | null;
  transactions: Transaction[];
  moods: MoodLog[];
  journal: JournalEntry[];
  hustle: SideHustle | null;
}

export interface NewTransaction {
  amount: number;
  category: string;
  description: string;
  type: Transaction['type'];
}

interface AppState extends PersistedState {
  hydrated: boolean;
  /** Achievement keys earned by the last action — used for toasts. */
  lastUnlocked: string[];

  hydrate: () => Promise<void>;
  createProfile: (fullName: string, country: string, isGuest: boolean) => Promise<void>;
  completeOnboarding: (focusAreas: string[]) => Promise<void>;
  addTransaction: (tx: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addMood: (moodScore: number, emotions: string[], notes: string) => Promise<void>;
  addJournal: (content: string, prompt: string) => Promise<void>;
  startHustle: (name: string, type: string, goalIncome: number) => Promise<void>;
  completeRoadmapStep: () => Promise<void>;
  logHustleIncome: (amount: number) => Promise<void>;
  clearUnlocked: () => void;
  signOutLocal: () => Promise<void>;
}

function emptyState(): PersistedState {
  return { profile: null, transactions: [], moods: [], journal: [], hustle: null };
}

async function persist(state: PersistedState): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profile: state.profile,
      transactions: state.transactions,
      moods: state.moods,
      journal: state.journal,
      hustle: state.hustle,
    }),
  );
}

export const useAppStore = create<AppState>((set, get) => {
  /** Merge changes, persist to device, and record gamification in one place. */
  async function commit(
    changes: Partial<PersistedState>,
    opts?: { xp?: number; achievement?: string },
  ): Promise<void> {
    const prev = get();
    let profile = changes.profile !== undefined ? changes.profile : prev.profile;
    const unlocked: string[] = [];

    if (profile && opts) {
      let xp = profile.xp_points + (opts.xp ?? 0);
      let achievements = profile.achievements;
      if (opts.achievement && !achievements.includes(opts.achievement)) {
        achievements = [...achievements, opts.achievement];
        unlocked.push(opts.achievement);
        xp += ACHIEVEMENTS.find((a) => a.key === opts.achievement)?.xp ?? 0;
      }
      // Level-5 meta achievement.
      if (xp >= 400 && !achievements.includes('level_5')) {
        achievements = [...achievements, 'level_5'];
        unlocked.push('level_5');
      }
      const activity = profile.activity_dates.includes(todayKey())
        ? profile.activity_dates
        : [...profile.activity_dates, todayKey()];
      profile = { ...profile, xp_points: xp, achievements, activity_dates: activity };
    }

    const next: PersistedState = {
      profile,
      transactions: changes.transactions ?? prev.transactions,
      moods: changes.moods ?? prev.moods,
      journal: changes.journal ?? prev.journal,
      hustle: changes.hustle !== undefined ? changes.hustle : prev.hustle,
    };
    set({ ...next, lastUnlocked: unlocked.length ? unlocked : prev.lastUnlocked });
    await persist(next);
  }

  return {
    ...emptyState(),
    hydrated: false,
    lastUnlocked: [],

    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as PersistedState;
          set({ ...emptyState(), ...saved, hydrated: true });
          return;
        }
      } catch {
        // Corrupted storage — start fresh rather than crash.
      }
      set({ ...emptyState(), hydrated: true });
    },

    createProfile: async (fullName, country, isGuest) => {
      const profile: Profile = {
        id: uid(),
        full_name: fullName.trim() || 'Achiever',
        country: country.trim(),
        focus_areas: [],
        xp_points: 0,
        achievements: [],
        activity_dates: [todayKey()],
        onboarding_complete: false,
        is_guest: isGuest,
        created_at: new Date().toISOString(),
      };
      await commit({ profile }, { achievement: 'first_login' });
    },

    completeOnboarding: async (focusAreas) => {
      const profile = get().profile;
      if (!profile) return;
      await commit({ profile: { ...profile, focus_areas: focusAreas, onboarding_complete: true } });
    },

    addTransaction: async (tx) => {
      const row: Transaction = {
        id: uid(),
        amount: Math.abs(tx.amount),
        category: tx.category,
        description: tx.description.trim(),
        type: tx.type,
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      const transactions = [row, ...get().transactions];
      const achievement = transactions.length >= 10 ? 'ten_transactions' : 'first_transaction';
      await commit({ transactions }, { xp: 10, achievement });
      void cloudInsert('transactions', {
        amount: row.amount,
        category: row.category,
        description: row.description,
        type: row.type,
        date: row.date,
      });
    },

    deleteTransaction: async (id) => {
      await commit({ transactions: get().transactions.filter((t) => t.id !== id) });
    },

    addMood: async (moodScore, emotions, notes) => {
      const row: MoodLog = {
        id: uid(),
        mood_score: moodScore,
        emotions,
        notes: notes.trim(),
        logged_at: new Date().toISOString(),
      };
      await commit({ moods: [row, ...get().moods] }, { xp: 15, achievement: 'first_mood' });
      void cloudInsert('mood_logs', {
        mood_score: row.mood_score,
        emotions: row.emotions,
        notes: row.notes,
      });
    },

    addJournal: async (content, prompt) => {
      const row: JournalEntry = {
        id: uid(),
        content: content.trim(),
        prompt,
        created_at: new Date().toISOString(),
      };
      await commit({ journal: [row, ...get().journal] }, { xp: 20, achievement: 'first_journal' });
      void cloudInsert('journal_entries', { content: row.content, prompt: row.prompt });
    },

    startHustle: async (name, type, goalIncome) => {
      const hustle: SideHustle = {
        id: uid(),
        name: name.trim(),
        type,
        status: 'planning',
        monthly_income: 0,
        goal_income: goalIncome,
        roadmap_step: 0,
        created_at: new Date().toISOString(),
      };
      await commit({ hustle }, { xp: 30, achievement: 'hustle_started' });
      void cloudInsert('side_hustles', {
        name: hustle.name,
        type: hustle.type,
        status: hustle.status,
        goal_income: hustle.goal_income,
      });
    },

    completeRoadmapStep: async () => {
      const hustle = get().hustle;
      if (!hustle || hustle.roadmap_step >= 6) return;
      const step = hustle.roadmap_step + 1;
      const done = step >= 6;
      await commit(
        { hustle: { ...hustle, roadmap_step: step, status: done ? 'launched' : hustle.status } },
        { xp: 25, achievement: done ? 'hustle_launched' : undefined },
      );
    },

    logHustleIncome: async (amount) => {
      const hustle = get().hustle;
      if (!hustle) return;
      await commit(
        {
          hustle: {
            ...hustle,
            monthly_income: hustle.monthly_income + Math.abs(amount),
            status: 'earning',
          },
        },
        { xp: 20, achievement: 'first_income' },
      );
    },

    clearUnlocked: () => set({ lastUnlocked: [] }),

    signOutLocal: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ ...emptyState(), hydrated: true, lastUnlocked: [] });
    },
  };
});
