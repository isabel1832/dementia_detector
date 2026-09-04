"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/context/AccessibilityContext";

interface CurrentUser {
  id: string;
  name: string;
  role: "player" | "caregiver" | "professional";
}

export default function HelpPage() {
  const { speak } = useAccessibility();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.ok ? await res.json() : null;
        setUser(data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkUser();
  }, []);

  const backPath = user?.role === "caregiver" || user?.role === "professional" 
    ? "/caregiver/dashboard" 
    : "/player";

  const backText = user?.role === "caregiver" || user?.role === "professional"
    ? "Back to Dashboard"
    : "Back";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
        <div className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-[#68736D]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href={backPath}
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </Link>

          <Link
            href={backPath}
            className="rounded-xl px-5 py-3 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            {backText}
          </Link>
        </header>

        {/* Heading */}
        <section className="py-10 sm:py-12">
          <p className="text-lg font-semibold text-[#557461]">
            Help & Support
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            How can we help?
          </h1>

          <p className="mt-4 max-w-2xl text-xl leading-8 text-[#68736D]">
            {user?.role === "caregiver" || user?.role === "professional"
              ? "Find answers about managing players, viewing reports, and using the caregiver dashboard."
              : "Find answers, replay instructions, or get help from someone you trust."}
          </p>
        </section>

        {/* Quick Help */}
        <section>
          <h2 className="mb-5 text-2xl font-bold">
            Quick help
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {user?.role === "caregiver" || user?.role === "professional" ? (
              <>
                {/* Caregiver-specific help options */}
                <Link
                  href="/caregiver/players"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    👥
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Manage players
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Connect to players or create new player profiles.
                    </span>
                  </span>
                </Link>

                <Link
                  href="/caregiver/reports"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    📄
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      View reports
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Generate and view player activity reports.
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    🛠️
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Technical support
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Get help if something is not working correctly.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    ⚠️
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Report a problem
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Tell us if you find a technical problem.
                    </span>
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Player-specific help options */}
                <button
                  type="button"
                  onClick={() =>
                    speak(
                      "Here are the instructions. Choose an activity from your home screen. In Memory Match, turn over two cards at a time to find matching pairs. In Picture Recall, remember the pictures shown to you. In Sequence, tap the shapes in the same order. Take all the time you need and enjoy yourself."
                    )
                  }
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    🔊
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Replay instructions
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Listen to the instructions for an activity again.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    👨‍👩‍👧
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Contact my caregiver
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Ask your caregiver for help.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    🛠️
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Technical support
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Get help if something is not working correctly.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex min-h-28 items-center gap-5 rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-6 text-left shadow-sm transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                    ⚠️
                  </span>

                  <span>
                    <span className="block text-xl font-bold">
                      Report a problem
                    </span>

                    <span className="mt-1 block text-base text-[#68736D]">
                      Tell us if you find a technical problem.
                    </span>
                  </span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {user?.role === "caregiver" || user?.role === "professional" ? (
              <>
                {/* Caregiver-specific FAQs */}
                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>How do I connect to a player?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Go to the Players page and either enter the player&apos;s 6-digit access code to connect to an existing player, or create a new player profile and generate an access code for them.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>How do I view player activity?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    After connecting to a player, go to the Dashboard and select the player from the dropdown to view their activity overview, game performance, and recent sessions.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>Can I export player data?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Yes. You can export session data as a CSV file from the Dashboard, or generate PDF reports from the Reports page.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>What do the scores mean?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Scores describe activity performance over time. They are observational information and are not a medical diagnosis of dementia or any other condition.
                  </div>
                </details>
              </>
            ) : (
              <>
                {/* Player-specific FAQs */}
                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>How do I start an activity?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Go to Today&apos;s Activities and choose the activity you
                    would like to play. Select Start Activity and follow the
                    instructions on the screen.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>Can I hear the instructions?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Yes. Voice instructions can be turned on in Settings. You can
                    also replay instructions when they are available.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>How do the scores work?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    Scores describe how you performed during an activity. They are
                    intended to help track activity over time and are not a
                    medical diagnosis.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>What if I make a mistake?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    That is completely okay. The activities are designed to be
                    encouraging. Take your time and do your best.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#DCE3DD] bg-white shadow-sm">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-6 text-lg font-bold">
                    <span>Can my caregiver see my activity?</span>

                    <span className="text-2xl text-[#557461] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-[#DCE3DD] px-6 py-5 text-lg leading-8 text-[#68736D]">
                    If you have connected a caregiver and given them permission,
                    they may be able to review your activity and performance
                    information.
                  </div>
                </details>
              </>
            )}
          </div>
        </section>

        {/* Important reminder */}
        <section className="mt-12 rounded-[2rem] border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl">
              💚
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Remember
              </h2>

              <p className="mt-2 text-lg leading-8 text-[#56615B]">
                {user?.role === "caregiver" || user?.role === "professional"
                  ? "The activity information you see is observational and not a medical diagnosis. Always consult healthcare professionals for medical concerns."
                  : "These activities are meant to be enjoyable and engaging. Making mistakes is okay, and you never need to rush."}
              </p>
            </div>
          </div>
        </section>

        {/* Back home */}
        <div className="mt-10 flex justify-center">
          <Link
            href={backPath}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
          >
            {user?.role === "caregiver" || user?.role === "professional"
              ? "Back to Dashboard"
              : "Back to Today's Activities"}
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}