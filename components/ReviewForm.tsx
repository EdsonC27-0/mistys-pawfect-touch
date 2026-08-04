"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ReviewForm() {
  const [form, setForm] = useState({ author_name: "", dog_name: "", rating: 5, content: "" });
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function submit() {
    if (!form.author_name.trim() || !form.content.trim()) return;
    if (honeypot) return; // bot filled a field real users never see
    setState("sending");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const { error } = await supabaseBrowser().from("reviews").insert({ ...form, is_approved: false }).abortSignal(controller.signal);
      clearTimeout(timer);
      setState(error ? "error" : "done");
    } catch {
      setState("error");
    }
  }
  if (state === "done")
    return <p className="card p-7 text-sm">Thank you! Your review has been sent to us and will appear once approved. 🐾</p>;
  return (
    <div className="card space-y-4 p-7">
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        name="website" id="rwebsite"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rname">Your name *</label>
          <input id="rname" className="input" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="rdog">Dog&rsquo;s name</label>
          <input id="rdog" className="input" value={form.dog_name} onChange={(e) => setForm({ ...form, dog_name: e.target.value })} />
        </div>
      </div>
      <div>
        <span className="label">Rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={`text-2xl ${n <= form.rating ? "text-gold" : "text-lilac-200"}`}>★</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="rtext">Your review *</label>
        <textarea id="rtext" rows={4} className="input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      {state === "error" && <p className="text-sm text-red-700">Something went wrong — please try again.</p>}
      <button className="btn-primary" onClick={submit} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Share your review"}
      </button>
    </div>
  );
}
