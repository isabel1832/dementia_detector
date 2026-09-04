"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccessCodePage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Code not recognized. Please check with your caregiver.");
        return;
      }

      router.push("/player");
    } catch {
      setErrorMsg("Unable to connect. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
        {/* Header */}
        <header>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl" aria-hidden="true">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </Link>
        </header>

        {/* Access code form */}
        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-7 shadow-sm sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl" aria-hidden="true">
                  🔑
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Enter your access code
                </h1>

                <p className="mt-3 text-lg leading-7 text-[#68736D]">
                  If your caregiver gave you a code, enter it here to sign in.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-2xl bg-[#FDF2F2] border border-[#F0B8B8] p-4 text-center font-bold text-[#9C2B2B]">
                  {errorMsg}
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Access code input */}
                <div>
                  <label
                    htmlFor="accessCode"
                    className="mb-2 block text-lg font-semibold"
                  >
                    6-digit code
                  </label>

                  <input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                    placeholder="e.g. 482 731"
                    maxLength={8}
                    className="min-h-16 w-full rounded-2xl border-2 border-[#C9D4CC] bg-[#FCFCFA] px-5 text-center text-3xl font-bold tracking-widest outline-none transition placeholder:text-[#8A938E] placeholder:font-normal placeholder:text-lg placeholder:tracking-normal focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
                  />
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={isLoading || accessCode.trim().length === 0}
                  className="min-h-16 w-full rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white shadow-sm transition hover:bg-[#274C36] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  {isLoading ? "Checking code..." : "Sign in with access code"}
                </button>
              </form>

              {/* Regular login */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#DCE3DD]" />
                <span className="text-sm font-semibold text-[#7A847E]">
                  OR
                </span>
                <div className="h-px flex-1 bg-[#DCE3DD]" />
              </div>

              <Link
                href="/login"
                className="flex min-h-16 w-full items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
              >
                Use email and password
              </Link>
            </div>

            {/* Help */}
            <div className="mt-6 text-center">
              <Link
                href="/help"
                className="text-base font-semibold text-[#557461] underline-offset-4 hover:underline"
              >
                Need help finding your code?
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#DCE3DD] pt-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}