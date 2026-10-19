// Lingua · admin-users Edge Function
// Lets a teacher create student accounts and change passwords from the teacher panel.
// The secret key never leaves Supabase: it comes from the function's own environment.
// Deploy: Supabase → Edge Functions → Deploy a new function → Via Editor → name "admin-users" → paste this file.
// Then in the function's Details, turn OFF "Verify JWT" (this code checks the user itself).
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function secretKey(): string {
  const many = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (many) { try { const k = JSON.parse(many); return k.default || Object.values(k)[0] as string; } catch (_) { /* fall through */ } }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, secretKey(), { auth: { persistSession: false, autoRefreshToken: false } });

  // Who is calling? Only accounts in the "teachers" table may continue.
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: who, error: whoErr } = await admin.auth.getUser(token);
  if (whoErr || !who?.user) return json({ error: "Please sign in again." }, 401);
  const { data: t } = await admin.from("teachers").select("user_id").eq("user_id", who.user.id).maybeSingle();
  if (!t) return json({ error: "Only teachers can do this." }, 403);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch (_) { return json({ error: "Bad request" }, 400); }
  const domain = String(body.domain || "student.lingua.app").toLowerCase();
  const toEmail = (u: string) => { u = u.trim().toLowerCase(); return u.includes("@") ? u : `${u}@${domain}`; };
  const okPassword = (p: unknown) => typeof p === "string" && p.length >= 8 && p.length <= 72;

  switch (body.action) {
    case "list": {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 400);
      return json({ users: data.users.map((u) => ({ id: u.id, email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at })) });
    }
    case "create": {
      const username = String(body.username || "");
      if (!/^[a-z0-9._-]{3,40}$/i.test(username)) return json({ error: "Username: 3–40 letters, numbers, dots or dashes." }, 400);
      if (!okPassword(body.password)) return json({ error: "Password: at least 8 characters." }, 400);
      const { data, error } = await admin.auth.admin.createUser({ email: toEmail(username), password: body.password as string, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      const name = String(body.display_name || "").trim().slice(0, 40);
      if (name) await admin.from("profiles").upsert({ id: data.user.id, display_name: name, updated_at: new Date().toISOString() });
      return json({ user: { id: data.user.id, email: data.user.email } });
    }
    case "password": {
      if (!okPassword(body.password)) return json({ error: "Password: at least 8 characters." }, 400);
      const { error } = await admin.auth.admin.updateUserById(String(body.user_id), { password: body.password as string });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    default:
      return json({ error: "Unknown action" }, 400);
  }
});
