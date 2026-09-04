"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlayerNavigation from "@/app/components/PlayerNavigation";
import PersistentHelpButton from "@/app/components/PersistentHelpButton";
import { useAccessibility } from "@/app/context/AccessibilityContext";

interface SessionItem {
  id: string;
  game_type: string;
  difficulty: string;
  duration_seconds: number;
  accuracy: number;
  created_at: string;
}

export default function PlayerProgressPage() {
  const { speak } = useAccessibility();
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/sessions");
        if (res.ok) {
          const data = await res.json();
          if (data.analytics) {
            setTotalCompleted(data.analytics.totalCompleted);
            setThisWeekCount(data.analytics.thisWeekCount);
            setRecentSessions(data.analytics.recentSessions || []);
          }
        }
      } catch (err) {
        console.error("Failed to load progress stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  function getGameName(type: string) {
    if (type === "MEMORY_MATCH") return "Memory Match";
    if (type === "PICTURE_RECALL") return "Picture Recall";
    if (type === "SEQUENCE") return "Sequence";
    return type;
  }

  function getGameIcon(type: string) {
    if (type === "MEMORY_MATCH") return "🧠";
    if (type === "PICTURE_RECALL") return "🖼️";
    if (type === "SEQUENCE") return "🔢";
    return "⭐";
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A] pb-24 sm:pb-8">
      <div className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href="/player"
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl" aria-hidden="true">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </Link>

          <Link
            href="/player"
            className="rounded-xl px-5 py-3 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            Back
          </Link>
        </header>

        {/* Page heading */}
        <section className="py-10 sm:py-12">
          <p className="text-lg font-semibold text-[#557461]">
            Your Progress
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Great work so far!
          </h1>

          <p className="mt-4 max-w-2xl text-xl leading-8 text-[#68736D]">
            Every activity you complete is a positive step forward. Keep up the great
            effort!
          </p>
        </section>

        {/* Progress summary cards */}
        <section className="rounded-[2rem] border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl" aria-hidden="true">
                ⭐
              </div>

              <p className="mt-4 text-4xl font-bold text-[#315C43]">
                {isLoading ? "..." : totalCompleted}
              </p>

              <p className="mt-1 text-lg font-semibold text-[#56615B]">
                Activities completed
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl" aria-hidden="true">
                🧠
              </div>

              <p className="mt-4 text-4xl font-bold text-[#315C43]">
                {isLoading ? "..." : thisWeekCount}
              </p>

              <p className="mt-1 text-lg font-semibold text-[#56615B]">
                This week
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl" aria-hidden="true">
                🌱
              </div>

              <p className="mt-4 text-4xl font-bold text-[#315C43]">
                Steady
              </p>

              <p className="mt-1 text-lg font-semibold text-[#56615B]">
                Consistent Pace
              </p>
            </div>
          </div>
        </section>

        {/* Recent activities list */}
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">
            Recent activities
          </h2>

          {recentSessions.length === 0 && !isLoading ? (
            <div className="rounded-2xl border border-[#DCE3DD] bg-white p-8 text-center text-[#68736D]">
              <p className="text-xl">No activities completed yet today.</p>
              <Link
                href="/player"
                className="mt-4 inline-block font-bold text-[#315C43] underline"
              >
                Choose an activity to begin
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#DCE3DD] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-2xl" aria-hidden="true">
                    {getGameIcon(session.game_type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {getGameName(session.game_type)}
                    </h3>

                    <p className="text-base text-[#68736D]">
                      {formatDate(session.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-full bg-[#E5EFE7] px-3 py-1 text-sm font-bold text-[#315C43]">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Encouragement Banner */}
        <section className="mt-10 rounded-[2rem] border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl" aria-hidden="true">
              🌱
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Keep going!
              </h2>

              <p className="mt-1 text-lg leading-7 text-[#56615B]">
                Consistency is more important than perfection. Every activity
                counts toward keeping your mind active.
              </p>
            </div>
          </div>
        </section>

        {/* View all activities */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/player"
            className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
          >
            Back to Today&apos;s Activities
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>

      {/* Navigation and Help */}
      <PlayerNavigation />
      <PersistentHelpButton />
    </main>
  );
}