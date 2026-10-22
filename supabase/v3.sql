-- Lingua · v3: homework answers, voice recordings, WhatsApp numbers and calendar feeds
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.

-- ── 1. Homework answers (text and audio) and your feedback ──
alter table public.homework add column if not exists answer       text check (char_length(answer) <= 4000);
alter table public.homework add column if not exists audio_path   text check (char_length(audio_path) <= 300);
alter table public.homework add column if not exists submitted_at timestamptz;
alter table public.homework add column if not exists feedback     text check (char_length(feedback) <= 2000);
alter table public.homework add column if not exists grade        smallint check (grade between 0 and 100);
alter table public.homework add column if not exists reviewed_at  timestamptz;
grant update (done_at, answer, audio_path, submitted_at, feedback, grade, reviewed_at) on public.homework to authenticated;

-- Students may answer their own homework but never grade it
create or replace function public.homework_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_teacher() and (new.feedback is distinct from old.feedback or new.grade is distinct from old.grade or new.reviewed_at is distinct from old.reviewed_at) then
    raise exception 'Only teachers can grade homework';
  end if;
  return new;
end $$;
drop trigger if exists homework_guard on public.homework;
create trigger homework_guard before update on public.homework for each row execute function public.homework_guard();

-- ── 2. Voice recordings from lessons ──
create table if not exists public.recordings (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  lesson_id  text,
  prompt     text check (char_length(prompt) <= 500),
  path       text not null check (char_length(path) <= 300),
  seconds    real,
  created_at timestamptz not null default now()
);
alter table public.recordings enable row level security;
drop policy if exists "Read own recordings"   on public.recordings;
drop policy if exists "Add own recordings"    on public.recordings;
drop policy if exists "Delete own recordings" on public.recordings;
create policy "Read own recordings"   on public.recordings for select to authenticated using (student_id = auth.uid() or public.is_teacher());
create policy "Add own recordings"    on public.recordings for insert to authenticated with check (student_id = auth.uid() or public.is_teacher());
create policy "Delete own recordings" on public.recordings for delete to authenticated using (student_id = auth.uid() or public.is_teacher());
revoke all on public.recordings from anon;
grant select, insert, delete on public.recordings to authenticated;

-- Private audio storage: each student only reaches their own folder; teachers reach all
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voice', 'voice', false, 10485760, array['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/x-m4a'])
on conflict (id) do nothing;
drop policy if exists "Voice read"   on storage.objects;
drop policy if exists "Voice upload" on storage.objects;
drop policy if exists "Voice delete" on storage.objects;
create policy "Voice read"   on storage.objects for select to authenticated using (bucket_id = 'voice' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_teacher()));
create policy "Voice upload" on storage.objects for insert to authenticated with check (bucket_id = 'voice' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_teacher()));
create policy "Voice delete" on storage.objects for delete to authenticated using (bucket_id = 'voice' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_teacher()));

-- ── 3. WhatsApp numbers for reminders (only you see them) ──
alter table public.student_admin add column if not exists phone        text check (char_length(phone) <= 30);
alter table public.student_admin add column if not exists parent_phone text check (char_length(parent_phone) <= 30);

-- ── 4. Calendar feeds: one private link per person ──
create table if not exists public.cal_tokens (
  owner      uuid primary key references auth.users (id) on delete cascade,
  token      uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.cal_tokens enable row level security;
drop policy if exists "Own calendar link" on public.cal_tokens;
create policy "Own calendar link" on public.cal_tokens for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
revoke all on public.cal_tokens from anon;
grant select, insert, delete on public.cal_tokens to authenticated;

-- ── 5. Give Derek and Erick their first C1 lessons (301 film, 311 music) ──
update public.student_settings set lessons = array_append(coalesce(lessons, '{}'), '301')
where student_id = (select id from auth.users where email = 'derek@student.lingua.app') and not ('301' = any(coalesce(lessons, '{}')));
update public.student_settings set lessons = array_append(coalesce(lessons, '{}'), '311')
where student_id = (select id from auth.users where email = 'erick@student.lingua.app') and not ('311' = any(coalesce(lessons, '{}')));
