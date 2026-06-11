"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SIZES } from "@/lib/format";

export default function ServicesAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", slug: "", category: "grooming", duration_minutes: 60, short_description: "" });

  async function load() {
    const { data } = await sb.from("services").select("*, service_prices(*)").order("sort_order");
    setRows((data ?? []).map((s) => ({ ...s, service_prices: (s.service_prices ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order) })));
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function saveService(id: string, patch: any) {
    const { error } = await sb.from("services").update(patch).eq("id", id);
    setMsg(error ? `Error: ${error.message}` : "Service saved.");
    if (!error) load();
  }
  async function savePrice(id: string, patch: any) {
    const { error } = await sb.from("service_prices").update(patch).eq("id", id);
    setMsg(error ? `Error: ${error.message}` : "Price saved.");
    if (!error) load();
  }
  async function addPrice(serviceId: string) {
    const { error } = await sb.from("service_prices").insert({ service_id: serviceId, size: null, label: "New tier", price: 0 });
    if (!error) load(); else setMsg(`Error: ${error.message}`);
  }
  async function removePrice(id: string) {
    await sb.from("service_prices").delete().eq("id", id);
    load();
  }
  async function addService() {
    if (!draft.name.trim()) return;
    const slug = (draft.slug || draft.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await sb.from("services").insert({ ...draft, slug, sort_order: rows.length + 1 });
    setMsg(error ? `Error: ${error.message}` : "Service added.");
    if (!error) { setAdding(false); setDraft({ name: "", slug: "", category: "grooming", duration_minutes: 60, short_description: "" }); load(); }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Services &amp; pricing</h1>
          <p className="mt-1 text-sm text-inkgrey/70">Changes go live on the site within a minute.</p>
        </div>
        <button className="btn-primary !px-5 !py-2.5 text-sm" onClick={() => setAdding(!adding)}>{adding ? "Cancel" : "Add service"}</button>
      </header>

      {msg && <p className="rounded-2xl bg-lilac-100 px-4 py-2.5 text-sm text-plum">{msg}</p>}

      {adding && (
        <div className="card grid gap-3 p-6 sm:grid-cols-2">
          <input className="input" placeholder="Service name *" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className="input" placeholder="Slug (auto from name)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <select className="input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} aria-label="Category">
            <option value="grooming">Grooming</option><option value="care">Care</option><option value="support">Support</option>
          </select>
          <input className="input" type="number" placeholder="Duration (min)" value={draft.duration_minutes} onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })} aria-label="Duration in minutes" />
          <textarea rows={2} className="input sm:col-span-2" placeholder="Short description" value={draft.short_description} onChange={(e) => setDraft({ ...draft, short_description: e.target.value })} />
          <button className="btn-primary w-fit !px-5 !py-2.5 text-sm" onClick={addService}>Create service</button>
        </div>
      )}

      <div className="space-y-4">
        {rows.map((s) => (
          <details key={s.id} className="card group p-0">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-6 py-4 [&::-webkit-details-marker]:hidden">
              <span>
                <strong className="font-display text-lg text-plum">{s.name}</strong>
                <span className="ml-2 rounded-full bg-lilac-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-plum-mid">{s.category}</span>
                {!s.active && <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-700">HIDDEN</span>}
              </span>
              <span className="text-sm text-plum-mid">±{s.duration_minutes} min · {(s.service_prices ?? []).length} price tier{(s.service_prices ?? []).length === 1 ? "" : "s"} <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span></span>
            </summary>
            <div className="space-y-4 border-t border-lilac-100 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-plum" checked={s.active} onChange={(e) => saveService(s.id, { active: e.target.checked })} />
                  Visible on site
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-plum" checked={s.is_addon} onChange={(e) => saveService(s.id, { is_addon: e.target.checked })} />
                  Add-on service
                </label>
                <input className="input" type="number" defaultValue={s.duration_minutes} onBlur={(e) => Number(e.target.value) !== s.duration_minutes && saveService(s.id, { duration_minutes: Number(e.target.value) })} aria-label="Duration minutes" />
              </div>
              <textarea rows={2} className="input" defaultValue={s.short_description} placeholder="Short description (cards)" onBlur={(e) => e.target.value !== s.short_description && saveService(s.id, { short_description: e.target.value })} />
              <textarea rows={3} className="input" defaultValue={s.long_description} placeholder="Long description (services page)" onBlur={(e) => e.target.value !== s.long_description && saveService(s.id, { long_description: e.target.value })} />

              <div>
                <span className="label">Prices</span>
                <div className="space-y-2">
                  {(s.service_prices ?? []).map((p: any) => (
                    <div key={p.id} className="flex flex-wrap items-center gap-2">
                      <select className="input !w-40 !py-2" value={p.size ?? ""} onChange={(e) => savePrice(p.id, { size: e.target.value || null })} aria-label="Size">
                        <option value="">No size (flat)</option>
                        {SIZES.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
                      </select>
                      <input className="input !w-48 !py-2" defaultValue={p.label} placeholder="Label" onBlur={(e) => e.target.value !== p.label && savePrice(p.id, { label: e.target.value })} aria-label="Price label" />
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-inkgrey/60">R</span>
                        <input className="input !w-28 !py-2" type="number" step="0.01" defaultValue={p.price} onBlur={(e) => Number(e.target.value) !== Number(p.price) && savePrice(p.id, { price: Number(e.target.value) })} aria-label="Price" />
                      </div>
                      <button className="text-xs font-semibold text-red-700 hover:underline" onClick={() => removePrice(p.id)}>Remove</button>
                    </div>
                  ))}
                </div>
                <button className="btn-ghost mt-3 !px-4 !py-2 text-xs" onClick={() => addPrice(s.id)}>Add price tier</button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
