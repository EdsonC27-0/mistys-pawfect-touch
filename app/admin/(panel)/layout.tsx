import { requireAdmin } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-lilac-50 lg:grid lg:grid-cols-[260px_1fr]">
      <AdminNav />
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
