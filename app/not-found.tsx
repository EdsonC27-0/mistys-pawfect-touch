import Link from "next/link";
import { PawIcon } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="site-theme">
      <div className="container-px flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
        <PawIcon className="h-10 w-10 text-gold" />
        <h1 className="mt-4 text-4xl sm:text-5xl">We couldn&rsquo;t find that page</h1>
        <p className="mt-4 max-w-md leading-relaxed">
          The page you&rsquo;re looking for may have moved, or the link might be out of date.
        </p>
        <Link href="/" className="btn-primary mt-8">Back to the home page</Link>
      </div>
    </div>
  );
}
