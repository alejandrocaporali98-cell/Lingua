-- Lingua v4 · Administración (cuenta de Josefina): clases, pagos, comprobantes y fichas de pago.
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run again.

-- ── 1. Office accounts (role "admin") ──
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin'); $$;
create or replace function public.is_staff() returns boolean
  language sql stable security definer set search_path = public
  as $$ select public.is_teacher() or public.is_admin(); $$;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;

drop policy if exists "Staff read staff"      on public.staff;
drop policy if exists "Teachers manage staff" on public.staff;
create policy "Staff read staff"      on public.staff for select to authenticated using (public.is_staff());
create policy "Teachers manage staff" on public.staff for all    to authenticated using (public.is_teacher()) with check (public.is_teacher());
revoke all on public.staff from anon, authenticated;
grant select, insert, update, delete on public.staff to authenticated;

-- The office needs to know who the teacher is (to leave you out of the student list)
drop policy if exists "Staff read teachers" on public.teachers;
create policy "Staff read teachers" on public.teachers for select to authenticated using (public.is_staff());
grant select on public.teachers to authenticated;

-- ── 2. What the office can see and change ──
-- Sees names (not lessons, quizzes or homework); manages classes, weekly schedule, plans and payments.
drop policy if exists "Office reads profiles"   on public.profiles;
drop policy if exists "Office reads settings"   on public.student_settings;
drop policy if exists "Office manages classes"  on public.classes;
drop policy if exists "Office manages rules"    on public.class_rules;
drop policy if exists "Office manages plans"    on public.student_admin;
drop policy if exists "Office manages payments" on public.payments;
create policy "Office reads profiles"   on public.profiles         for select to authenticated using (public.is_admin());
create policy "Office reads settings"   on public.student_settings for select to authenticated using (public.is_admin());
create policy "Office manages classes"  on public.classes          for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Office manages rules"    on public.class_rules      for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Office manages plans"    on public.student_admin    for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Office manages payments" on public.payments         for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── 3. Payments: how they paid, transfer reference and the screenshot ──
alter table public.payments add column if not exists method     text check (method in ('transfer', 'cash', 'deposit', 'card', 'other'));
alter table public.payments add column if not exists reference  text check (char_length(reference) <= 80);
alter table public.payments add column if not exists proof_path text check (char_length(proof_path) <= 300);

-- ── 4. Bank details printed on the payment slips (one row) ──
create table if not exists public.billing_info (
  id           int primary key default 1 check (id = 1),
  bank         text check (char_length(bank) <= 60),
  holder       text check (char_length(holder) <= 120),
  clabe        text check (clabe is null or clabe ~ '^[0-9]{18}$'),
  account      text check (char_length(account) <= 20),
  card         text check (card is null or card ~ '^[0-9]{15,16}$'),
  send_to      text check (char_length(send_to) <= 120),
  instructions text check (char_length(instructions) <= 600),
  updated_at   timestamptz not null default now()
);
alter table public.billing_info enable row level security;
drop policy if exists "Staff manage bank details" on public.billing_info;
create policy "Staff manage bank details" on public.billing_info for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.billing_info from anon, authenticated;
grant select, insert, update on public.billing_info to authenticated;

-- ── 5. Payment slips sent to families ──
create table if not exists public.charges (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  month      text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  folio      text not null check (char_length(folio) <= 30),
  concept    text check (char_length(concept) <= 140),
  amount     numeric(10,2) not null check (amount >= 0),
  due        date,
  note       text check (char_length(note) <= 300),
  created_at timestamptz not null default now()
);
alter table public.charges enable row level security;
drop policy if exists "Staff manage slips" on public.charges;
create policy "Staff manage slips" on public.charges for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.charges from anon, authenticated;
grant select, insert, update, delete on public.charges to authenticated;

-- ── 6. Private storage for transfer screenshots ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('comprobantes', 'comprobantes', false, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'])
on conflict (id) do nothing;
drop policy if exists "Proofs read"   on storage.objects;
drop policy if exists "Proofs upload" on storage.objects;
drop policy if exists "Proofs delete" on storage.objects;
create policy "Proofs read"   on storage.objects for select to authenticated using (bucket_id = 'comprobantes' and public.is_staff());
create policy "Proofs upload" on storage.objects for insert to authenticated with check (bucket_id = 'comprobantes' and public.is_staff());
create policy "Proofs delete" on storage.objects for delete to authenticated using (bucket_id = 'comprobantes' and public.is_staff());
