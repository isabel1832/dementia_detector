import Link from "next/link";

export default function PersistentHelpButton() {
  return (
    <Link
      href="/help"
      className="fixed bottom-24 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#315C43] text-3xl shadow-lg transition hover:bg-[#274C36] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#B8CEBD] sm:bottom-6 sm:right-6"
      aria-label="Get help"
    >
      ❓
    </Link>
  );
}