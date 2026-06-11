import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export async function requireAdmin() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await sb.from("profiles").select("role, full_name, email").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin/login?error=not-admin");
  return { user, profile };
}
