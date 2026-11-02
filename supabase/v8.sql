-- Lingua v8 · class link (Teams, Meet, Zoom…) for each student.
-- The WhatsApp class reminder adds this link so the student can join from the message.
-- Safe to run more than once.
alter table public.student_admin add column if not exists meet_link text
  check (meet_link is null or (char_length(meet_link) <= 500 and meet_link ~ '^https://'));
