"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { fmtTime } from "@/lib/format";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function weekStart(d: Date) {
  const x = new Date(d);
  x.setDate(x.getDate() - x.getDay() + 1); // Monday
  x.setHours(0, 0, 0, 0);
  return x;
}
const iso = (d: Date) => d.toISOString().slice(0, 10);

export default function CalendarAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [anchor, setAnchor] = useState(() => weekStart(new Date()));
  const [bookings, setBookings] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [block, setBlock] = useState({ date: "", start_time: "09:00", end_time: "10:00", reason: "" });

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(anchor); d.setDate(d.getDate() + i); return d; }), [anchor]);

  async function load() {
    const from = iso(days[0]), to = iso(days[6]);
    const [{ data: b }, { data: bl }, { data: h }] = await Promise.all([
      sb.from("bookings").select("id,date,start_time,end_time,status,dogs(name),services(name)")
        .gte("date", from).lte("date", to).in("status", ["pending", "approved", "rescheduled"]).order("start_time"),
      sb.from("blocked_times").select("*").gte("date", from).lte("date", to).order("start_time"),
      sb.from("business_hours").select("*").order("day_of_week"),
    ]);
    setBookings(b ?? []); setBlocked(bl ?? []); setHours(h ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [anchor]);

  async function saveHours(row: any) {
    const { error } = await sb.from("business_hours").update({
      is_open: row.is_open, open_time: row.open_time, close_time: row.close_time,
    }).eq("day_of_week", row.day_of_week);
    setMsg(error ? `Error: ${error.message}` : `${DAYS[row.day_of_week]} hours saved.`);
  }

  async function addBlock() {
    if (!block.date) { setMsg("Pick a date for the blocked time."); return; }
    const { error } = await sb.from("blocked_times").insert(block);
    setMsg(error ? `Error: ${error.message}` : "Time blocked.");
    if (!error) { setBlock({ ...block, reason: "" }); load(); }
  }

  async function removeBlock(id: string) {
    await sb.from("blocked_times").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Calendar &amp; hours</h1>
          <p className="mt-1 text-sm text-inkgrey/70">Your week at a glance, opening hours, and blocked-out time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); }}>← Previous</button>
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => setAnchor(weekStart(new Date()))}>This week</button>
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); }}>Next →</button>
        </div>
      </header>

      {msg && <p className="rounded-2xl bg-lilac-100 px-4 py-2.5 text-sm text-plum">{msg}</p>}

      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d) => {
          const dayB = bookings.filter((b) => b.date === iso(d));
          const dayBl = blocked.filter((b) => b.date === iso(d));
          const today = iso(new Date()) === iso(d);
          return (
            <div key={iso(d)} className={`card min-h-36 p-3 ${today ? "ring-2 ring-gold/60" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-plum-mid">
                {d.toLocaleDateString("en-ZA", { weekday: "short" })} {d.getDate()}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs">
                {dayB.map((b: any) => (
                  <li key={b.id} className="rounded-lg bg-lilac-100 px-2 py-1.5">
                    <strong className="text-plum">{fmtTime(b.start_time)}</strong> {b.dogs?.name}
                    <span className="block text-[10px] text-inkgrey/70">{b.services?.name} · {b.status}</span>
                  </li>
                ))}
                {dayBl.map((b: any) => (
                  <li key={b.id} className="rounded-lg bg-amber-100 px-2 py-1.5 text-amber-900">
                    <strong>{fmtTime(b.start_time)}–{fmtTime(b.end_time)}</strong> blocked
                    {b.reason && <span className="block text-[10px]">{b.reason}</span>}
                  </li>
                ))}
                {!dayB.length && !dayBl.length && <li className="text-inkgrey/40">—</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg">Opening hours</h2>
          <div className="mt-4 space-y-2.5">
            {hours.map((h, i) => (
              <div key={h.day_of_week} className="flex items-center gap-3 text-sm">
                <label className="flex w-28 items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-plum" checked={h.is_open}
                    onChange={(e) => { const n = [...hours]; n[i] = { ...h, is_open: e.target.checked }; setHours(n); }} />
                  {DAYS[h.day_of_week].slice(0, 3)}
                </label>
                <input type="time" className="input !w-32 !py-2" value={h.open_time.slice(0, 5)} disabled={!h.is_open}
                  onChange={(e) => { const n = [...hours]; n[i] = { ...h, open_time: e.target.value }; setHours(n); }} />
                <span className="text-inkgrey/50">to</span>
                <input type="time" className="input !w-32 !py-2" value={h.close_time.slice(0, 5)} disabled={!h.is_open}
                  onChange={(e) => { const n = [...hours]; n[i] = { ...h, close_time: e.target.value }; setHours(n); }} />
                <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => saveHours(hours[i])}>Save</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg">Block out time</h2>
          <p className="mt-1 text-xs text-inkgrey/60">Holidays, lunch breaks, vet runs — blocked times never show as bookable slots.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="bdate">Date</label>
              <input id="bdate" type="date" className="input" value={block.date} onChange={(e) => setBlock({ ...block, date: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="breason">Reason</label>
              <input id="breason" className="input" value={block.reason} placeholder="Optional" onChange={(e) => setBlock({ ...block, reason: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="bstart">From</label>
              <input id="bstart" type="time" className="input" value={block.start_time} onChange={(e) => setBlock({ ...block, start_time: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="bend">To</label>
              <input id="bend" type="time" className="input" value={block.end_time} onChange={(e) => setBlock({ ...block, end_time: e.target.value })} />
            </div>
          </div>
          <button className="btn-primary mt-4 !px-5 !py-2.5 text-sm" onClick={addBlock}>Block this time</button>
          <ul className="mt-5 space-y-2 text-sm">
            {blocked.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-2.5">
                <span>{b.date} · {fmtTime(b.start_time)}–{fmtTime(b.end_time)} {b.reason && <em className="text-inkgrey/60">— {b.reason}</em>}</span>
                <button className="text-xs font-semibold text-red-700 hover:underline" onClick={() => removeBlock(b.id)}>Remove</button>
              </li>
            ))}
            {!blocked.length && <li className="text-inkgrey/50">No blocked times this week.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
