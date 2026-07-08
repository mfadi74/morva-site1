-- ─────────────────────────────────────────────────────────────────────
-- AchieveOS — Supabase schema
-- Run this in Supabase → SQL Editor to enable cloud accounts + sync.
-- The app works fully WITHOUT this (local demo mode); this unlocks
-- multi-device sync and real accounts.
-- ─────────────────────────────────────────────────────────────────────

-- User profiles (extends Supabase auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  date_of_birth date,
  country text,
  language text default 'en',
  life_score integer default 0,
  xp_points integer default 0,
  current_level integer default 1,
  onboarding_complete boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Life goals
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  title text not null,
  description text,
  target_date date,
  modules text[],
  progress integer default 0,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc', now())
);

-- MoneyMap: transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  amount decimal(10,2),
  category text,
  description text,
  type text,  -- 'income' or 'expense'
  date date,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Stillwell: mood logs
create table if not exists public.mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  mood_score integer,  -- 1 to 7
  emotions text[],
  notes text,
  logged_at timestamp with time zone default timezone('utc', now())
);

-- Stillwell: journal entries
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  content text,
  prompt text,
  mood_score integer,
  created_at timestamp with time zone default timezone('utc', now())
);

-- LaunchPad: side hustles
create table if not exists public.side_hustles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  name text,
  type text,
  status text default 'planning',
  monthly_income decimal(10,2) default 0,
  goal_income decimal(10,2),
  launch_date date,
  roadmap_step integer default 1,
  created_at timestamp with time zone default timezone('utc', now())
);

-- XP and achievements
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  achievement_key text,
  earned_at timestamp with time zone default timezone('utc', now())
);

-- Enable Row Level Security (users can only see their own data)
alter table public.profiles        enable row level security;
alter table public.goals           enable row level security;
alter table public.transactions    enable row level security;
alter table public.mood_logs       enable row level security;
alter table public.journal_entries enable row level security;
alter table public.side_hustles    enable row level security;
alter table public.achievements    enable row level security;

-- RLS Policies (drop-if-exists keeps this script idempotent)
drop policy if exists "Users see own profile"      on public.profiles;
drop policy if exists "Users see own goals"        on public.goals;
drop policy if exists "Users see own transactions" on public.transactions;
drop policy if exists "Users see own mood logs"    on public.mood_logs;
drop policy if exists "Users see own journal"      on public.journal_entries;
drop policy if exists "Users see own hustles"      on public.side_hustles;
drop policy if exists "Users see own achievements" on public.achievements;

create policy "Users see own profile"      on public.profiles        for all using (auth.uid() = id);
create policy "Users see own goals"        on public.goals           for all using (auth.uid() = user_id);
create policy "Users see own transactions" on public.transactions    for all using (auth.uid() = user_id);
create policy "Users see own mood logs"    on public.mood_logs       for all using (auth.uid() = user_id);
create policy "Users see own journal"      on public.journal_entries for all using (auth.uid() = user_id);
create policy "Users see own hustles"      on public.side_hustles    for all using (auth.uid() = user_id);
create policy "Users see own achievements" on public.achievements    for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- Phase 2 (Growth): CareerGPS, Sprinto, RootHealth, Connekt
-- ─────────────────────────────────────────────────────────────────────

-- CareerGPS: logged career moves
create table if not exists public.career_actions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  type text,   -- 'application' | 'networking' | 'interview' | 'learning'
  note text,
  date date,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Sprinto: skills being built
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  name text,
  category text,
  target_hours integer default 20,
  logged_hours numeric default 0,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RootHealth: one row per day of habits
create table if not exists public.health_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  date date,
  sleep_hours numeric,
  water_cups integer,
  moved_minutes integer,
  screen_hours numeric,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Connekt: logged connections
create table if not exists public.connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  name text,
  context text,
  date date,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.career_actions enable row level security;
alter table public.skills         enable row level security;
alter table public.health_logs    enable row level security;
alter table public.connections    enable row level security;

drop policy if exists "Users see own career"      on public.career_actions;
drop policy if exists "Users see own skills"      on public.skills;
drop policy if exists "Users see own health"      on public.health_logs;
drop policy if exists "Users see own connections" on public.connections;

create policy "Users see own career"      on public.career_actions for all using (auth.uid() = user_id);
create policy "Users see own skills"      on public.skills         for all using (auth.uid() = user_id);
create policy "Users see own health"      on public.health_logs    for all using (auth.uid() = user_id);
create policy "Users see own connections" on public.connections    for all using (auth.uid() = user_id);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Achiever'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
