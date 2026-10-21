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

-- ─────────────────────────────────────────────────────────────
-- Teacher panel + homework (safe to run again)
-- ─────────────────────────────────────────────────────────────

-- Teachers can read every student. Only you add rows here (from the SQL editor).
create table if not exists public.teachers (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.teachers enable row level security;
revoke all on public.teachers from anon, authenticated;

create or replace function public.is_teacher() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.teachers where user_id = auth.uid()); $$;
revoke all on function public.is_teacher() from public, anon;
grant execute on function public.is_teacher() to authenticated;

drop policy if exists "Teachers read all profiles" on public.profiles;
drop policy if exists "Teachers read all progress" on public.progress;
create policy "Teachers read all profiles" on public.profiles for select to authenticated using (public.is_teacher());
create policy "Teachers read all progress" on public.progress for select to authenticated using (public.is_teacher());

-- Homework: the teacher adds it, the student can only mark it done.
create table if not exists public.homework (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  title      text not null check (char_length(title) between 1 and 140),
  details    text check (char_length(details) <= 1000),
  lesson_id  text,
  due        date,
  created_at timestamptz not null default now(),
  done_at    timestamptz
);
alter table public.homework enable row level security;

drop policy if exists "Read own homework"        on public.homework;
drop policy if exists "Mark own homework"        on public.homework;
drop policy if exists "Teachers add homework"    on public.homework;
drop policy if exists "Teachers delete homework" on public.homework;
create policy "Read own homework"        on public.homework for select to authenticated using (student_id = auth.uid() or public.is_teacher());
create policy "Mark own homework"        on public.homework for update to authenticated using (student_id = auth.uid() or public.is_teacher()) with check (student_id = auth.uid() or public.is_teacher());
create policy "Teachers add homework"    on public.homework for insert to authenticated with check (public.is_teacher());
create policy "Teachers delete homework" on public.homework for delete to authenticated using (public.is_teacher());

revoke all on public.homework from anon, authenticated;
grant select, insert, delete on public.homework to authenticated;
grant update (done_at) on public.homework to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Classes (schedule, attendance, notes) + lessons made in the lesson builder (safe to run again)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.classes (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  starts_at  timestamptz not null,
  status     text not null default 'scheduled' check (status in ('scheduled', 'attended', 'missed', 'cancelled')),
  lesson_id  text,
  title      text check (char_length(title) <= 140),
  notes      text check (char_length(notes) <= 3000),
  words      text check (char_length(words) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.classes enable row level security;
drop policy if exists "Read own classes"        on public.classes;
drop policy if exists "Teachers write classes"  on public.classes;
create policy "Read own classes"       on public.classes for select to authenticated using (student_id = auth.uid() or public.is_teacher());
create policy "Teachers write classes" on public.classes for all    to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.classes from anon, authenticated;
grant select, insert, update, delete on public.classes to authenticated;

create table if not exists public.lessons (
  id         text primary key check (id ~ '^[0-9]{2,3}$'),
  data       jsonb not null,
  published  boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.lessons enable row level security;
drop policy if exists "Read published lessons" on public.lessons;
drop policy if exists "Teachers write lessons" on public.lessons;
create policy "Read published lessons" on public.lessons for select to authenticated using (published or public.is_teacher());
create policy "Teachers write lessons" on public.lessons for all    to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.lessons from anon, authenticated;
grant select, insert, update, delete on public.lessons to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Several students: lessons assigned to each one and their style (safe to run again)
-- lessons = null means "every lesson" (how older accounts keep working)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.student_settings (
  student_id uuid primary key references auth.users (id) on delete cascade,
  lessons    text[],
  theme      text not null default 'racing' check (char_length(theme) <= 30),
  updated_at timestamptz not null default now()
);
alter table public.student_settings enable row level security;
drop policy if exists "Read own settings"        on public.student_settings;
drop policy if exists "Teachers write settings"  on public.student_settings;
create policy "Read own settings"       on public.student_settings for select to authenticated using (student_id = auth.uid() or public.is_teacher());
create policy "Teachers write settings" on public.student_settings for all    to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.student_settings from anon, authenticated;
grant select, insert, update, delete on public.student_settings to authenticated;
-- Students who already exist keep seeing every lesson until you change it
insert into public.student_settings (student_id, lessons) select id, null from public.profiles on conflict (student_id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Class mode: the teacher can run a class on a student's account (safe to run again)
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Teachers insert progress" on public.progress;
drop policy if exists "Teachers update progress" on public.progress;
drop policy if exists "Teachers update profiles" on public.profiles;
create policy "Teachers insert progress" on public.progress for insert to authenticated with check (public.is_teacher());
create policy "Teachers update progress" on public.progress for update to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy "Teachers update profiles" on public.profiles for update to authenticated using (public.is_teacher()) with check (public.is_teacher());

-- ─────────────────────────────────────────────────────────────
-- Teacher admin (see supabase/admin.sql)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.class_rules (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  weekday    int  not null check (weekday between 0 and 6),
  time       text not null check (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  minutes    int  not null default 60 check (minutes between 15 and 240),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.student_admin (
  student_id   uuid primary key references auth.users (id) on delete cascade,
  notes        text check (char_length(notes) <= 5000),
  billing      text not null default 'per_class' check (billing in ('per_class', 'monthly', 'free')),
  rate         numeric(10,2) not null default 0,
  currency     text not null default 'MXN' check (char_length(currency) <= 5),
  updated_at   timestamptz not null default now()
);
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  month      text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  amount     numeric(10,2) not null check (amount >= 0),
  paid_on    date not null default current_date,
  note       text check (char_length(note) <= 300),
  created_at timestamptz not null default now()
);
alter table public.classes add column if not exists rule_id uuid;
alter table public.class_rules enable row level security;
alter table public.student_admin enable row level security;
alter table public.payments enable row level security;
drop policy if exists "Teachers only rules" on public.class_rules;
drop policy if exists "Teachers only admin" on public.student_admin;
drop policy if exists "Teachers only payments" on public.payments;
create policy "Teachers only rules"    on public.class_rules   for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy "Teachers only admin"    on public.student_admin for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy "Teachers only payments" on public.payments      for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.class_rules, public.student_admin, public.payments from anon, authenticated;
grant select, insert, update, delete on public.class_rules, public.student_admin, public.payments to authenticated;
