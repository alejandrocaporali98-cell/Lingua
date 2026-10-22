// Lingua · calendar Edge Function
// A private calendar link (iPhone, Google Calendar, Outlook) that always shows the latest classes.
// Each person gets their own secret link from the table "cal_tokens"; the link carries no password.
// Deploy: Supabase → Edge Functions → Deploy a new function → Via Editor → name "calendar" → paste this file.
// Then in the function's Details, turn OFF "Verify JWT" (calendar apps can't sign in; the secret link is the key).
import { createClient } from "npm:@supabase/supabase-js@2";

const TZ = Deno.env.get("CAL_TZ") || "America/Monterrey";
const OFFSET_MIN = Number(Deno.env.get("CAL_UTC_OFFSET_MIN") || -360); // Monterrey: UTC−6 all year

function secretKey(): string {
  const many = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (many) { try { const k = JSON.parse(many); return k.default || Object.values(k)[0] as string; } catch (_) { /* fall through */ } }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}
const pad = (n: number) => String(n).padStart(2, "0");
// a Date shifted to local wall-clock time, read with getUTC*
const local = (d: Date) => new Date(d.getTime() + OFFSET_MIN * 60000);
const fmtLocal = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
const fmtUTC = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = (line: string) => { const out: string[] = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = " " + s.slice(74); } out.push(s); return out.join("\r\n"); };
const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

Deno.serve(async (req) => {
  const url = new URL(req.url), token = url.searchParams.get("t") || "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return new Response("Not found", { status: 404 });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, secretKey(), { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: tok } = await db.from("cal_tokens").select("owner").eq("token", token).maybeSingle();
  if (!tok) return new Response("Not found", { status: 404 });
  const { data: isT } = await db.from("teachers").select("user_id").eq("user_id", tok.owner).maybeSingle();
  const teacher = !!isT;

  const { data: profiles } = await db.from("profiles").select("id, display_name");
  const nameOf = (id: string) => (profiles || []).find((p) => p.id === id)?.display_name || "Student";
  const { data: tRow } = await db.from("teachers").select("user_id").limit(1).maybeSingle();
  const teacherName = tRow ? nameOf(tRow.user_id) : "your teacher";

  let rq = db.from("class_rules").select("*").eq("active", true);
  if (!teacher) rq = rq.eq("student_id", tok.owner);
  const { data: rules } = await rq;
  const since = new Date(Date.now() - 45 * 864e5).toISOString(), until = new Date(Date.now() + 180 * 864e5).toISOString();
  let cq = db.from("classes").select("*").gte("starts_at", since).lte("starts_at", until);
  if (!teacher) cq = cq.eq("student_id", tok.owner);
  const { data: classes } = await cq;

  const title = (sid: string) => teacher ? `English · ${nameOf(sid)}` : `English class · ${teacherName}`;
  const now = new Date(), stamp = fmtUTC(now), lines: string[] = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lingua//Classes//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    `X-WR-CALNAME:${teacher ? "Lingua · My classes" : "Lingua · English classes"}`, `X-WR-TIMEZONE:${TZ}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H", "X-PUBLISHED-TTL:PT1H",
    "BEGIN:VTIMEZONE", `TZID:${TZ}`, "BEGIN:STANDARD", "DTSTART:19700101T000000",
    `TZOFFSETFROM:${OFFSET_MIN < 0 ? "-" : "+"}${pad(Math.floor(Math.abs(OFFSET_MIN) / 60))}${pad(Math.abs(OFFSET_MIN) % 60)}`,
    `TZOFFSETTO:${OFFSET_MIN < 0 ? "-" : "+"}${pad(Math.floor(Math.abs(OFFSET_MIN) / 60))}${pad(Math.abs(OFFSET_MIN) % 60)}`,
    "END:STANDARD", "END:VTIMEZONE"];

  // Weekly classes: one repeating event each; cancelled days are left out
  for (const r of rules || []) {
    const [hh, mm] = String(r.time).split(":").map(Number);
    const first = local(new Date(Date.now() - 28 * 864e5)); first.setUTCHours(hh, mm, 0, 0);
    while (first.getUTCDay() !== r.weekday) first.setUTCDate(first.getUTCDate() + 1);
    const end = new Date(first.getTime() + (r.minutes || 60) * 60000);
    const ex = (classes || []).filter((c) => c.rule_id === r.id && c.status === "cancelled").map((c) => fmtLocal(local(new Date(c.starts_at))));
    lines.push("BEGIN:VEVENT", `UID:rule-${r.id}@lingua`, `DTSTAMP:${stamp}`, `DTSTART;TZID=${TZ}:${fmtLocal(first)}`, `DTEND;TZID=${TZ}:${fmtLocal(end)}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${DAYS[r.weekday]}`, ...(ex.length ? [`EXDATE;TZID=${TZ}:${ex.join(",")}`] : []),
      fold(`SUMMARY:${esc(title(r.student_id))}`), "END:VEVENT");
  }
  // One-off classes (not part of a weekly class)
  for (const c of (classes || []).filter((c) => !c.rule_id && c.status !== "cancelled")) {
    const s = new Date(c.starts_at), e = new Date(s.getTime() + 60 * 60000);
    lines.push("BEGIN:VEVENT", `UID:class-${c.id}@lingua`, `DTSTAMP:${stamp}`, `DTSTART:${fmtUTC(s)}`, `DTEND:${fmtUTC(e)}`,
      fold(`SUMMARY:${esc(title(c.student_id) + (c.lesson_id ? " · Lesson " + c.lesson_id : ""))}`), "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n") + "\r\n", { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-cache", "Access-Control-Allow-Origin": "*" } });
});
