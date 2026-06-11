"use client";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="text-sm text-inkgrey/70 hover:text-plum"
      onClick={async () => { await supabaseBrowser().auth.signOut(); router.push("/admin/login"); router.refresh(); }}
    >
      Sign out
    </button>
  );
}
