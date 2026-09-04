"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CaregiverNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Dashboard", href: "/caregiver/dashboard", icon: "📊" },
    { name: "Players", href: "/caregiver/players", icon: "👥" },
    { name: "Reports", href: "/caregiver/reports", icon: "📄" },
    { name: "Help", href: "/help", icon: "❓" },
  ];

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("dementia_auth_user");
      localStorage.removeItem("active_caregiver_id");
      localStorage.removeItem("active_player_id");
    } catch {
      // ignore
    }
    router.push("/");
  }

  return (
    <nav aria-label="Caregiver navigation" className="bg-white border-b border-[#DCE3DD] sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/caregiver/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCE9DF] text-xl" aria-hidden="true">
                🧠
              </div>
              <span className="text-xl font-bold tracking-tight text-[#24302A]">
                Memory & Puzzle <span className="text-sm font-normal text-[#557461] ml-1">Caregiver Portal</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold transition ${
                    isActive
                      ? "bg-[#EDF4EE] text-[#315C43]"
                      : "text-[#68736D] hover:bg-[#F1F5F2] hover:text-[#24302A]"
                  }`}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Sign out */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[#68736D] hover:bg-[#F1F5F2] hover:text-[#24302A]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="flex sm:hidden justify-around border-t border-[#DCE3DD] py-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-semibold ${
                isActive ? "text-[#315C43]" : "text-[#68736D]"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
