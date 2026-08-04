// The anon/publishable key is safe to expose in the browser; access is governed by RLS.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://bbwzzmsektsykzgkxjaf.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJid3p6bXNla3RzeWt6Z2t4amFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMzY0MjMsImV4cCI6MjA5NjcxMjQyM30.do3FTKZtbuTtWWMsAstwpzQCIINstkTkkHvZYZ-FPq4";

// IMPORTANT: this must check the *resolved* values (which always have a
// hardcoded fallback above), not the raw env vars. Checking the raw env vars
// was a real production bug: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are not set in
// this deployment (by design — see README), so that check was always false,
// which made every public data fetcher in lib/data.ts skip the database
// entirely and permanently serve static fallback content — even with a
// perfectly healthy, reachable database. Verified live on both localhost and
// the production deployment on 2026-08-04.
export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
