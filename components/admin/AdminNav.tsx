"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import SignOutButton from "./SignOutButton";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar & hours" },
  { href: "/admin/customers", label: "Customers & dogs" },
  { href: "/admin/services", label: "Services & pricing" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminNav() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="border-b border-lilac-200 bg-white lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between p-5">
        <Link href="/" className="block"><Logo /></Link>
        <button
          className="rounded-full border border-lilac-200 p-2 text-plum lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle admin menu"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} border-t border-lilac-100 px-5 pb-5 lg:block`}>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Admin">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-inkgrey hover:bg-lilac-50 hover:text-plum">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 border-t border-lilac-100 pt-4">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
