"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    textSize: "standard",
    contrast: "standard",
    soundEffects: true,
    music: false,
    voiceInstructions: true,
    repeatInstructions: true,
    animation: "reduced",
  });

  const totalSteps = 4;

  function nextStep() {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function updateSetting(key: string, value: string | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#68736D]">
              Step {step} of {totalSteps}
            </span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= step ? "bg-[#315C43]" : "bg-[#DCE3DD]"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <section className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl">
                👋
              </div>

              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome to Memory & Puzzle
              </h1>

              <p className="mt-6 text-xl leading-8 text-[#68736D]">
                We&apos;re glad you&apos;re here. Let&apos;s get you set up so
                the activities are comfortable for you.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-xl">
                    🧩
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold">
                      Simple activities
                    </h3>
                    <p className="mt-1 text-base text-[#68736D]">
                      Short memory games and puzzles you can do at your own pace
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-xl">
                    ❤️
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold">
                      Encouraging experience
                    </h3>
                    <p className="mt-1 text-base text-[#68736D]">
                      No pressure, no rush. Just enjoyable activities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-xl">
                    👨‍👩‍👧
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold">
                      Optional caregiver support
                    </h3>
                    <p className="mt-1 text-base text-[#68736D]">
                      Connect with a family member or caregiver if you&apos;d like
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="mt-10 min-h-16 rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Explain the app */}
        {step === 2 && (
          <section className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl">
                📖
              </div>

              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
                What are these activities for?
              </h1>

              <p className="mt-6 text-xl leading-8 text-[#68736D]">
                These activities are designed to keep your mind active in a fun,
                engaging way.
              </p>

              <div className="mt-10 rounded-[2rem] border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl">
                    ℹ️
                  </div>

                  <div className="text-left">
                    <h2 className="text-2xl font-bold">
                      An activity tool, not a diagnosis
                    </h2>

                    <p className="mt-3 text-lg leading-8 text-[#56615B]">
                      The games in this app are intended to provide engaging
                      activities and track game performance over time. Results
                      from these activities are not a medical diagnosis and
                      should not be used on their own to determine whether someone
                      has dementia or another medical condition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={previousStep}
                  className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="min-h-16 rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Caregiver connection */}
        {step === 3 && (
          <section className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl">
                👨‍👩‍👧
              </div>

              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
                Connect with a caregiver?
              </h1>

              <p className="mt-6 text-xl leading-8 text-[#68736D]">
                You can connect with a family member or caregiver now, or skip
                this and do it later.
              </p>

              <div className="mt-10 space-y-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex min-h-20 w-full items-center gap-4 rounded-2xl border-2 border-[#315C43] bg-[#EDF4EE] px-6 text-left transition hover:bg-[#DCE9DF] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
                    🔗
                  </span>

                  <div>
                    <span className="block text-lg font-bold">
                      Connect a caregiver
                    </span>
                    <span className="text-base text-[#68736D]">
                      Get an access code to share with your caregiver
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex min-h-20 w-full items-center gap-4 rounded-2xl border-2 border-[#DCE3DD] bg-white px-6 text-left transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-2xl">
                    ⏭️
                  </span>

                  <div>
                    <span className="block text-lg font-bold">
                      Skip for now
                    </span>
                    <span className="text-base text-[#68736D]">
                      You can connect a caregiver later in Settings
                    </span>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={previousStep}
                className="mt-10 min-h-16 rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
              >
                Back
              </button>
            </div>
          </section>
        )}

        {/* Step 4: Accessibility preferences */}
        {step === 4 && (
          <section className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="w-full max-w-2xl">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl">
                  ⚙️
                </div>

                <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
                  Make it comfortable for you
                </h1>

                <p className="mt-6 text-xl leading-8 text-[#68736D]">
                  Choose settings that make the activities easy to use. You can
                  change these anytime.
                </p>
              </div>

              <div className="mt-10 space-y-6">
                {/* Text size */}
                <div className="rounded-2xl border border-[#DCE3DD] bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold">Text size</h3>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => updateSetting("textSize", "standard")}
                      className={`min-h-14 rounded-xl border-2 px-4 text-base font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                        settings.textSize === "standard"
                          ? "border-[#315C43] bg-[#EDF4EE]"
                          : "border-[#B9C8BD] hover:bg-[#F1F5F2]"
                      }`}
                    >
                      Standard
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting("textSize", "large")}
                      className={`min-h-14 rounded-xl border-2 px-4 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                        settings.textSize === "large"
                          ? "border-[#315C43] bg-[#EDF4EE]"
                          : "border-[#B9C8BD] hover:bg-[#F1F5F2]"
                      }`}
                    >
                      Large
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting("textSize", "extraLarge")}
                      className={`min-h-14 rounded-xl border-2 px-4 text-xl font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                        settings.textSize === "extraLarge"
                          ? "border-[#315C43] bg-[#EDF4EE]"
                          : "border-[#B9C8BD] hover:bg-[#F1F5F2]"
                      }`}
                    >
                      Extra Large
                    </button>
                  </div>
                </div>

                {/* Sound & Voice */}
                <div className="rounded-2xl border border-[#DCE3DD] bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold">Sound & Voice</h3>

                  <div className="mt-4 space-y-3">
                    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-[#DCE3DD] px-4 hover:bg-[#F8FAF8]">
                      <span className="text-base font-semibold">
                        Sound effects
                      </span>

                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={(e) =>
                          updateSetting("soundEffects", e.target.checked)
                        }
                        className="h-6 w-6 accent-[#315C43]"
                      />
                    </label>

                    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-[#DCE3DD] px-4 hover:bg-[#F8FAF8]">
                      <span className="text-base font-semibold">
                        Voice instructions
                      </span>

                      <input
                        type="checkbox"
                        checked={settings.voiceInstructions}
                        onChange={(e) =>
                          updateSetting("voiceInstructions", e.target.checked)
                        }
                        className="h-6 w-6 accent-[#315C43]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={previousStep}
                  className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  Back
                </button>

                <Link
                  href="/player"
                  className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  Start using the app
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}