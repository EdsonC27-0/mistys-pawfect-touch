import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Minimal uptime check: confirms the deployed app can reach the database
 * within a bounded time. Point an external monitor (UptimeRobot, Better
 * Uptime, a Vercel cron hitting this + alerting on failure, etc.) at this
 * route — right now nothing does, so a paused/unreachable database goes
 * unnoticed until a customer reports a failed booking.
 */
export async function GET() {
  const startedAt = Date.now();
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const { error } = await sb.from("services").select("id", { head: true, count: "exact" }).abortSignal(controller.signal);
    clearTimeout(timer);

    if (error) {
      return NextResponse.json({ status: "degraded", database: "error", message: error.message, latency_ms: Date.now() - startedAt }, { status: 503 });
    }
    return NextResponse.json({ status: "ok", database: "reachable", latency_ms: Date.now() - startedAt });
  } catch {
    return NextResponse.json({ status: "down", database: "unreachable", latency_ms: Date.now() - startedAt }, { status: 503 });
  }
}
