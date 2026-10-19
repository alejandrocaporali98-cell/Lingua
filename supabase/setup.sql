-- Lingua · Supabase setup
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Creates the student profile and progress tables, locked so each
-- signed-in student can only read and write their own rows.

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  age          int check (age between 5 and 99),
  interests    text[] not null default '{}',
  avatar_color text not null default '#2346d0',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "Students read own profile"   on public.profiles;
drop policy if exists "Students insert own profile" on public.profiles;
drop policy if exists "Students update own profile" on public.profiles;
drop policy if exists "Students read own progress"   on public.progress;
drop policy if exists "Students insert own progress" on public.progress;
drop policy if exists "Students update own progress" on public.progress;

create policy "Students read own profile"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Students insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Students update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Students read own progress"   on public.progress for select to authenticated using (auth.uid() = user_id);
create policy "Students insert own progress" on public.progress for insert to authenticated with check (auth.uid() = user_id);
create policy "Students update own progress" on public.progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.progress to authenticated;
revoke all on public.profiles from anon;
revoke all on public.progress from anon;
