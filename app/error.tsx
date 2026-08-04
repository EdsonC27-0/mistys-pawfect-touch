"use client";
import { useEffect } from "react";
import { PawIcon } from "@/components/Logo";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="site-theme">
      <div className="container-px flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
        <PawIcon className="h-10 w-10 text-gold" />
        <h1 className="mt-4 text-4xl sm:text-5xl">Something went wrong</h1>
        <p className="mt-4 max-w-md leading-relaxed">
          This is on us, not you — please try again. If it keeps happening, WhatsApp us and we&rsquo;ll sort it out directly.
        </p>
        <button className="btn-primary mt-8" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
