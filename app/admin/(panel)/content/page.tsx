"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

const TABS = ["Reviews", "Gallery", "FAQs", "Instagram", "Settings"] as const;

export default function ContentAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Reviews");
  const [reviews, setReviews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [insta, setInsta] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const [r, g, f, i, s] = await Promise.all([
      sb.from("reviews").select("*").order("created_at", { ascending: false }),
      sb.from("gallery_images").select("*").order("sort_order"),
      sb.from("faqs").select("*").order("sort_order"),
      sb.from("instagram_tiles").select("*").order("sort_order"),
      sb.from("settings").select("*").order("key"),
    ]);
    setReviews(r.data ?? []); setGallery(g.data ?? []); setFaqs(f.data ?? []); setInsta(i.data ?? []); setSettings(s.data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function upd(table: string, id: string, patch: any) {
    const { error } = await sb.from(table).update(patch).eq("id", id);
    setMsg(error ? `Error: ${error.message}` : "Saved.");
    if (!error) load();
  }
  async function del(table: string, id: string) {
    await sb.from(table).delete().eq("id", id);
    load();
  }
  async function add(table: string, row: any) {
    const { error } = await sb.from(table).insert(row);
    setMsg(error ? `Error: ${error.message}` : "Added.");
    if (!error) load();
  }
  async function saveSetting(key: string, raw: string) {
    let value: any;
    try { value = JSON.parse(raw); } catch { value = raw; }
    const { error } = await sb.from("settings").update({ value }).eq("key", key);
    setMsg(error ? `Error: ${error.message}` : `Setting "${key}" saved.`);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Site content</h1>
        <p className="mt-1 text-sm text-inkgrey/70">Reviews moderation, gallery, FAQs, Instagram tiles, and site settings.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "bg-plum text-white" : "bg-white text-plum hover:bg-lilac-100"}`}>
            {t}
          </button>
        ))}
      </div>

      {msg && <p className="rounded-2xl bg-lilac-100 px-4 py-2.5 text-sm text-plum">{msg}</p>}

      {tab === "Reviews" && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-64 flex-1">
                <p className="text-sm"><strong className="text-plum">{r.author_name}</strong>{r.dog_name && ` · ${r.dog_name}`} <span className="text-gold">{"★".repeat(r.rating)}</span></p>
                <p className="mt-1 text-sm text-inkgrey/80">&ldquo;{r.content}&rdquo;</p>
              </div>
              <div className="flex gap-2">
                {r.is_approved
                  ? <button className="rounded-full bg-lilac-100 px-4 py-2 text-xs font-semibold text-plum" onClick={() => upd("reviews", r.id, { is_approved: false })}>Unpublish</button>
                  : <button className="btn-primary !px-4 !py-2 text-xs" onClick={() => upd("reviews", r.id, { is_approved: true })}>Approve</button>}
                <button className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700" onClick={() => del("reviews", r.id)}>Delete</button>
              </div>
            </div>
          ))}
          {!reviews.length && <p className="card p-8 text-center text-sm text-inkgrey/60">No reviews yet.</p>}
        </div>
      )}

      {tab === "Gallery" && (
        <div className="space-y-3">
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => add("gallery_images", { title: "New image", category: "groomed", sort_order: gallery.length + 1 })}>Add image</button>
          {gallery.map((g) => (
            <div key={g.id} className="card grid gap-3 p-5 sm:grid-cols-[1fr_1fr_2fr_auto_auto]">
              <input className="input !py-2" defaultValue={g.title} placeholder="Title" onBlur={(e) => e.target.value !== g.title && upd("gallery_images", g.id, { title: e.target.value })} aria-label="Title" />
              <select className="input !py-2" value={g.category} onChange={(e) => upd("gallery_images", g.id, { category: e.target.value })} aria-label="Category">
                {["groomed", "before-after", "parlour", "happy", "branding"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input !py-2" defaultValue={g.image_url} placeholder="Image URL (placeholder shown if empty)" onBlur={(e) => e.target.value !== g.image_url && upd("gallery_images", g.id, { image_url: e.target.value })} aria-label="Image URL" />
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" className="h-4 w-4 accent-plum" checked={g.active} onChange={(e) => upd("gallery_images", g.id, { active: e.target.checked })} />Live</label>
              <button className="text-xs font-semibold text-red-700 hover:underline" onClick={() => del("gallery_images", g.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "FAQs" && (
        <div className="space-y-3">
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => add("faqs", { question: "New question", answer: "Answer…", sort_order: faqs.length + 1 })}>Add FAQ</button>
          {faqs.map((f) => (
            <div key={f.id} className="card space-y-2 p-5">
              <div className="flex items-center justify-between gap-3">
                <input className="input !py-2 font-semibold" defaultValue={f.question} onBlur={(e) => e.target.value !== f.question && upd("faqs", f.id, { question: e.target.value })} aria-label="Question" />
                <label className="flex shrink-0 items-center gap-2 text-xs"><input type="checkbox" className="h-4 w-4 accent-plum" checked={f.active} onChange={(e) => upd("faqs", f.id, { active: e.target.checked })} />Live</label>
                <button className="shrink-0 text-xs font-semibold text-red-700 hover:underline" onClick={() => del("faqs", f.id)}>Delete</button>
              </div>
              <textarea rows={2} className="input" defaultValue={f.answer} onBlur={(e) => e.target.value !== f.answer && upd("faqs", f.id, { answer: e.target.value })} aria-label="Answer" />
            </div>
          ))}
        </div>
      )}

      {tab === "Instagram" && (
        <div className="space-y-3">
          <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => add("instagram_tiles", { caption: "New post", sort_order: insta.length + 1 })}>Add tile</button>
          {insta.map((t) => (
            <div key={t.id} className="card grid gap-3 p-5 sm:grid-cols-[1fr_2fr_2fr_auto_auto]">
              <input className="input !py-2" defaultValue={t.caption} placeholder="Caption" onBlur={(e) => e.target.value !== t.caption && upd("instagram_tiles", t.id, { caption: e.target.value })} aria-label="Caption" />
              <input className="input !py-2" defaultValue={t.image_url} placeholder="Image URL" onBlur={(e) => e.target.value !== t.image_url && upd("instagram_tiles", t.id, { image_url: e.target.value })} aria-label="Image URL" />
              <input className="input !py-2" defaultValue={t.link_url} placeholder="Post link" onBlur={(e) => e.target.value !== t.link_url && upd("instagram_tiles", t.id, { link_url: e.target.value })} aria-label="Post link" />
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" className="h-4 w-4 accent-plum" checked={t.active} onChange={(e) => upd("instagram_tiles", t.id, { active: e.target.checked })} />Live</label>
              <button className="text-xs font-semibold text-red-700 hover:underline" onClick={() => del("instagram_tiles", t.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "Settings" && (
        <div className="space-y-3">
          <p className="text-sm text-inkgrey/70">
            Values are JSON: wrap text in double quotes (e.g. <code className="rounded bg-lilac-100 px-1.5 py-0.5">&quot;27821234567&quot;</code>), numbers are bare (e.g. <code className="rounded bg-lilac-100 px-1.5 py-0.5">10</code>).
          </p>
          {settings.map((s) => (
            <div key={s.key} className="card grid items-center gap-3 p-5 sm:grid-cols-[220px_1fr_auto]">
              <div>
                <p className="text-sm font-semibold text-plum">{s.key}</p>
                <p className="text-[10px] uppercase tracking-wider text-inkgrey/50">{s.is_public ? "Public" : "Private"}</p>
              </div>
              <textarea rows={1} className="input font-mono text-xs" defaultValue={JSON.stringify(s.value)} id={`setting-${s.key}`} aria-label={s.key} />
              <button className="btn-ghost !px-4 !py-2 text-xs" onClick={() => {
                const el = document.getElementById(`setting-${s.key}`) as HTMLTextAreaElement;
                saveSetting(s.key, el.value);
              }}>Save</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
