import { PawIcon } from "@/components/Logo";
import { supabaseServer } from "@/lib/supabase/server";
import ReviewForm from "@/components/ReviewForm";

export const metadata = { title: "Reviews — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function ReviewsPage() {
  const sb = supabaseServer();
  const { data } = await sb.from("reviews").select("*").eq("is_approved", true).order("sort_order");
  return (
    <div className="container-px py-16 sm:py-20">
      <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Reviews</p>
      <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Kind words from kind humans</h1>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((r) => (
          <figure key={r.id} className="card p-7">
            <div className="text-gold" aria-label={`${r.rating} out of 5 stars`}>{"★".repeat(r.rating)}</div>
            <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{r.content}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-plum">
              {r.author_name}{r.dog_name && <span className="font-normal text-inkgrey/70"> · {r.dog_name}&rsquo;s human</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl">Been to see us? Tell the world</h2>
        <p className="mb-6 mt-2 text-sm leading-relaxed">Reviews are checked by our team before they appear on the site.</p>
        <ReviewForm />
      </div>
    </div>
  );
}
