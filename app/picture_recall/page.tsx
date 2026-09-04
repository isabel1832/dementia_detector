"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlayerNavigation from "@/app/components/PlayerNavigation";
import PersistentHelpButton from "@/app/components/PersistentHelpButton";
import GameHeader from "@/app/components/GameHeader";
import { PauseModal, ExitConfirmModal, SkipModal } from "@/app/components/GameModals";
import { useAccessibility } from "@/app/context/AccessibilityContext";

type Difficulty = "easy" | "medium" | "hard";

type Picture = {
  id: number;
  emoji: string;
  name: string;
};

const ALL_PICTURES: Picture[] = [
  { id: 1, emoji: "🍎", name: "Apple" },
  { id: 2, emoji: "🌸", name: "Flower" },
  { id: 3, emoji: "🐶", name: "Dog" },
  { id: 4, emoji: "☂️", name: "Umbrella" },
  { id: 5, emoji: "🚲", name: "Bicycle" },
  { id: 6, emoji: "🍪", name: "Cookie" },
  { id: 7, emoji: "⭐", name: "Star" },
  { id: 8, emoji: "🎈", name: "Balloon" },
  { id: 9, emoji: "🏠", name: "House" },
  { id: 10, emoji: "☕", name: "Teacup" },
  { id: 11, emoji: "🐱", name: "Cat" },
  { id: 12, emoji: "🌻", name: "Sunflower" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { rememberCount: number; choicesCount: number }> = {
  easy: { rememberCount: 3, choicesCount: 6 },
  medium: { rememberCount: 4, choicesCount: 8 },
  hard: { rememberCount: 6, choicesCount: 10 },
};

function pickRandom<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function PictureRecallPage() {
  const router = useRouter();
  const { speak, playSound } = useAccessibility();

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<"remember" | "recall" | "complete">("remember");
  const [targetPictures, setTargetPictures] = useState<Picture[]>([]);
  const [choiceOptions, setChoiceOptions] = useState<Picture[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Modals
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  // Initialize pictures on start or difficulty change
  const startNewGame = useCallback((diff: Difficulty) => {
    const config = DIFFICULTY_CONFIG[diff];
    const targets = pickRandom(ALL_PICTURES, config.rememberCount);
    setTargetPictures(targets);

    // Prepare choice options: targets + extra incorrect choices
    const remaining = ALL_PICTURES.filter((p) => !targets.some((t) => t.id === p.id));
    const distractors = pickRandom(remaining, config.choicesCount - config.rememberCount);
    const mixed = [...targets, ...distractors].sort(() => Math.random() - 0.5);

    setChoiceOptions(mixed);
    setSelectedIds([]);
    setSeconds(0);
    setCorrectCount(0);
    setPhase("remember");
    setIsPaused(false);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Voice instruction when entering remember phase
  useEffect(() => {
    if (phase === "remember") {
      speak("Look at these pictures carefully. When you are ready, tap I'm Ready to begin.");
    } else if (phase === "recall") {
      speak("Which pictures did you see? Select the pictures you remember, then check your answers.");
    }
  }, [phase, speak]);

  // Timer
  useEffect(() => {
    if (phase === "complete" || isPaused) return;

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused]);

  function handleReadyClick() {
    playSound("click");
    setPhase("recall");
  }

  function handleToggleChoice(id: number) {
    if (isPaused) return;
    playSound("click");

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleCheckAnswers() {
    playSound("click");

    const targetIds = new Set(targetPictures.map((p) => p.id));
    const correct = selectedIds.filter((id) => targetIds.has(id)).length;
    setCorrectCount(correct);

    playSound("success");
    speak(`Great job! You remembered ${correct} out of ${targetPictures.length} pictures.`);
    setPhase("complete");

    // Save session locally
    try {
      const history = JSON.parse(localStorage.getItem("dementia_sessions") || "[]");
      history.push({
        id: Date.now().toString(),
        gameType: "PICTURE_RECALL",
        difficulty,
        durationSeconds: seconds,
        accuracy: Math.round((correct / targetPictures.length) * 100),
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("dementia_sessions", JSON.stringify(history));
    } catch {
      // ignore
    }
  }

  function handleExitRequest() {
    if (phase === "complete" || (phase === "remember" && seconds < 5)) {
      router.push("/player");
    } else {
      setShowExitConfirm(true);
    }
  }

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const remaining = totalSeconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A] pb-24 sm:pb-8">
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
        <GameHeader
          title="Picture Recall"
          onPause={() => setIsPaused((p) => !p)}
          onExitClick={handleExitRequest}
          onHearInstructions={() => {
            if (phase === "remember") {
              speak("Take your time looking at these pictures. When you are ready, tap I'm Ready.");
            } else {
              speak("Select the pictures you remember seeing, then tap Check My Answers.");
            }
          }}
          isPaused={isPaused}
        />

        {/* Remember Phase */}
        {phase === "remember" && (
          <section className="py-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Picture Recall
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Remember these pictures
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-lg leading-7 text-[#68736D]">
                Take all the time you need. When you feel ready, tap below.
              </p>

              {/* Difficulty selector */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#DCE3DD] bg-white p-1.5 shadow-sm">
                <span className="px-3 text-sm font-semibold text-[#68736D]">Difficulty:</span>
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      playSound("click");
                      setDifficulty(level);
                    }}
                    className={`rounded-xl px-4 py-2 text-base capitalize font-bold transition ${
                      difficulty === level
                        ? "bg-[#315C43] text-white shadow-xs"
                        : "text-[#68736D] hover:bg-[#F1F5F2]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Pictures Display */}
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 sm:grid-cols-3 gap-5">
              {targetPictures.map((picture) => (
                <div
                  key={picture.id}
                  className="flex aspect-square flex-col items-center justify-center rounded-3xl border-2 border-[#DCE3DD] bg-white p-4 shadow-sm"
                >
                  <span className="text-6xl sm:text-7xl" aria-hidden="true">
                    {picture.emoji}
                  </span>
                  <span className="mt-3 text-xl font-bold text-[#24302A]">
                    {picture.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Ready Button */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleReadyClick}
                className="min-h-16 rounded-2xl bg-[#315C43] px-12 text-xl font-bold text-white shadow-sm transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                I&apos;m Ready
              </button>

              <button
                type="button"
                onClick={() => setShowSkipModal(true)}
                className="text-base font-semibold text-[#68736D] underline hover:text-[#24302A]"
              >
                Skip this activity
              </button>
            </div>
          </section>
        )}

        {/* Recall Phase */}
        {phase === "recall" && (
          <section className="py-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Picture Recall
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Which pictures did you see?
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-lg leading-7 text-[#68736D]">
                Select the {targetPictures.length} pictures you remember.
              </p>
            </div>

            {/* Options Grid */}
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 sm:grid-cols-4 gap-4">
              {choiceOptions.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleChoice(item.id)}
                    aria-pressed={isSelected}
                    className={`flex aspect-square flex-col items-center justify-center rounded-3xl border-4 p-3 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#B8CEBD] ${
                      isSelected
                        ? "border-[#315C43] bg-[#EDF4EE] scale-102"
                        : "border-[#DCE3DD] bg-white hover:bg-[#F1F5F2]"
                    }`}
                  >
                    <span className="text-5xl sm:text-6xl" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span className="mt-2 text-base sm:text-lg font-bold">
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="mt-1 rounded-full bg-[#315C43] px-2 py-0.5 text-xs font-bold text-white">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Check Answers Button */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleCheckAnswers}
                disabled={selectedIds.length === 0}
                className="min-h-16 rounded-2xl bg-[#315C43] px-10 text-xl font-bold text-white shadow-sm transition hover:bg-[#274C36] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Check My Answers ({selectedIds.length} chosen)
              </button>

              <button
                type="button"
                onClick={() => setShowSkipModal(true)}
                className="text-base font-semibold text-[#68736D] underline hover:text-[#24302A]"
              >
                Skip this activity
              </button>
            </div>
          </section>
        )}

        {/* Completion Phase */}
        {phase === "complete" && (
          <section className="flex min-h-[70vh] items-center justify-center py-10">
            <div className="w-full max-w-xl rounded-[2rem] border-2 border-[#D6E0D8] bg-white p-8 text-center shadow-md sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl" aria-hidden="true">
                🎉
              </div>

              <p className="mt-6 text-lg font-semibold text-[#557461]">
                Great effort!
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                You completed Picture Recall.
              </h1>

              <p className="mt-4 text-xl leading-8 text-[#68736D]">
                You remembered {correctCount} out of {targetPictures.length} pictures. Every session is great practice.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Remembered</p>
                  <p className="mt-1 text-2xl font-bold text-[#315C43]">
                    {correctCount} / {targetPictures.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Time</p>
                  <p className="mt-1 text-2xl font-bold">{formatTime(seconds)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => startNewGame(difficulty)}
                  className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  Play Again
                </button>

                <Link
                  href="/player"
                  className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  Back to Activities
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onExit={() => router.push("/player")}
      />

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onContinue={() => setShowExitConfirm(false)}
        onConfirmExit={() => router.push("/player")}
      />

      <SkipModal
        isOpen={showSkipModal}
        onStay={() => setShowSkipModal(false)}
        onSkip={() => router.push("/player")}
      />

      <PlayerNavigation />
      <PersistentHelpButton />
    </main>
  );
}