-- Lingua v7 · Trial classes (clases muestra)
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.
--
-- The teacher creates a trial and sends its link. The person fills a short form (no account),
-- the teacher gives the class from the platform, and the report is shared with the same link.
-- People without an account can only reach a trial through its secret code, and only through
-- the three functions at the end: read the form, send the form once, and read the finished report.

create table if not exists public.trials (
  id          uuid primary key default gen_random_uuid(),
  token       uuid not null unique default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  starts_at   timestamptz,
  contact     text check (char_length(contact) <= 80),
  name        text check (char_length(name) <= 80),
  adult       boolean,
  interests   text[] check (coalesce(array_length(interests, 1), 0) <= 25 and char_length(array_to_string(interests, ',')) <= 600),
  other       text check (char_length(other) <= 120),
  goal        text check (char_length(goal) <= 40),
  intake_at   timestamptz,
  results     jsonb check (pg_column_size(results) <= 60000),
  report      jsonb check (pg_column_size(report) <= 60000),
  report_at   timestamptz
);
alter table public.trials enable row level security;
drop policy if exists "Teachers manage trials" on public.trials;
create policy "Teachers manage trials" on public.trials for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.trials from anon, authenticated;
grant select, insert, update, delete on public.trials to authenticated;

-- What the form page needs (name, day and time, and what was already answered)
create or replace function public.trial_get(t uuid) returns json
  language sql stable security definer set search_path = public as $$
  select json_build_object('name', name, 'starts_at', starts_at, 'adult', adult, 'interests', interests,
    'other', other, 'goal', goal, 'sent', intake_at is not null, 'closed', report_at is not null)
  from public.trials where token = t;
$$;

-- Send the form. Only these fields, and only before the report exists.
create or replace function public.trial_intake(t uuid, p_name text, p_adult boolean, p_interests text[], p_other text, p_goal text) returns boolean
  language plpgsql security definer set search_path = public as $$
begin
  if p_name is null or char_length(trim(p_name)) = 0 or char_length(p_name) > 80 then return false; end if;
  update public.trials set name = trim(p_name), adult = p_adult, interests = p_interests,
    other = nullif(trim(coalesce(p_other, '')), ''), goal = p_goal, intake_at = now()
  where token = t and report_at is null;
  return found;
end;
$$;

-- The finished report (nothing until the teacher sends it)
create or replace function public.trial_report(t uuid) returns json
  language sql stable security definer set search_path = public as $$
  select (report || jsonb_build_object('sent_at', report_at))::json from public.trials where token = t and report_at is not null;
$$;

revoke all on function public.trial_get(uuid) from public;
revoke all on function public.trial_intake(uuid, text, boolean, text[], text, text) from public;
revoke all on function public.trial_report(uuid) from public;
grant execute on function public.trial_get(uuid) to anon, authenticated;
grant execute on function public.trial_intake(uuid, text, boolean, text[], text, text) to anon, authenticated;
grant execute on function public.trial_report(uuid) to anon, authenticated;
