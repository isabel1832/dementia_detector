"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"player" | "caregiver">("player");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: accountType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Signup failed. Please try again.");
        return;
      }

      if (accountType === "caregiver") {
        router.push("/caregiver/dashboard");
      } else {
        router.push("/onboarding");
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

        {/* Sign up */}
        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-7 shadow-sm sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl" aria-hidden="true">
                  👋
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 text-lg leading-7 text-[#68736D]">
                  Join Memory & Puzzle to start your activities.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-2xl bg-[#FDF2F2] border border-[#F0B8B8] p-4 text-center font-bold text-[#9C2B2B]">
                  {errorMsg}
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-lg font-semibold"
                  >
                    Your name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="min-h-16 w-full rounded-2xl border-2 border-[#C9D4CC] bg-[#FCFCFA] px-5 text-lg outline-none transition placeholder:text-[#8A938E] focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
                  />
                </div>

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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-lg font-semibold"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="min-h-16 w-full rounded-2xl border-2 border-[#C9D4CC] bg-[#FCFCFA] px-5 text-lg outline-none transition placeholder:text-[#8A938E] focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
                  />
                </div>

                {/* Account type */}
                <div>
                  <label className="mb-3 block text-lg font-semibold">
                    I am a:
                  </label>

                  <div className="space-y-3">
                    <label
                      onClick={() => setAccountType("player")}
                      className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                        accountType === "player"
                          ? "border-[#315C43] bg-[#EDF4EE]"
                          : "border-[#DCE3DD] hover:bg-[#F8FAF8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="player"
                        checked={accountType === "player"}
                        onChange={() => setAccountType("player")}
                        className="h-6 w-6 accent-[#315C43]"
                      />

                      <div>
                        <span className="block text-lg font-bold">
                          Player
                        </span>
                        <span className="text-base text-[#68736D]">
                          I want to play the activities
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setAccountType("caregiver")}
                      className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                        accountType === "caregiver"
                          ? "border-[#315C43] bg-[#EDF4EE]"
                          : "border-[#DCE3DD] hover:bg-[#F8FAF8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="caregiver"
                        checked={accountType === "caregiver"}
                        onChange={() => setAccountType("caregiver")}
                        className="h-6 w-6 accent-[#315C43]"
                      />

                      <div>
                        <span className="block text-lg font-bold">
                          Caregiver
                        </span>
                        <span className="text-base text-[#68736D]">
                          I want to support a player
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Create account button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-16 w-full rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white shadow-sm transition hover:bg-[#274C36] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </button>
              </form>

              {/* Sign in link */}
              <p className="mt-8 text-center text-base text-[#68736D]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#315C43] underline-offset-4 hover:underline"
                >
                  Sign in
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