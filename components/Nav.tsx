"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-lilac-100 bg-cream/85 backdrop-blur">
      <div className="container-px flex h-20 items-center justify-between">
        <Link href="/" aria-label="Misty's Pawfect Touch — home"><Logo /></Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-inkgrey hover:text-plum">
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary !px-5 !py-2.5">Book an appointment</Link>
        </nav>
        <button
          className="rounded-full border border-lilac-200 p-2.5 text-plum lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-lilac-100 bg-cream px-5 pb-6 pt-3 lg:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-plum">
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">Book an appointment</Link>
        </nav>
      )}
    </header>
  );
}
