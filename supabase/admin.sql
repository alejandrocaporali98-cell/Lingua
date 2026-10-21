-- Lingua · teacher admin: recurring classes, private notes, billing (run once; safe to run again)
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
