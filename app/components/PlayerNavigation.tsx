"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PlayerNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/player" && (pathname === "/player" || pathname === "/home")) return true;
    if (path !== "/player" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav aria-label="Player navigation" className="fixed bottom-0 left-0 right-0 border-t border-[#DCE3DD] bg-white px-6 py-4 sm:static sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-around gap-2 sm:justify-start sm:gap-6">
        <Link
          href="/player"
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-4 text-center transition sm:flex-row sm:gap-2 sm:px-5 ${
            isActive("/player")
              ? "bg-[#EDF4EE] text-[#315C43] font-bold"
              : "text-[#68736D] hover:bg-[#F1F5F2]"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">🏠</span>
          <span className="text-sm font-semibold sm:text-base">Home</span>
        </Link>

        <Link
          href="/player/progress"
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-4 text-center transition sm:flex-row sm:gap-2 sm:px-5 ${
            isActive("/player/progress")
              ? "bg-[#EDF4EE] text-[#315C43] font-bold"
              : "text-[#68736D] hover:bg-[#F1F5F2]"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">⭐</span>
          <span className="text-sm font-semibold sm:text-base">Progress</span>
        </Link>

        <Link
          href="/settings"
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-4 text-center transition sm:flex-row sm:gap-2 sm:px-5 ${
            isActive("/settings")
              ? "bg-[#EDF4EE] text-[#315C43] font-bold"
              : "text-[#68736D] hover:bg-[#F1F5F2]"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">⚙️</span>
          <span className="text-sm font-semibold sm:text-base">Settings</span>
        </Link>
      </div>
    </nav>
  );
}