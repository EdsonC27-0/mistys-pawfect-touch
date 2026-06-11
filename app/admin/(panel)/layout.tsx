import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar & hours" },
  { href: "/admin/customers", label: "Customers & dogs" },
  { href: "/admin/services", label: "Services & pricing" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-lilac-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-lilac-200 bg-white p-5 lg:border-b-0 lg:border-r">
        <Link href="/" className="block"><Logo /></Link>
        <nav className="mt-6 flex flex-wrap gap-1 lg:flex-col" aria-label="Admin">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-inkgrey hover:bg-lilac-50 hover:text-plum">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-lilac-100 pt-4">
          <SignOutButton />
        </div>
      </aside>
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
