"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SIZES } from "@/lib/format";

export default function CustomersAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await sb
      .from("customers")
      .select("*, dogs(*), bookings(id)")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = rows.filter((c) => {
    const hay = `${c.full_name} ${c.email ?? ""} ${c.phone ?? ""} ${(c.dogs ?? []).map((d: any) => `${d.name} ${d.breed}`).join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  async function saveCustomer(c: any, patch: any) {
    const { error } = await sb.from("customers").update(patch).eq("id", c.id);
    setMsg(error ? `Error: ${error.message}` : "Customer saved.");
    if (!error) load();
  }
  async function saveDog(d: any, patch: any) {
    const { error } = await sb.from("dogs").update(patch).eq("id", d.id);
    setMsg(error ? `Error: ${error.message}` : `${d.name} saved.`);
    if (!error) load();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Customers &amp; dogs</h1>
          <p className="mt-1 text-sm text-inkgrey/70">Profiles build automatically from bookings — keep notes here.</p>
        </div>
        <input className="input !w-72" placeholder="Search people, dogs, breeds…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" />
      </header>

      {msg && <p className="rounded-2xl bg-lilac-100 px-4 py-2.5 text-sm text-plum">{msg}</p>}

      <div className="space-y-4">
        {filtered.map((c) => (
          <details key={c.id} className="card group p-0">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-6 py-4 [&::-webkit-details-marker]:hidden">
              <span>
                <strong className="font-display text-lg text-plum">{c.full_name}</strong>
                {c.is_pensioner && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-plum">PENSIONER</span>}
                <span className="block text-xs text-inkgrey/60">{c.email || "no email"} · {c.phone || "no phone"} · {(c.bookings ?? []).length} booking{(c.bookings ?? []).length === 1 ? "" : "s"}</span>
              </span>
              <span className="text-sm text-plum-mid">
                {(c.dogs ?? []).map((d: any) => d.name).join(", ") || "No dogs yet"} <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
              </span>
            </summary>
            <div className="space-y-5 border-t border-lilac-100 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-plum" checked={c.is_pensioner} onChange={(e) => saveCustomer(c, { is_pensioner: e.target.checked })} />
                  Pensioner discount
                </label>
                <input className="input sm:col-span-2" placeholder="Phone" defaultValue={c.phone ?? ""} onBlur={(e) => e.target.value !== (c.phone ?? "") && saveCustomer(c, { phone: e.target.value || null })} aria-label="Phone" />
              </div>
              <div>
                <label className="label">Customer notes</label>
                <textarea rows={2} className="input" defaultValue={c.notes} onBlur={(e) => e.target.value !== c.notes && saveCustomer(c, { notes: e.target.value })} />
              </div>
              {(c.dogs ?? []).map((d: any) => (
                <div key={d.id} className="rounded-2xl bg-lilac-50 p-4">
                  <p className="font-semibold text-plum">{d.name}</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <input className="input" placeholder="Breed" defaultValue={d.breed} onBlur={(e) => e.target.value !== d.breed && saveDog(d, { breed: e.target.value })} aria-label={`${d.name} breed`} />
                    <select className="input" value={d.size} onChange={(e) => saveDog(d, { size: e.target.value })} aria-label={`${d.name} size`}>
                      {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <textarea rows={2} className="input" placeholder="Behaviour notes" defaultValue={d.behaviour_notes} onBlur={(e) => e.target.value !== d.behaviour_notes && saveDog(d, { behaviour_notes: e.target.value })} aria-label={`${d.name} behaviour notes`} />
                    <textarea rows={2} className="input" placeholder="Medical notes" defaultValue={d.medical_notes} onBlur={(e) => e.target.value !== d.medical_notes && saveDog(d, { medical_notes: e.target.value })} aria-label={`${d.name} medical notes`} />
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
        {!filtered.length && <p className="card p-8 text-center text-sm text-inkgrey/60">No customers yet — they appear automatically when bookings come in.</p>}
      </div>
    </div>
  );
}
