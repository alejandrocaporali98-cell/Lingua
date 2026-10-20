-- Lingua · several students (run once in Supabase → SQL Editor → New query → paste → Run)
-- Each student sees only the lessons you assign. lessons = null means "every lesson".
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
