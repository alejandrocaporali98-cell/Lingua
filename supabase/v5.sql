-- Lingua v5 · Weekly plans and families (siblings who pay together, one payment and one receipt).
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.

-- ── 1. Plans: add "weekly", the pay day and the family ──
alter table public.student_admin drop constraint if exists student_admin_billing_check;
alter table public.student_admin add constraint student_admin_billing_check check (billing in ('per_class', 'weekly', 'monthly', 'free'));
alter table public.student_admin add column if not exists pay_day smallint not null default 6 check (pay_day between 0 and 6);
alter table public.student_admin add column if not exists family  text check (char_length(family) <= 60);

-- ── 2. Payments and slips can be for one week (the pay day of that week) ──
alter table public.payments add column if not exists week date;
alter table public.charges  add column if not exists week date;
