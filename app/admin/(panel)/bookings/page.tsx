"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { zar, fmtDate, fmtTime } from "@/lib/format";

const STATUSES = ["pending", "approved", "rejected", "rescheduled", "completed", "cancelled"] as const;
const PAY_STATUSES = ["pending", "link_sent", "paid", "failed", "refunded", "cancelled"] as const;
const PROVIDERS = ["payfast", "peach", "yoco", "ozow", "manual_eft", "other"];

export default function BookingsAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("active");
  const [sel, setSel] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await sb
      .from("bookings")
      .select("*, services(name,duration_minutes), customers(full_name,email,phone,is_pensioner), dogs(name,breed,size,behaviour_notes,medical_notes)")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });
    setRows(data ?? []);
    if (sel) setSel((data ?? []).find((r) => r.id === sel.id) ?? null);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = rows.filter((r) =>
    filter === "all" ? true :
    filter === "active" ? ["pending", "approved", "rescheduled"].includes(r.status) :
    r.status === filter
  );

  async function update(id: string, patch: any, note?: string) {
    setBusy(true); setMsg("");
    const { error } = await sb.from("bookings").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    setBusy(false);
    setMsg(error ? `Error: ${error.message}` : note ?? "Saved.");
    if (!error) load();
  }

  async function recordPayment(b: any, status: string) {
    setBusy(true); setMsg("");
    const { error } = await sb.rpc("record_payment", { p_booking_id: b.id, p_status: status });
    setBusy(false);
    setMsg(error ? `Error: ${error.message}` : `Payment marked ${status}.`);
    if (!error) load();
  }

  function isValidPaymentLink(url: string) {
    if (!url) return true; // clearing the field is fine
    try {
      const u = new URL(url);
      return u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function confirmationText(b: any) {
    return `Hi ${b.customers?.full_name?.split(" ")[0] ?? ""}! ${b.dogs?.name}'s ${b.services?.name} at Misty's Pawfect Touch is ${b.status === "approved" ? "confirmed" : b.status} for ${fmtDate(b.date)} at ${fmtTime(b.start_time)}. Ref ${b.reference}.${b.amount != null ? ` Estimated price ${zar(Number(b.amount))}.` : ""}${b.payment_link ? ` Payment link: ${b.payment_link}` : ""} See you soon! 🐾`;
  }
  const waLink = (b: any) => {
    const phone = (b.customers?.phone ?? "").replace(/[^\d]/g, "").replace(/^0/, "27");
    return `https://wa.me/${phone}?text=${encodeURIComponent(confirmationText(b))}`;
  };
  const mailLink = (b: any) =>
    `mailto:${b.customers?.email ?? ""}?subject=${encodeURIComponent(`Your booking ${b.reference} — Misty's Pawfect Touch`)}&body=${encodeURIComponent(confirmationText(b))}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-inkgrey/70">Approve, reschedule, and manage payments.</p>
        </div>
        <select className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter bookings">
          <option value="active">Active (pending / approved / rescheduled)</option>
          <option value="all">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </header>

      {msg && <p className="rounded-2xl bg-lilac-100 px-4 py-2.5 text-sm text-plum">{msg}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-lilac-100 text-left text-xs uppercase tracking-wider text-inkgrey/60">
                <th className="px-5 py-3">When</th><th className="px-3 py-3">Dog / service</th>
                <th className="px-3 py-3">Status</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3">Est.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} onClick={() => setSel(b)}
                  className={`cursor-pointer border-b border-lilac-100 last:border-0 hover:bg-lilac-50 ${sel?.id === b.id ? "bg-lilac-50" : ""}`}>
                  <td className="px-5 py-3 whitespace-nowrap">{fmtDate(b.date)}<br /><span className="text-xs text-inkgrey/60">{fmtTime(b.start_time)}–{fmtTime(b.end_time)}</span></td>
                  <td className="px-3 py-3"><strong className="text-plum">{b.dogs?.name}</strong> <span className="text-xs text-inkgrey/60">({b.dogs?.size})</span><br /><span className="text-xs">{b.services?.name}</span></td>
                  <td className="px-3 py-3"><span className="rounded-full bg-lilac-100 px-2.5 py-1 text-xs font-semibold capitalize text-plum">{b.status}</span></td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${b.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{b.payment_status.replace("_", " ")}</span></td>
                  <td className="px-3 py-3">{b.amount != null ? zar(Number(b.amount)) : "—"}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={5} className="px-5 py-8 text-center text-inkgrey/60">No bookings match this filter.</td></tr>}
            </tbody>
          </table>
        </div>

        {sel ? (
          <aside className="card h-fit space-y-5 p-6">
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-xl">{sel.dogs?.name} · {sel.services?.name}</h2>
                <p className="text-xs text-inkgrey/60">Ref {sel.reference} · requested {new Date(sel.created_at).toLocaleString("en-ZA")}</p>
              </div>
              <button className="text-inkgrey/50 hover:text-plum" onClick={() => setSel(null)} aria-label="Close">✕</button>
            </header>

            <dl className="space-y-1.5 text-sm">
              <div><dt className="inline font-semibold text-plum">Owner: </dt><dd className="inline">{sel.customers?.full_name} {sel.customers?.is_pensioner && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-plum">PENSIONER</span>}</dd></div>
              <div><dt className="inline font-semibold text-plum">Contact: </dt><dd className="inline">{sel.customers?.phone || "—"} · {sel.customers?.email || "—"}</dd></div>
              <div><dt className="inline font-semibold text-plum">Dog: </dt><dd className="inline">{sel.dogs?.breed || "Breed unknown"}, {sel.dogs?.size}</dd></div>
              {sel.customer_notes && <div><dt className="inline font-semibold text-plum">Customer notes: </dt><dd className="inline">{sel.customer_notes}</dd></div>}
            </dl>

            <div className="space-y-2 border-t border-lilac-100 pt-4">
              <span className="label">Booking status</span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s} disabled={busy} onClick={() => update(sel.id, { status: s }, `Booking ${s}.`)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${sel.status === s ? "bg-plum text-white" : "bg-lilac-100 text-plum hover:bg-lilac-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="label" htmlFor="rdate">Reschedule to</label>
                  <input id="rdate" type="date" className="input" defaultValue={sel.date} onChange={(e) => (sel._newDate = e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="label" htmlFor="rtime">Time</label>
                  <input id="rtime" type="time" className="input" defaultValue={fmtTime(sel.start_time)} onChange={(e) => (sel._newTime = e.target.value)} />
                </div>
                <button className="btn-ghost !px-4 !py-3 text-xs" disabled={busy} onClick={() => {
                  const d = sel._newDate ?? sel.date;
                  const t = sel._newTime ?? fmtTime(sel.start_time);
                  const dur = sel.services?.duration_minutes ?? 60;
                  const end = new Date(`2000-01-01T${t}:00`); end.setMinutes(end.getMinutes() + dur);
                  update(sel.id, { date: d, start_time: t, end_time: end.toTimeString().slice(0, 8), status: "rescheduled" }, "Booking rescheduled.");
                }}>Move</button>
              </div>
            </div>

            <div className="space-y-3 border-t border-lilac-100 pt-4">
              <span className="label">Payment</span>
              <div className="grid grid-cols-2 gap-2">
                <select className="input" value={sel.payment_provider || ""} onChange={(e) => update(sel.id, { payment_provider: e.target.value }, "Provider saved.")} aria-label="Payment provider">
                  <option value="">Provider…</option>
                  {PROVIDERS.map((p) => <option key={p} value={p}>{p.replace("_", " ")}</option>)}
                </select>
                <input className="input" type="number" step="0.01" placeholder="Amount" defaultValue={sel.amount ?? ""} onBlur={(e) => e.target.value !== String(sel.amount ?? "") && update(sel.id, { amount: e.target.value ? Number(e.target.value) : null }, "Amount saved.")} aria-label="Amount" />
              </div>
              <input className="input" placeholder="Paste payment link (PayFast, Yoco, Ozow…) — must be a valid https:// URL" defaultValue={sel.payment_link}
                onBlur={(e) => {
                  if (e.target.value === sel.payment_link) return;
                  if (!isValidPaymentLink(e.target.value)) {
                    setMsg("Error: payment link must be a valid https:// URL.");
                    e.target.value = sel.payment_link;
                    return;
                  }
                  update(sel.id, { payment_link: e.target.value }, "Payment link saved.");
                }} aria-label="Payment link" />
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost !px-3.5 !py-2 text-xs" disabled={busy || !sel.payment_link} onClick={() => recordPayment(sel, "link_sent")}>Mark link sent</button>
                <button className="btn-primary !px-3.5 !py-2 text-xs" disabled={busy} onClick={() => recordPayment(sel, "paid")}>Mark paid</button>
                {PAY_STATUSES.filter((s) => !["paid", "link_sent"].includes(s)).map((s) => (
                  <button key={s} className="rounded-full bg-lilac-100 px-3.5 py-2 text-xs font-semibold capitalize text-plum hover:bg-lilac-200" disabled={busy}
                    onClick={() => recordPayment(sel, s)}>{s.replace("_", " ")}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-lilac-100 pt-4">
              <span className="label">Send confirmation</span>
              <div className="flex flex-wrap gap-2">
                <a className={`btn-whatsapp !px-4 !py-2 text-xs ${!sel.customers?.phone ? "pointer-events-none opacity-40" : ""}`} href={waLink(sel)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a className={`btn-ghost !px-4 !py-2 text-xs ${!sel.customers?.email ? "pointer-events-none opacity-40" : ""}`} href={mailLink(sel)}>Email</a>
                <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => navigator.clipboard.writeText(confirmationText(sel))}>Copy message</button>
              </div>
            </div>

            <div className="border-t border-lilac-100 pt-4">
              <label className="label" htmlFor="adminnotes">Admin notes</label>
              <textarea id="adminnotes" rows={3} className="input" defaultValue={sel.admin_notes}
                onBlur={(e) => e.target.value !== sel.admin_notes && update(sel.id, { admin_notes: e.target.value }, "Notes saved.")} />
            </div>
          </aside>
        ) : (
          <aside className="card flex h-fit items-center justify-center p-10 text-sm text-inkgrey/60">Select a booking to manage it.</aside>
        )}
      </div>
    </div>
  );
}
