"use client";

import Link from "next/link";
import { useState } from "react";
import PlayerNavigation from "@/app/components/PlayerNavigation";
import PersistentHelpButton from "@/app/components/PersistentHelpButton";
import { useAccessibility } from "@/app/context/AccessibilityContext";

export default function PlayerSettingsPage() {
  const { settings, updateSetting, resetSettings, speak } = useAccessibility();
  const [savedNotification, setSavedNotification] = useState(false);

  function handleSave() {
    setSavedNotification(true);
    speak("Settings saved successfully.");
    setTimeout(() => setSavedNotification(false), 3000);
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
            Settings
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Make the app comfortable for you
          </h1>

          <p className="mt-4 max-w-2xl text-xl leading-8 text-[#68736D]">
            Change these settings at any time. Choose the options that make
            the activities easiest and most comfortable for you.
          </p>
        </section>

        {savedNotification && (
          <div className="mb-6 rounded-2xl bg-[#DCE9DF] border-2 border-[#315C43] p-4 text-center font-bold text-[#1F3D2C] text-lg animate-pulse">
            ✓ Your preferences have been updated!
          </div>
        )}

        <div className="space-y-6">
          {/* Text size */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl font-bold" aria-hidden="true">
                Aa
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Text size
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose a text size that is easy for you to read.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateSetting("textSize", "standard")}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.textSize === "standard"
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    Standard
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("textSize", "large")}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-xl font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.textSize === "large"
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    Large
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("textSize", "extraLarge")}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-2xl font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.textSize === "extraLarge"
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    Extra Large
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Contrast */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl" aria-hidden="true">
                ◐
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Contrast
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Increase contrast to make text and borders sharper to see.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updateSetting("contrast", "standard")}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.contrast === "standard"
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    Standard contrast
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("contrast", "high")}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.contrast === "high"
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    High contrast
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sound & Voice */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl" aria-hidden="true">
                🔊
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Sound & Voice
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose how you would like to hear sounds and instructions.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                    <div>
                      <span className="block text-lg font-bold">
                        Sound effects
                      </span>
                      <span className="text-base text-[#68736D]">
                        Play gentle chimes during activities
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => updateSetting("soundEffects", e.target.checked)}
                      className="h-7 w-7 accent-[#315C43]"
                    />
                  </label>

                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                    <div>
                      <span className="block text-lg font-bold">
                        Voice instructions
                      </span>
                      <span className="text-base text-[#68736D]">
                        Read activity instructions aloud
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.voiceInstructions}
                      onChange={(e) => updateSetting("voiceInstructions", e.target.checked)}
                      className="h-7 w-7 accent-[#315C43]"
                    />
                  </label>

                  {/* Voice Speed */}
                  {settings.voiceInstructions && (
                    <div className="rounded-2xl border border-[#DCE3DD] p-4 bg-[#F7F5EF]">
                      <span className="block text-base font-bold mb-2">Voice reading speed:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["slow", "normal", "fast"] as const).map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => updateSetting("voiceSpeed", speed)}
                            className={`min-h-12 rounded-xl border capitalize font-semibold ${
                              settings.voiceSpeed === speed
                                ? "border-[#315C43] bg-[#315C43] text-white"
                                : "border-[#B9C8BD] bg-white text-[#24302A]"
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Animation */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl" aria-hidden="true">
                ✨
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Animation & Movement
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Reduce movement if you prefer a still, non-moving screen.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updateSetting("reducedMotion", false)}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      !settings.reducedMotion
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    Gentle animation
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("reducedMotion", true)}
                    className={`min-h-16 rounded-2xl border-2 px-5 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#D5E2D8] ${
                      settings.reducedMotion
                        ? "border-[#315C43] bg-[#EDF4EE] text-[#315C43] font-bold"
                        : "border-[#B9C8BD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    No animation (Reduced motion)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-between items-center">
            <button
              type="button"
              onClick={resetSettings}
              className="text-base font-semibold text-[#68736D] underline hover:text-[#24302A]"
            >
              Reset to defaults
            </button>

            <div className="flex gap-4">
              <Link
                href="/player"
                className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
              >
                Done
              </Link>

              <button
                type="button"
                onClick={handleSave}
                className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>

      {/* Navigation and Help */}
      <PlayerNavigation />
      <PersistentHelpButton />
    </main>
  );
}