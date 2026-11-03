-- Lingua v9 · Safer platform: archive students, error log, backup reminder and keep-alive
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.
-- Nothing here deletes or changes existing data.

-- 1) Archive students instead of deleting them.
--    An archived student can't sign in and disappears from the lists, but keeps all their history.
--    The admin-users function sets this (and pauses the sign-in); a teacher can restore it any time.
alter table public.student_admin add column if not exists archived_at timestamptz;

-- 2) Error log: when something breaks on someone's screen, the page saves a short note here
--    so the teacher sees it in the panel. Everyone signed in can add their own; only teachers read or clear them.
create table if not exists public.client_errors (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  page        text check (char_length(page) <= 200),
  message     text not null check (char_length(message) <= 500),
  detail      text check (char_length(detail) <= 2000),
  agent       text check (char_length(agent) <= 300),
  build       text check (char_length(build) <= 40)
);
create index if not exists client_errors_created on public.client_errors (created_at desc);
alter table public.client_errors enable row level security;
drop policy if exists "Report own errors"     on public.client_errors;
drop policy if exists "Teachers read errors"  on public.client_errors;
drop policy if exists "Teachers clear errors" on public.client_errors;
create policy "Report own errors"     on public.client_errors for insert to authenticated with check (user_id = auth.uid());
create policy "Teachers read errors"  on public.client_errors for select to authenticated using (public.is_teacher());
create policy "Teachers clear errors" on public.client_errors for delete to authenticated using (public.is_teacher());
revoke all on public.client_errors from anon, authenticated;
grant insert, select, delete on public.client_errors to authenticated;

-- No flooding: at most 30 notes per person per hour, and the log keeps only the last 60 days.
create or replace function public.client_errors_guard() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.client_errors where user_id = new.user_id and created_at > now() - interval '1 hour') >= 30 then
    return null;
  end if;
  delete from public.client_errors where created_at < now() - interval '60 days';
  return new;
end;
$$;
drop trigger if exists client_errors_guard on public.client_errors;
create trigger client_errors_guard before insert on public.client_errors for each row execute function public.client_errors_guard();

-- 3) Teacher settings that should follow you to any device (for now: when the last backup was downloaded).
create table if not exists public.teacher_meta (
  key         text primary key check (char_length(key) <= 60),
  value       jsonb check (pg_column_size(value) <= 4000),
  updated_at  timestamptz not null default now()
);
alter table public.teacher_meta enable row level security;
drop policy if exists "Teachers manage meta" on public.teacher_meta;
create policy "Teachers manage meta" on public.teacher_meta for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.teacher_meta from anon, authenticated;
grant select, insert, update, delete on public.teacher_meta to authenticated;

-- 4) Keep-alive: a tiny function a scheduled GitHub job calls every few days so the free project
--    isn't paused for inactivity (for example during holidays). It only returns the current time.
create or replace function public.keepalive() returns timestamptz
  language sql stable as $$ select now(); $$;
revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;
