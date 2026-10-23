-- Lingua v6 · Security
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.
-- It also includes v5 (weekly plans and siblings), so if v5 wasn't run yet, this file is enough.

-- ── 0. v5: weekly plans and families (siblings who pay together) ──
alter table public.student_admin drop constraint if exists student_admin_billing_check;
alter table public.student_admin add constraint student_admin_billing_check check (billing in ('per_class', 'weekly', 'monthly', 'free'));
alter table public.student_admin add column if not exists pay_day smallint not null default 6 check (pay_day between 0 and 6);
alter table public.student_admin add column if not exists family  text check (char_length(family) <= 60);
alter table public.payments add column if not exists week date;
alter table public.charges  add column if not exists week date;

-- ── 1. Private notes about each student: only the teacher (the office account can't read them) ──
create table if not exists public.student_notes (
  student_id uuid primary key references auth.users (id) on delete cascade,
  notes      text check (char_length(notes) <= 5000),
  updated_at timestamptz not null default now()
);
alter table public.student_notes enable row level security;
drop policy if exists "Teachers only notes" on public.student_notes;
create policy "Teachers only notes" on public.student_notes for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.student_notes from anon, authenticated;
grant select, insert, update, delete on public.student_notes to authenticated;
-- move the notes that were saved with the billing plan, then clear them there
insert into public.student_notes (student_id, notes, updated_at)
  select student_id, notes, updated_at from public.student_admin where coalesce(notes, '') <> ''
  on conflict (student_id) do nothing;
update public.student_admin a set notes = null
  where a.notes is not null and exists (select 1 from public.student_notes n where n.student_id = a.student_id);

-- ── 2. Payment slips and receipts that can't be faked ──
-- Each slip and payment gets a secret code. The slip / receipt page asks the database with that code,
-- and the bank details, amount and names come from here, never from the link itself.
alter table public.charges  add column if not exists token uuid not null default gen_random_uuid();
alter table public.payments add column if not exists token uuid not null default gen_random_uuid();
create unique index if not exists charges_token_key  on public.charges (token);
create unique index if not exists payments_token_key on public.payments (token);

create or replace function public.family_names(sid uuid) returns json
  language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(p.display_name order by p.display_name), '[]'::json) from public.profiles p
  where p.id = sid or p.id in (
    select x.student_id from public.student_admin x
    where x.family is not null and x.family = (select y.family from public.student_admin y where y.student_id = sid));
$$;
revoke all on function public.family_names(uuid) from public, anon, authenticated;

create or replace function public.slip_check(t uuid) returns json
  language sql stable security definer set search_path = public as $$
  select json_build_object(
    'folio', c.folio, 'concept', c.concept, 'amount', c.amount, 'month', c.month, 'week', c.week, 'created', c.created_at,
    'currency', coalesce((select a.currency from public.student_admin a where a.student_id = c.student_id), 'MXN'),
    'names', public.family_names(c.student_id),
    'bank', (select json_build_object('bank', b.bank, 'holder', b.holder, 'clabe', b.clabe, 'account', b.account, 'card', b.card, 'to', b.send_to, 'ins', b.instructions)
             from public.billing_info b where b.id = 1))
  from public.charges c where c.token = t;
$$;
create or replace function public.receipt_check(t uuid) returns json
  language sql stable security definer set search_path = public as $$
  select json_build_object(
    'amount', p.amount, 'paid_on', p.paid_on, 'month', p.month, 'week', p.week, 'method', p.method, 'reference', p.reference,
    'currency', coalesce((select a.currency from public.student_admin a where a.student_id = p.student_id), 'MXN'),
    'names', public.family_names(p.student_id))
  from public.payments p where p.token = t;
$$;
revoke all on function public.slip_check(uuid) from public;
revoke all on function public.receipt_check(uuid) from public;
grant execute on function public.slip_check(uuid) to anon, authenticated;
grant execute on function public.receipt_check(uuid) to anon, authenticated;
