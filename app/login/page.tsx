"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Sign in failed. Please check your details.");
        return;
      }

      // Route according to user role
      if (data.user.role === "caregiver") {
        router.push("/caregiver/dashboard");
      } else if (data.user.role === "professional") {
        router.push("/professional/dashboard");
      } else {
        router.push("/player");
      }
    } catch {
      setErrorMsg("An unexpected network error occurred. Please try again.");
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

        {/* Login form */}
        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-7 shadow-sm sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl" aria-hidden="true">
                  👋
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 text-lg leading-7 text-[#68736D]">
                  Sign in to continue to your activities or caregiver dashboard.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-2xl bg-[#FDF2F2] border border-[#F0B8B8] p-4 text-center font-bold text-[#9C2B2B]">
                  {errorMsg}
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-lg font-semibold"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="min-h-16 w-full rounded-2xl border-2 border-[#C9D4CC] bg-[#FCFCFA] px-5 text-lg outline-none transition placeholder:text-[#8A938E] focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="block text-lg font-semibold"
                    >
                      Password
                    </label>

                    <Link
                      href="/help"
                      className="text-base font-semibold text-[#315C43] underline-offset-4 hover:underline"
                    >
                      Need help?
                    </Link>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="min-h-16 w-full rounded-2xl border-2 border-[#C9D4CC] bg-[#FCFCFA] px-5 text-lg outline-none transition placeholder:text-[#8A938E] focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
                  />
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-16 w-full rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white shadow-sm transition hover:bg-[#274C36] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Access code divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#DCE3DD]" />
                <span className="text-sm font-semibold text-[#7A847E]">
                  OR
                </span>
                <div className="h-px flex-1 bg-[#DCE3DD]" />
              </div>

              <Link
                href="/access-code"
                className="flex min-h-16 w-full items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
              >
                Use a 6-digit access code
              </Link>

              {/* Create account */}
              <p className="mt-8 text-center text-base text-[#68736D]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[#315C43] underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
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