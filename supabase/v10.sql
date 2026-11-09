-- Lingua v10 · Privacy and security: consent, private share links and two-step verification
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.
-- Nothing here deletes or changes existing data.

-- 1) Consent to the privacy notice (privacidad.html)
--    Students (or their parent) accept it once; the trial-class form records it too.
alter table public.profiles add column if not exists privacy_at timestamptz;
alter table public.trials   add column if not exists consent_at timestamptz;

create or replace function public.trial_consent(t uuid) returns boolean
  language plpgsql security definer set search_path = public as $$
begin
  update public.trials set consent_at = coalesce(consent_at, now()) where token = t and intake_at is not null;
  return found;
end;
$$;
revoke all on function public.trial_consent(uuid) from public;
grant execute on function public.trial_consent(uuid) to anon, authenticated;

-- 2) Private share links: reports, plans and proposals are saved here and the link carries only a code.
--    Links expire after 6 months and the teacher can turn them off for a student at any time.
create table if not exists public.shared_docs (
  id          uuid primary key default gen_random_uuid(),
  page        text not null check (page in ('informe', 'progress', 'plan', 'propuesta')),
  student_id  uuid references auth.users (id) on delete cascade,
  d           text not null check (char_length(d) <= 200000),
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '180 days',
  revoked_at  timestamptz
);
create index if not exists shared_docs_student on public.shared_docs (student_id);
alter table public.shared_docs enable row level security;
drop policy if exists "Teachers manage shared docs" on public.shared_docs;
create policy "Teachers manage shared docs" on public.shared_docs for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.shared_docs from anon, authenticated;
grant select, insert, update, delete on public.shared_docs to authenticated;

-- What a family's link can read: only that one document, only while it's active
create or replace function public.doc_get(t uuid) returns json
  language sql stable security definer set search_path = public as $$
  select json_build_object('page', page, 'd', d) from public.shared_docs
  where id = t and revoked_at is null and expires_at > now();
$$;
revoke all on function public.doc_get(uuid) from public;
grant execute on function public.doc_get(uuid) to anon, authenticated;

-- 3) Two-step verification: once an account turns it on, a session that only used the password
--    (no code yet) can't read or change anything. Accounts without it (students) work as before.
create or replace function public.mfa_ok() returns boolean
  language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified');
$$;
revoke all on function public.mfa_ok() from public;
grant execute on function public.mfa_ok() to anon, authenticated;

do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop policy if exists "Two-step verification when on" on public.%I', r.tablename);
    execute format('create policy "Two-step verification when on" on public.%I as restrictive for all to authenticated using (public.mfa_ok()) with check (public.mfa_ok())', r.tablename);
  end loop;
end $$;

drop policy if exists "Two-step verification when on" on storage.objects;
create policy "Two-step verification when on" on storage.objects as restrictive for all to authenticated using (public.mfa_ok()) with check (public.mfa_ok());
