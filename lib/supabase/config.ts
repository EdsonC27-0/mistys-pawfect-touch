// The anon/publishable key is safe to expose in the browser; access is governed by RLS.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://bbwzzmsektsykzgkxjaf.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJid3p6bXNla3RzeWt6Z2t4amFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMzY0MjMsImV4cCI6MjA5NjcxMjQyM30.do3FTKZtbuTtWWMsAstwpzQCIINstkTkkHvZYZ-FPq4";
