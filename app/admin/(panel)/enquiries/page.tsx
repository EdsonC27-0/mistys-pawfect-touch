"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function EnquiriesAdmin() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<any[]>([]);
  const [show, setShow] = useState<"new" | "all">("new");

  async function load() {
    const { data } = await sb.from("enquiries").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = rows.filter((r) => (show === "new" ? r.status === "new" : true));

  async function setStatus(id: string, status: string) {
    await sb.from("enquiries").update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Enquiries</h1>
          <p className="mt-1 text-sm text-inkgrey/70">Messages from the contact form.</p>
        </div>
        <select className="input !w-auto" value={show} onChange={(e) => setShow(e.target.value as any)} aria-label="Filter">
          <option value="new">New only</option>
          <option value="all">All</option>
        </select>
      </header>
      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="min-w-64 flex-1">
              <p className="text-sm">
                <strong className="text-plum">{e.name}</strong>
                <span className="text-inkgrey/60"> · {e.email || "no email"} · {e.phone || "no phone"} · {new Date(e.created_at).toLocaleString("en-ZA")}</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{e.message}</p>
            </div>
            <div className="flex gap-2">
              {e.email && <a className="btn-ghost !px-4 !py-2 text-xs" href={`mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry — Misty's Pawfect Touch")}`}>Reply</a>}
              {e.status === "new"
                ? <button className="btn-primary !px-4 !py-2 text-xs" onClick={() => setStatus(e.id, "handled")}>Mark handled</button>
                : <button className="rounded-full bg-lilac-100 px-4 py-2 text-xs font-semibold text-plum" onClick={() => setStatus(e.id, "new")}>Reopen</button>}
            </div>
          </div>
        ))}
        {!filtered.length && <p className="card p-8 text-center text-sm text-inkgrey/60">No enquiries here.</p>}
      </div>
    </div>
  );
}
