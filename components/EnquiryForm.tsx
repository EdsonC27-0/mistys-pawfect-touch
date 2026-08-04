"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function EnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function submit() {
    if (!form.name.trim() || !form.message.trim()) return;
    if (honeypot) return; // bot filled a field real users never see
    setState("sending");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const { error } = await supabaseBrowser().from("enquiries").insert(form).abortSignal(controller.signal);
      clearTimeout(timer);
      setState(error ? "error" : "done");
    } catch {
      setState("error");
    }
  }
  if (state === "done")
    return <p className="card p-7 text-sm">Thank you — your enquiry is in our inbox. We&rsquo;ll be in touch soon. 🐾</p>;
  return (
    <div className="card space-y-4 p-7">
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        name="website" id="ewebsite"
      />
      <div>
        <label className="label" htmlFor="ename">Your name *</label>
        <input id="ename" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="eemail">Email</label>
          <input id="eemail" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="ephone">Phone</label>
          <input id="ephone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="emsg">How can we help? *</label>
        <textarea id="emsg" rows={5} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      {state === "error" && <p className="text-sm text-red-700">Something went wrong — please try again.</p>}
      <button className="btn-primary" onClick={submit} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </div>
  );
}
