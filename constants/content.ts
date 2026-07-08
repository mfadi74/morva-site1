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
  { key: 'first_career', title: 'On The Grid', description: 'Logged your first career move', icon: 'compass', xp: 25 },
  { key: 'first_skill', title: 'Student Mode', description: 'Started learning a skill', icon: 'school', xp: 25 },
  { key: 'first_health', title: 'Body Check', description: 'Logged your first health day', icon: 'fitness', xp: 20 },
  { key: 'first_social', title: 'Brave Move', description: 'Took your first social action', icon: 'happy', xp: 20 },
  { key: 'first_brand', title: 'Brand Builder', description: 'Set up your personal brand', icon: 'megaphone', xp: 25 },
  { key: 'first_green', title: 'Eco Warrior', description: 'Logged your first green action', icon: 'leaf', xp: 20 },
  { key: 'first_nest', title: 'Future Nester', description: 'Set your housing goal', icon: 'home', xp: 25 },
  { key: 'first_community', title: 'Found Your People', description: 'Posted in a community circle', icon: 'chatbubbles', xp: 25 },
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
  career: [
    'Careers are built on reps, not luck. One application or one genuine message today is a rep. Do one.',
    "Feeling burnt out? That's data, not failure. Protect one evening this week with zero work — you'll do better work for it.",
    'Your next role rarely comes from job boards — it comes from people. DM one person in a job you admire and just ask how they got there.',
  ],
  skills: [
    'Skills compound like interest. 20 focused minutes a day beats a 5-hour weekend cram every single time.',
    "Don't learn in a vacuum — build one tiny thing with the skill this week. Projects teach faster than tutorials.",
    "You're closer than it feels. Log today's practice, watch the bar move, and let momentum do the rest.",
  ],
  health: [
    'Sleep is the cheat code. Even 30 more minutes tonight sharpens your mood, money decisions, and focus tomorrow.',
    'Screen time and burnout travel together. Try one 20-minute walk with your phone on Do Not Disturb today.',
    "Hydration is the most underrated mood hack. Refill your water now — future-you feels it.",
  ],
  social: [
    "Confidence is a muscle, not a gift. One small brave move today — a hello, a comment, a text — is a rep.",
    'Nobody feels ready to reach out. Send the message anyway; the awkward 10 seconds beats the lonely week.',
    'Networking isn\'t selling — it\'s curiosity. Ask one person one real question about their world today.',
  ],
  brand: [
    'Your personal brand is just showing up consistently around one topic. Post one thing today — done beats perfect.',
    'People follow clarity. If you can say what you help with in one line, you\'re ahead of most. Refine your bio.',
    "Don't wait to feel like an expert. Document the journey, not just the destination — that's what people relate to.",
  ],
  green: [
    'You don\'t need to be perfect to matter. One swap today — reusable bottle, one less delivery — is a real vote for the planet.',
    'Small green habits stack. Pick the one that\'s easiest for you and repeat it; consistency beats guilt.',
    'Climate action feels big, but your circle watches what you do. Log one action and quietly set the example.',
  ],
  nest: [
    'Housing feels impossible until you break it into a number and a date. Save one small deposit contribution this week.',
    'You\'re not behind — the system is hard. A tiny automatic transfer toward your deposit beats waiting for a windfall.',
    'Independence is a checklist, not a leap. Tick one readiness item today and the goal gets a little more real.',
  ],
  community: [
    'You are so much less alone than it feels. Someone in these circles has been exactly where you are.',
    'Sharing one honest sentence can help a stranger more than you know — and help you too.',
    'Lurking is fine, but one supportive reply today builds the kind of community you\'d want to find on a hard day.',
  ],
};

// ── Phase 2: CareerGPS ──────────────────────────────────────────────
export const CAREER_ACTIONS: { key: string; label: string; icon: string; xp: number }[] = [
  { key: 'application', label: 'Applied to a role', icon: 'paper-plane-outline', xp: 15 },
  { key: 'networking', label: 'Networked / reached out', icon: 'people-outline', xp: 15 },
  { key: 'interview', label: 'Had an interview', icon: 'chatbubbles-outline', xp: 30 },
  { key: 'learning', label: 'Learned something new', icon: 'bulb-outline', xp: 10 },
];

// ── Phase 2: Sprinto (skills) ───────────────────────────────────────
export const SKILL_CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'tech', label: 'Tech & Coding', icon: 'code-slash-outline' },
  { key: 'creative', label: 'Design & Creative', icon: 'color-palette-outline' },
  { key: 'business', label: 'Business & Money', icon: 'briefcase-outline' },
  { key: 'language', label: 'Languages', icon: 'language-outline' },
  { key: 'communication', label: 'Communication', icon: 'megaphone-outline' },
  { key: 'wellbeing', label: 'Health & Fitness', icon: 'barbell-outline' },
];

export const SKILL_SUGGESTIONS: Record<string, string[]> = {
  tech: ['Python', 'Web Development', 'AI & Prompting', 'Data Analysis'],
  creative: ['Video Editing', 'Graphic Design', 'UI/UX', 'Photography'],
  business: ['Marketing', 'Investing', 'Public Speaking', 'Sales'],
  language: ['English', 'Spanish', 'Arabic', 'French'],
  communication: ['Copywriting', 'Storytelling', 'Negotiation', 'Networking'],
  wellbeing: ['Strength Training', 'Running', 'Nutrition', 'Meditation'],
};

// ── Phase 2: RootHealth ─────────────────────────────────────────────
export const HEALTH_TARGETS = {
  sleep_hours: 8,
  water_cups: 8,
  moved_minutes: 30,
  screen_hours_max: 6, // lower is better
};

// ── Phase 2: Connekt ────────────────────────────────────────────────
export const SOCIAL_CHALLENGES: { key: string; label: string; xp: number }[] = [
  { key: 'greet', label: 'Start a conversation with someone new', xp: 15 },
  { key: 'compliment', label: 'Give someone a genuine compliment', xp: 10 },
  { key: 'reconnect', label: 'Message a friend you miss', xp: 10 },
  { key: 'ask', label: 'Ask someone a thoughtful question', xp: 10 },
  { key: 'share', label: 'Share an opinion in a group chat or post', xp: 15 },
  { key: 'invite', label: 'Invite someone to hang out or call', xp: 20 },
];

export const CONVERSATION_STARTERS = [
  "What's something you're weirdly good at?",
  'What have you been into lately outside of work or school?',
  'If you had a totally free weekend, what would you do?',
  "What's the best thing you've watched or read recently?",
  'How did you get into what you do?',
  "What's a small win you had this week?",
];

// ── Phase 3: BrandSelf ──────────────────────────────────────────────
export const BRAND_PILLARS = [
  'Tech',
  'Fitness',
  'Finance',
  'Fashion',
  'Gaming',
  'Art & Design',
  'Food',
  'Travel',
  'Study & Productivity',
  'Music',
  'Mental Health',
  'Entrepreneurship',
];

export const BRAND_PLATFORMS: { key: string; label: string; icon: string }[] = [
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { key: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
  { key: 'x', label: 'X', icon: 'logo-twitter' },
  { key: 'other', label: 'Other', icon: 'globe-outline' },
];

// ── Phase 3: Greenprint ─────────────────────────────────────────────
export const GREEN_ACTIONS: { key: string; label: string; icon: string; xp: number }[] = [
  { key: 'transport', label: 'Walked, cycled or took transit', icon: 'bicycle-outline', xp: 10 },
  { key: 'food', label: 'Ate plant-based / cut food waste', icon: 'leaf-outline', xp: 10 },
  { key: 'waste', label: 'Reused, recycled or refused plastic', icon: 'refresh-outline', xp: 10 },
  { key: 'energy', label: 'Saved energy or water', icon: 'flash-outline', xp: 10 },
  { key: 'shopping', label: 'Bought secondhand / skipped a buy', icon: 'pricetag-outline', xp: 10 },
];

// ── Phase 3: NestUp ─────────────────────────────────────────────────
export const NEST_CHECKLIST: { key: string; label: string }[] = [
  { key: 'budget', label: 'I have a monthly budget I actually follow' },
  { key: 'emergency', label: 'I have a small emergency fund (1 month+)' },
  { key: 'deposit', label: 'I know my target deposit / upfront cost' },
  { key: 'income', label: 'My income covers rent + bills with room to spare' },
  { key: 'credit', label: 'I understand my credit / rental history' },
  { key: 'research', label: 'I have researched areas and real prices' },
];

// ── Phase 3: Community Layer ────────────────────────────────────────
export interface Circle {
  key: string;
  name: string;
  icon: string;
  blurb: string;
  color: string;
}

export const CIRCLES: Circle[] = [
  { key: 'burnout', name: 'Burnout & Rest', icon: 'bed-outline', blurb: 'For when it all feels like too much.', color: '#F472B6' },
  { key: 'money', name: 'Money Wins', icon: 'cash-outline', blurb: 'Celebrate small financial wins together.', color: '#34D399' },
  { key: 'hustle', name: 'Side Hustle', icon: 'rocket-outline', blurb: 'Founders-in-progress cheering each other on.', color: '#F59E0B' },
  { key: 'study', name: 'Study & Focus', icon: 'book-outline', blurb: 'Accountability for exams, courses, and deep work.', color: '#A78BFA' },
  { key: 'anxiety', name: 'Anxiety Support', icon: 'heart-outline', blurb: 'A gentle space. You are not alone here.', color: '#38BDF8' },
];

/** Seeded, supportive posts so circles never feel empty (read-only samples). */
export const SEED_POSTS: Record<string, { handle: string; text: string; likes: number }[]> = {
  burnout: [
    { handle: 'quiet_koala', text: 'Took my first full day off in 3 weeks. The world did not end. Reminder for anyone who needs it. 💜', likes: 42 },
    { handle: 'mint_tea', text: 'Ok tiny win: I said no to one extra shift. Terrifying but I already feel lighter.', likes: 28 },
  ],
  money: [
    { handle: 'budget_bee', text: 'Hit my first $500 saved!! Started at literally $0 two months ago. Small amounts add up fr.', likes: 63 },
    { handle: 'nova', text: 'Cancelled 3 subscriptions I forgot about = $34/mo back. Check yours, you\'ll be shocked.', likes: 51 },
  ],
  hustle: [
    { handle: 'pixel_pat', text: 'Got my first paying client for design work today. Cried a little ngl. Keep going everyone.', likes: 77 },
    { handle: 'sunny.side', text: 'Posted every day for 14 days straight. 3 sales so far. Consistency really is the cheat code.', likes: 34 },
  ],
  study: [
    { handle: 'late_owl', text: '25 min focus, 5 min break. Did 4 rounds. Finally started the assignment I was dreading.', likes: 19 },
    { handle: 'fig', text: 'Passed the exam I thought I\'d fail. To anyone spiralling right now: you know more than you think.', likes: 45 },
  ],
  anxiety: [
    { handle: 'soft_static', text: 'Reminder: a bad day is not a bad life. Breathe. You\'ve survived 100% of them so far.', likes: 88 },
    { handle: 'harbor', text: 'Told one friend how I actually felt this week. Scary but I feel 10% lighter. Recommend.', likes: 39 },
  ],
};

/** Fun anonymous handles assigned to the user per session for privacy. */
export const ANON_HANDLES = [
  'brave_finch',
  'calm_comet',
  'golden_hour',
  'still_river',
  'kind_ember',
  'lucky_sprout',
  'quiet_storm',
  'bright_side',
];
