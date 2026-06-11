import { supabaseServer } from "@/lib/supabase/server";
import { zar, fmtDate, fmtTime } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const sb = supabaseServer();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: bookings }, { data: enquiries }] = await Promise.all([
    sb.from("bookings").select("id,date,start_time,status,payment_status,amount,services(name),customers(full_name),dogs(name)").order("date").order("start_time"),
    sb.from("enquiries").select("id,status").eq("status", "new"),
  ]);

  const all = bookings ?? [];
  const upcoming = all.filter((b) => b.date >= today && ["pending", "approved", "rescheduled"].includes(b.status));
  const pending = all.filter((b) => b.status === "pending");
  const paid = all.filter((b) => b.payment_status === "paid");
  const unpaid = all.filter((b) => ["pending", "link_sent"].includes(b.payment_status) && !["rejected", "cancelled"].includes(b.status));
  const revenue = paid.reduce((s, b) => s + Number(b.amount ?? 0), 0);
  const pipeline = unpaid.reduce((s, b) => s + Number(b.amount ?? 0), 0);

  const byService = new Map<string, number>();
  all.forEach((b: any) => byService.set(b.services?.name ?? "—", (byService.get(b.services?.name ?? "—") ?? 0) + 1));
  const popular = [...byService.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const byStatus = new Map<string, number>();
  all.forEach((b) => byStatus.set(b.status, (byStatus.get(b.status) ?? 0) + 1));

  const stats = [
    { label: "Total bookings", value: String(all.length) },
    { label: "Upcoming", value: String(upcoming.length) },
    { label: "Awaiting approval", value: String(pending.length), accent: pending.length > 0 },
    { label: "Paid bookings", value: String(paid.length) },
    { label: "Unpaid (active)", value: String(unpaid.length) },
    { label: "Revenue (paid)", value: zar(revenue) },
    { label: "Pipeline (unpaid est.)", value: zar(pipeline) },
    { label: "New enquiries", value: String((enquiries ?? []).length), accent: (enquiries ?? []).length > 0 },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-inkgrey/70">A quick read on the parlour&rsquo;s day.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`card p-5 ${s.accent ? "ring-2 ring-gold/60" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-inkgrey/60">{s.label}</p>
            <p className="mt-1 font-display text-2xl text-plum">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg">Next up</h2>
          <ul className="mt-4 divide-y divide-lilac-100 text-sm">
            {upcoming.slice(0, 8).map((b: any) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <strong className="text-plum">{b.dogs?.name}</strong> · {b.services?.name}
                  <span className="block text-xs text-inkgrey/60">{b.customers?.full_name}</span>
                </span>
                <span className="text-right text-xs">
                  {fmtDate(b.date)}<br />{fmtTime(b.start_time)} · <em className="not-italic capitalize text-plum-mid">{b.status}</em>
                </span>
              </li>
            ))}
            {!upcoming.length && <li className="py-3 text-inkgrey/60">No upcoming bookings yet.</li>}
          </ul>
          <Link href="/admin/bookings" className="btn-ghost mt-4 !px-4 !py-2 text-xs">Manage bookings</Link>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg">Most popular services</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {popular.map(([name, count]) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate">{name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-lilac-100">
                    <span className="block h-full rounded-full bg-gradient-to-r from-plum to-plum-mid" style={{ width: `${(count / (popular[0]?.[1] || 1)) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right font-semibold text-plum">{count}</span>
                </li>
              ))}
              {!popular.length && <li className="text-inkgrey/60">No data yet.</li>}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg">Booking status breakdown</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...byStatus.entries()].map(([status, count]) => (
                <span key={status} className="rounded-full bg-lilac-100 px-4 py-1.5 text-xs font-semibold capitalize text-plum">
                  {status}: {count}
                </span>
              ))}
              {!byStatus.size && <span className="text-sm text-inkgrey/60">No bookings yet.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
