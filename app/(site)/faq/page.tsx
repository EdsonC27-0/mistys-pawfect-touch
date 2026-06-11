import { PawIcon } from "@/components/Logo";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "FAQ — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function FaqPage() {
  const sb = supabaseServer();
  const { data } = await sb.from("faqs").select("*").eq("active", true).order("sort_order");
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Frequently asked</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Everything you might be wondering</h1>
      <div className="mt-12 max-w-3xl space-y-4">
        {(data ?? []).map((f) => (
          <details key={f.id} className="card group p-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 font-display text-lg text-plum [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="text-plum-mid transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="px-7 pb-6 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
