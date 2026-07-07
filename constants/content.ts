// Static product content: hustle categories, emotions, achievements,
// journal prompts, expense categories, and the offline AI coach lines.

export interface HustleCategory {
  key: string;
  name: string;
  icon: string; // Ionicons name
  avgIncome: string;
  difficulty: 1 | 2 | 3;
  blurb: string;
}

export const HUSTLE_CATEGORIES: HustleCategory[] = [
  {
    key: 'freelancing',
    name: 'Freelancing',
    icon: 'laptop-outline',
    avgIncome: '$500–$3,000/mo',
    difficulty: 2,
    blurb: 'Sell a skill you already have — design, writing, code, video editing.',
  },
  {
    key: 'content',
    name: 'Content Creation',
    icon: 'videocam-outline',
    avgIncome: '$100–$5,000/mo',
    difficulty: 3,
    blurb: 'TikTok, YouTube, or a niche newsletter. Slow start, huge ceiling.',
  },
  {
    key: 'ecommerce',
    name: 'E-Commerce & Reselling',
    icon: 'cart-outline',
    avgIncome: '$300–$2,000/mo',
    difficulty: 2,
    blurb: 'Flip thrift finds, print-on-demand, or launch a micro-brand.',
  },
  {
    key: 'tutoring',
    name: 'Tutoring & Coaching',
    icon: 'school-outline',
    avgIncome: '$200–$1,500/mo',
    difficulty: 1,
    blurb: 'Teach what you know — languages, math, fitness, gaming, music.',
  },
  {
    key: 'digital-products',
    name: 'Digital Products',
    icon: 'cube-outline',
    avgIncome: '$50–$2,500/mo',
    difficulty: 2,
    blurb: 'Templates, presets, study guides, Notion kits. Build once, sell forever.',
  },
  {
    key: 'local-services',
    name: 'Local Services',
    icon: 'construct-outline',
    avgIncome: '$400–$2,000/mo',
    difficulty: 1,
    blurb: 'Pet sitting, photography, moving help, car detailing. Start this week.',
  },
];

export const ROADMAP_STEPS: { title: string; detail: string }[] = [
  { title: 'Pick your niche', detail: 'Choose one specific offer for one specific audience. Narrow wins.' },
  { title: 'Set up your storefront', detail: 'A simple profile or page where people can find and pay you.' },
  { title: 'Create your first offer', detail: 'One clear package with a price. Done beats perfect.' },
  { title: 'Get your first 3 leads', detail: 'Tell friends, post once a day, DM 10 potential customers.' },
  { title: 'Land your first sale', detail: 'Close one deal — even a small one. Momentum is everything.' },
  { title: 'Systemize & scale', detail: 'Raise prices, ask for referrals, automate the boring parts.' },
];

export const EMOTION_TAGS = [
  'Anxious',
  'Tired',
  'Hopeful',
  'Stressed',
  'Motivated',
  'Lonely',
  'Grateful',
  'Overwhelmed',
] as const;

export const MOODS: { score: number; emoji: string; label: string }[] = [
  { score: 1, emoji: '😞', label: 'Awful' },
  { score: 2, emoji: '😟', label: 'Bad' },
  { score: 3, emoji: '😕', label: 'Meh' },
  { score: 4, emoji: '😐', label: 'Okay' },
  { score: 5, emoji: '🙂', label: 'Good' },
  { score: 6, emoji: '😄', label: 'Great' },
  { score: 7, emoji: '🤩', label: 'Amazing' },
];

export const JOURNAL_PROMPTS = [
  'What is one thing that went better than expected today?',
  'What is draining your energy right now — and what is one tiny step to fix it?',
  'If your best friend felt how you feel now, what would you tell them?',
  'What are you lowkey proud of that nobody knows about?',
  'What would today look like if it were 1% easier?',
  'Name one thing you can control this week. Ignore the rest for 5 minutes.',
  'What does "enough" look like for you this month?',
];

export const EXPENSE_CATEGORIES = [
  'Food & Drinks',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Rent & Bills',
  'Fun & Social',
  'Health',
  'Education',
  'Other',
] as const;

export const INCOME_CATEGORIES = ['Salary', 'Side Hustle', 'Allowance', 'Gifts', 'Other'] as const;

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string; // Ionicons name
  xp: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { key: 'first_login', title: 'Day One', description: 'Started your AchieveOS journey', icon: 'rocket', xp: 25 },
  { key: 'first_transaction', title: 'Money Moves', description: 'Logged your first transaction', icon: 'wallet', xp: 20 },
  { key: 'ten_transactions', title: 'Budget Boss', description: 'Logged 10 transactions', icon: 'trending-up', xp: 50 },
  { key: 'first_mood', title: 'Checked In', description: 'Logged your first mood', icon: 'heart', xp: 20 },
  { key: 'week_streak', title: 'On Fire', description: '7-day activity streak', icon: 'flame', xp: 100 },
  { key: 'first_journal', title: 'Dear Diary', description: 'Wrote your first journal entry', icon: 'book', xp: 25 },
  { key: 'hustle_started', title: 'Founder Mode', description: 'Started your side hustle roadmap', icon: 'briefcase', xp: 30 },
  { key: 'hustle_launched', title: 'Launched!', description: 'Completed all 6 roadmap milestones', icon: 'trophy', xp: 150 },
  { key: 'first_income', title: 'First Bag', description: 'Logged side hustle income', icon: 'cash', xp: 40 },
  { key: 'level_5', title: 'Level 5 Energy', description: 'Reached level 5', icon: 'star', xp: 0 },
];

// Offline AI coach — used when no Claude API key is configured, so the
// app is fully functional in demo mode. Grouped by context.
export const OFFLINE_COACH = {
  lowMood: [
    "That sounds heavy, and it makes sense you feel that way. You don't have to fix everything today — pick one small thing and let that be enough. 💜",
    "Rough days don't erase your progress. Drink some water, take one deep breath, and be a little kind to yourself tonight.",
    "Feeling low after everything you're juggling is human, not weakness. Tomorrow you only need to show up at 1% — that still counts.",
  ],
  midMood: [
    "An 'okay' day is still a day you showed up. What's one small win you can stack before tonight?",
    'Steady is underrated. Keep the streak alive — one check-in, one small move, repeat.',
    "You're in the middle lane today and that's fine. Maybe send that one message or knock out that one task you've been avoiding.",
  ],
  highMood: [
    "Love this energy! 🎉 Ride the wave — this is the perfect day to do the thing you've been putting off.",
    "You're glowing today. Bank some of this momentum: tick off a roadmap step or log your finances while you're on a roll.",
    'Great days are for building. Set up tomorrow-you for a win before you log off tonight.',
  ],
  money: [
    'Small leaks sink big ships — check your top spending category this week and see if one cut feels painless.',
    'Rule of thumb: pay yourself first. Even auto-saving $5 a week builds the habit that builds the wealth.',
    'Track first, judge later. Just seeing where money goes usually cuts spending 10–15% by itself.',
  ],
  hustle: [
    'Your first customer is closer than you think — tell 5 people today what you offer. Done beats perfect.',
    "Don't build for weeks in silence. Ship something tiny this week and let real feedback steer you.",
    'Consistency compounds: one post, one DM, one improvement per day beats a weekend sprint every time.',
  ],
  general: [
    'Progress over perfection. One small action in your weakest module today moves your whole Life Score.',
    "You don't need more motivation, you need a smaller first step. Shrink the task until it's easy to start.",
    'Check in daily, act weekly, review monthly. That rhythm alone puts you ahead of 90% of people.',
  ],
};
