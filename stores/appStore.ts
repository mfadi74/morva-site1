import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BrandPost,
  BrandProfile,
  CareerAction,
  CareerActionType,
  CareerProfile,
  CommunityPost,
  Connection,
  GreenAction,
  HealthLog,
  JournalEntry,
  MoodLog,
  NestContribution,
  NestGoal,
  Profile,
  SideHustle,
  Skill,
  Transaction,
} from '@/types';
import { ACHIEVEMENTS, CAREER_ACTIONS } from '@/constants/content';
import { cloudInsert } from '@/lib/supabase';
import { todayKey, uid } from '@/lib/utils';

const STORAGE_KEY = 'achieveos:v1';

/** A completed daily social challenge (Connekt). */
export interface SocialChallengeLog {
  key: string;
  date: string; // yyyy-MM-dd
}

interface PersistedState {
  profile: Profile | null;
  transactions: Transaction[];
  moods: MoodLog[];
  journal: JournalEntry[];
  hustle: SideHustle | null;
  // Phase 2 (Growth)
  careerActions: CareerAction[];
  careerProfile: CareerProfile | null;
  skills: Skill[];
  healthLogs: HealthLog[];
  connections: Connection[];
  socialChallenges: SocialChallengeLog[];
  // Phase 3 (Expansion)
  brandProfile: BrandProfile | null;
  brandPosts: BrandPost[];
  greenActions: GreenAction[];
  nestGoal: NestGoal | null;
  nestContributions: NestContribution[];
  communityPosts: CommunityPost[];
}

export interface HealthInput {
  sleep_hours: number;
  water_cups: number;
  moved_minutes: number;
  screen_hours: number;
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
  // Phase 2 (Growth)
  saveCareerProfile: (targetRole: string, energy: number, workload: number) => Promise<void>;
  logCareerAction: (type: CareerActionType, note: string) => Promise<void>;
  addSkill: (name: string, category: string, targetHours: number) => Promise<void>;
  logSkillHours: (id: string, hours: number) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  saveHealthToday: (input: HealthInput) => Promise<void>;
  toggleSocialChallenge: (key: string, xp: number) => Promise<void>;
  addConnection: (name: string, context: string) => Promise<void>;
  // Phase 3 (Expansion)
  saveBrandProfile: (pillars: string[], bio: string) => Promise<void>;
  addBrandPost: (platform: string, note: string) => Promise<void>;
  logGreenAction: (category: string, note: string, xp: number) => Promise<void>;
  setNestGoal: (title: string, targetAmount: number, targetDate: string) => Promise<void>;
  addNestContribution: (amount: number) => Promise<void>;
  toggleNestChecklist: (key: string) => Promise<void>;
  addCommunityPost: (circle: string, handle: string, text: string) => Promise<void>;
  toggleCommunityLike: (id: string) => Promise<void>;
  clearUnlocked: () => void;
  signOutLocal: () => Promise<void>;
}

function emptyState(): PersistedState {
  return {
    profile: null,
    transactions: [],
    moods: [],
    journal: [],
    hustle: null,
    careerActions: [],
    careerProfile: null,
    skills: [],
    healthLogs: [],
    connections: [],
    socialChallenges: [],
    brandProfile: null,
    brandPosts: [],
    greenActions: [],
    nestGoal: null,
    nestContributions: [],
    communityPosts: [],
  };
}

async function persist(state: PersistedState): Promise<void> {
  const snapshot: PersistedState = {
    profile: state.profile,
    transactions: state.transactions,
    moods: state.moods,
    journal: state.journal,
    hustle: state.hustle,
    careerActions: state.careerActions,
    careerProfile: state.careerProfile,
    skills: state.skills,
    healthLogs: state.healthLogs,
    connections: state.connections,
    socialChallenges: state.socialChallenges,
    brandProfile: state.brandProfile,
    brandPosts: state.brandPosts,
    greenActions: state.greenActions,
    nestGoal: state.nestGoal,
    nestContributions: state.nestContributions,
    communityPosts: state.communityPosts,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
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
      careerActions: changes.careerActions ?? prev.careerActions,
      careerProfile: changes.careerProfile !== undefined ? changes.careerProfile : prev.careerProfile,
      skills: changes.skills ?? prev.skills,
      healthLogs: changes.healthLogs ?? prev.healthLogs,
      connections: changes.connections ?? prev.connections,
      socialChallenges: changes.socialChallenges ?? prev.socialChallenges,
      brandProfile: changes.brandProfile !== undefined ? changes.brandProfile : prev.brandProfile,
      brandPosts: changes.brandPosts ?? prev.brandPosts,
      greenActions: changes.greenActions ?? prev.greenActions,
      nestGoal: changes.nestGoal !== undefined ? changes.nestGoal : prev.nestGoal,
      nestContributions: changes.nestContributions ?? prev.nestContributions,
      communityPosts: changes.communityPosts ?? prev.communityPosts,
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

    // ── Phase 2: CareerGPS ──────────────────────────────────────────
    saveCareerProfile: async (targetRole, energy, workload) => {
      const careerProfile: CareerProfile = {
        target_role: targetRole.trim(),
        energy,
        workload,
        updated_at: new Date().toISOString(),
      };
      const isFirst = !get().careerProfile && get().careerActions.length === 0;
      await commit({ careerProfile }, { xp: 10, achievement: isFirst ? 'first_career' : undefined });
    },

    logCareerAction: async (type, note) => {
      const row: CareerAction = {
        id: uid(),
        type,
        note: note.trim(),
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      const isFirst = get().careerActions.length === 0 && !get().careerProfile;
      const xp = CAREER_ACTIONS.find((a) => a.key === type)?.xp ?? 10;
      await commit(
        { careerActions: [row, ...get().careerActions] },
        { xp, achievement: isFirst ? 'first_career' : undefined },
      );
    },

    // ── Phase 2: Sprinto (skills) ───────────────────────────────────
    addSkill: async (name, category, targetHours) => {
      const row: Skill = {
        id: uid(),
        name: name.trim(),
        category,
        target_hours: targetHours > 0 ? targetHours : 20,
        logged_hours: 0,
        created_at: new Date().toISOString(),
      };
      const isFirst = get().skills.length === 0;
      await commit({ skills: [row, ...get().skills] }, { xp: 15, achievement: isFirst ? 'first_skill' : undefined });
    },

    logSkillHours: async (id, hours) => {
      const skills = get().skills.map((s) =>
        s.id === id ? { ...s, logged_hours: s.logged_hours + Math.abs(hours) } : s,
      );
      await commit({ skills }, { xp: 10 });
    },

    deleteSkill: async (id) => {
      await commit({ skills: get().skills.filter((s) => s.id !== id) });
    },

    // ── Phase 2: RootHealth ─────────────────────────────────────────
    saveHealthToday: async (input) => {
      const today = todayKey();
      const existing = get().healthLogs.find((l) => l.date === today);
      const row: HealthLog = { date: today, ...input, updated_at: new Date().toISOString() };
      const healthLogs = existing
        ? get().healthLogs.map((l) => (l.date === today ? row : l))
        : [row, ...get().healthLogs];
      await commit(
        { healthLogs },
        { xp: existing ? 0 : 15, achievement: get().healthLogs.length === 0 ? 'first_health' : undefined },
      );
      void cloudInsert('health_logs', {
        sleep_hours: input.sleep_hours,
        water_cups: input.water_cups,
        moved_minutes: input.moved_minutes,
        screen_hours: input.screen_hours,
        date: today,
      });
    },

    // ── Phase 2: Connekt ────────────────────────────────────────────
    toggleSocialChallenge: async (key, xp) => {
      const today = todayKey();
      const done = get().socialChallenges.some((c) => c.key === key && c.date === today);
      if (done) {
        // Un-complete: remove the record (no XP change to keep it simple/honest).
        await commit({
          socialChallenges: get().socialChallenges.filter((c) => !(c.key === key && c.date === today)),
        });
        return;
      }
      const isFirst = get().socialChallenges.length === 0 && get().connections.length === 0;
      await commit(
        { socialChallenges: [{ key, date: today }, ...get().socialChallenges] },
        { xp, achievement: isFirst ? 'first_social' : undefined },
      );
    },

    addConnection: async (name, context) => {
      const row: Connection = {
        id: uid(),
        name: name.trim(),
        context: context.trim(),
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      const isFirst = get().connections.length === 0 && get().socialChallenges.length === 0;
      await commit(
        { connections: [row, ...get().connections] },
        { xp: 15, achievement: isFirst ? 'first_social' : undefined },
      );
    },

    // ── Phase 3: BrandSelf ──────────────────────────────────────────
    saveBrandProfile: async (pillars, bio) => {
      const brandProfile: BrandProfile = {
        pillars: pillars.slice(0, 3),
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      };
      const isFirst = !get().brandProfile && get().brandPosts.length === 0;
      await commit({ brandProfile }, { xp: 10, achievement: isFirst ? 'first_brand' : undefined });
    },

    addBrandPost: async (platform, note) => {
      const row: BrandPost = {
        id: uid(),
        platform,
        note: note.trim(),
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      const isFirst = !get().brandProfile && get().brandPosts.length === 0;
      await commit(
        { brandPosts: [row, ...get().brandPosts] },
        { xp: 15, achievement: isFirst ? 'first_brand' : undefined },
      );
    },

    // ── Phase 3: Greenprint ─────────────────────────────────────────
    logGreenAction: async (category, note, xp) => {
      const row: GreenAction = {
        id: uid(),
        category,
        note: note.trim(),
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      const isFirst = get().greenActions.length === 0;
      await commit(
        { greenActions: [row, ...get().greenActions] },
        { xp, achievement: isFirst ? 'first_green' : undefined },
      );
      void cloudInsert('green_actions', { category: row.category, note: row.note, date: row.date });
    },

    // ── Phase 3: NestUp ─────────────────────────────────────────────
    setNestGoal: async (title, targetAmount, targetDate) => {
      const existing = get().nestGoal;
      const nestGoal: NestGoal = {
        title: title.trim() || 'My housing goal',
        target_amount: targetAmount > 0 ? targetAmount : 0,
        saved_amount: existing?.saved_amount ?? 0,
        target_date: targetDate,
        checklist: existing?.checklist ?? [],
        updated_at: new Date().toISOString(),
      };
      await commit({ nestGoal }, { xp: 10, achievement: existing ? undefined : 'first_nest' });
    },

    addNestContribution: async (amount) => {
      const nest = get().nestGoal;
      if (!nest) return;
      const row: NestContribution = {
        id: uid(),
        amount: Math.abs(amount),
        date: todayKey(),
        created_at: new Date().toISOString(),
      };
      await commit(
        {
          nestContributions: [row, ...get().nestContributions],
          nestGoal: { ...nest, saved_amount: nest.saved_amount + Math.abs(amount), updated_at: new Date().toISOString() },
        },
        { xp: 15 },
      );
    },

    toggleNestChecklist: async (key) => {
      const nest = get().nestGoal;
      if (!nest) return;
      const has = nest.checklist.includes(key);
      const checklist = has ? nest.checklist.filter((k) => k !== key) : [...nest.checklist, key];
      await commit(
        { nestGoal: { ...nest, checklist, updated_at: new Date().toISOString() } },
        { xp: has ? 0 : 10 },
      );
    },

    // ── Phase 3: Community ──────────────────────────────────────────
    addCommunityPost: async (circle, handle, text) => {
      const row: CommunityPost = {
        id: uid(),
        circle,
        handle,
        text: text.trim(),
        likes: 0,
        likedByMe: false,
        created_at: new Date().toISOString(),
      };
      const isFirst = get().communityPosts.length === 0;
      await commit(
        { communityPosts: [row, ...get().communityPosts] },
        { xp: 15, achievement: isFirst ? 'first_community' : undefined },
      );
    },

    toggleCommunityLike: async (id) => {
      const communityPosts = get().communityPosts.map((p) =>
        p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p,
      );
      await commit({ communityPosts });
    },

    clearUnlocked: () => set({ lastUnlocked: [] }),

    signOutLocal: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ ...emptyState(), hydrated: true, lastUnlocked: [] });
    },
  };
});
