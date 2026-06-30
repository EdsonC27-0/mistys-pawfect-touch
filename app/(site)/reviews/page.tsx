import { PawIcon } from "@/components/Logo";
import { getReviews } from "@/lib/data";
import ReviewForm from "@/components/ReviewForm";

export const metadata = { title: "Reviews — Misty's Pawfect Touch" };
export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="py-16 sm:py-20">
      <div className="container-px">
        <p className="eyebrow flex items-center gap-2"><PawIcon className="h-3.5 w-3.5 text-gold" /> Reviews</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Kind words from kind humans</h1>
      </div>

      {/* Horizontal scroll strip */}
      <div className="relative mt-10">
        {/* Right fade hint */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-cream to-transparent" />
        <div className="scroll-hide -mx-0 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {reviews.map((r: any) => (
            <figure key={r.id} className="card w-80 shrink-0 snap-start p-7">
              <div className="text-gold text-lg" aria-label={`${r.rating} out of 5 stars`}>{"★".repeat(r.rating)}</div>
              <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{r.content}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-plum">
                {r.author_name}
                {r.dog_name && <span className="font-normal text-inkgrey/70"> · {r.dog_name}&rsquo;s human</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Review form */}
      <div className="container-px mt-16 max-w-2xl">
        <h2 className="text-2xl">Been to see us? Tell the world</h2>
        <p className="mb-6 mt-2 text-sm leading-relaxed">Reviews are checked by our team before they appear on the site.</p>
        <ReviewForm />
      </div>
    </div>
  );
}
