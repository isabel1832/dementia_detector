"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlayerNavigation from "@/app/components/PlayerNavigation";
import PersistentHelpButton from "@/app/components/PersistentHelpButton";
import GameHeader from "@/app/components/GameHeader";
import { PauseModal, ExitConfirmModal, SkipModal } from "@/app/components/GameModals";
import { useAccessibility } from "@/app/context/AccessibilityContext";

type Difficulty = "easy" | "medium" | "hard";

const SHAPES = [
  { symbol: "●", name: "Circle", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { symbol: "■", name: "Square", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { symbol: "▲", name: "Triangle", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { symbol: "◆", name: "Diamond", color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { length: number }> = {
  easy: { length: 3 },
  medium: { length: 4 },
  hard: { length: 6 },
};

export default function SequencePage() {
  const router = useRouter();
  const { speak, playSound } = useAccessibility();

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"watch" | "play" | "complete">("watch");
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  // Modals
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const targetLength = DIFFICULTY_CONFIG[difficulty].length;
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

  const playSequencePlayback = useCallback(
    (seq: number[]) => {
      clearAllTimeouts();
      setPhase("watch");
      setActiveHighlightIndex(null);

      seq.forEach((shapeIdx, step) => {
        // Highlight on
        const tOn = setTimeout(() => {
          setActiveHighlightIndex(shapeIdx);
          playSound("click");
        }, 1000 + step * 900);

        // Highlight off
        const tOff = setTimeout(() => {
          setActiveHighlightIndex(null);
        }, 1000 + step * 900 + 600);

        timeoutRefs.current.push(tOn, tOff);
      });

      // Finish watch phase
      const tEnd = setTimeout(() => {
        setPhase("play");
        speak("Now tap the shapes in the same order.");
      }, 1000 + seq.length * 900 + 400);

      timeoutRefs.current.push(tEnd);
    },
    [clearAllTimeouts, playSound, speak]
  );

  const startNewGame = useCallback(
    (diff: Difficulty) => {
      clearAllTimeouts();
      const len = DIFFICULTY_CONFIG[diff].length;
      const newSeq = Array.from({ length: len }, () =>
        Math.floor(Math.random() * SHAPES.length)
      );

      setSequence(newSeq);
      setPlayerInput([]);
      setAttempts(0);
      setFeedbackNotice(null);
      setSeconds(0);
      setIsPaused(false);

      speak("Watch the sequence of shapes carefully.");
      playSequencePlayback(newSeq);
    },
    [clearAllTimeouts, playSequencePlayback, speak]
  );

  useEffect(() => {
    startNewGame(difficulty);
    return () => clearAllTimeouts();
  }, [difficulty, startNewGame, clearAllTimeouts]);

  // Timer
  useEffect(() => {
    if (phase === "complete" || isPaused) return;

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused]);

  function handleShapeTap(shapeIdx: number) {
    if (phase !== "play" || isPaused) return;

    playSound("click");
    const nextInput = [...playerInput, shapeIdx];
    setPlayerInput(nextInput);

    const currentStep = nextInput.length - 1;

    // Check if tapped shape is correct
    if (shapeIdx !== sequence[currentStep]) {
      // Gentle mistake handling per UI/UX spec
      playSound("gentle-error");
      setAttempts((a) => a + 1);
      setFeedbackNotice("Not quite. Let's watch the sequence again together.");
      speak("Not quite. Let's watch the sequence again.");
      setPlayerInput([]);

      const tRetry = setTimeout(() => {
        setFeedbackNotice(null);
        playSequencePlayback(sequence);
      }, 1500);
      timeoutRefs.current.push(tRetry);
      return;
    }

    // Correct tap!
    playSound("match");

    // Check if entire sequence is finished
    if (nextInput.length === sequence.length) {
      playSound("success");
      setPhase("complete");
      speak("Great job! You reproduced the complete sequence.");

      try {
        const accuracy = Math.round((sequence.length / (sequence.length + attempts)) * 100);
        const history = JSON.parse(localStorage.getItem("dementia_sessions") || "[]");
        history.push({
          id: Date.now().toString(),
          gameType: "SEQUENCE",
          difficulty,
          durationSeconds: seconds,
          attempts: attempts + 1,
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("dementia_sessions", JSON.stringify(history));

        // Persist to backend / Supabase
        const activePlayerId = localStorage.getItem("active_player_id") || undefined;
        fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: activePlayerId,
            gameType: "SEQUENCE",
            difficulty,
            durationSeconds: seconds,
            score: Math.max(0, 100 - attempts * 5),
            accuracy,
            attempts: attempts + 1,
            status: "COMPLETED",
          }),
        }).catch((err) => console.warn("Session save warning:", err));
      } catch {
        // ignore
      }
    }
  }

  function handleExitRequest() {
    if (phase === "complete" || (attempts === 0 && seconds < 5)) {
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
          title="Sequence"
          onPause={() => {
            if (!isPaused) {
              clearAllTimeouts();
              setIsPaused(true);
            } else {
              setIsPaused(false);
              playSequencePlayback(sequence);
            }
          }}
          onExitClick={handleExitRequest}
          onHearInstructions={() => {
            if (phase === "watch") {
              speak("Watch the sequence of shapes. When it finishes, repeat the shapes in the same order.");
            } else {
              speak("Tap each shape in the order that was shown.");
            }
          }}
          isPaused={isPaused}
        />

        {phase !== "complete" ? (
          <>
            {/* Title & Instructions */}
            <section className="py-6 text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Sequence
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                {phase === "watch" ? "Watch carefully" : "Your turn: Repeat the sequence"}
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-lg leading-7 text-[#68736D]">
                {phase === "watch"
                  ? "Observe the sequence as each shape lights up."
                  : `Tap the shapes in order (${playerInput.length} of ${sequence.length} entered).`}
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
            </section>

            {/* Gentle feedback banner if user made a mistake */}
            {feedbackNotice && (
              <div className="mx-auto mb-6 max-w-md rounded-2xl bg-[#E8F1EA] border-2 border-[#315C43] p-4 text-center font-bold text-[#1F3D2C] text-lg animate-in fade-in">
                {feedbackNotice}
              </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-3 sm:p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">Length</p>
                <p className="mt-0.5 text-2xl font-bold text-[#315C43]">{targetLength}</p>
              </div>

              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-3 sm:p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">Attempts</p>
                <p className="mt-0.5 text-2xl font-bold">{attempts}</p>
              </div>

              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-3 sm:p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">Time</p>
                <p className="mt-0.5 text-2xl font-bold">{formatTime(seconds)}</p>
              </div>
            </div>

            {/* Shape Buttons Grid */}
            <section
              aria-label="Sequence shapes"
              className="mx-auto max-w-lg grid grid-cols-2 sm:grid-cols-4 gap-5"
            >
              {SHAPES.map((shape, idx) => {
                const isLit = activeHighlightIndex === idx;
                const canTap = phase === "play" && !isPaused && !feedbackNotice;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleShapeTap(idx)}
                    disabled={!canTap}
                    aria-label={`Shape ${shape.name}`}
                    className={`aspect-square min-h-32 sm:min-h-36 rounded-3xl border-4 text-6xl sm:text-7xl shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#B8CEBD] ${
                      isLit
                        ? "border-[#315C43] bg-[#315C43] text-white scale-110 shadow-lg"
                        : canTap
                        ? "border-[#B9C8BD] bg-white text-[#315C43] hover:-translate-y-1 hover:bg-[#F1F5F2]"
                        : "border-[#DCE3DD] bg-[#F7F5EF] text-[#8A958F] cursor-default opacity-80"
                    }`}
                  >
                    <span aria-hidden="true">{shape.symbol}</span>
                  </button>
                );
              })}
            </section>

            {/* Action Bar */}
            <div className="mt-10 flex items-center justify-between">
              {phase === "play" && (
                <button
                  type="button"
                  onClick={() => playSequencePlayback(sequence)}
                  className="flex min-h-14 items-center gap-2 rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-base font-bold text-[#315C43] hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  <span>👁️</span>
                  <span>Watch Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSkipModal(true)}
                className="ml-auto text-base font-semibold text-[#68736D] underline hover:text-[#24302A]"
              >
                Skip this activity
              </button>
            </div>
          </>
        ) : (
          /* Completion Screen */
          <section className="flex min-h-[70vh] items-center justify-center py-10">
            <div className="w-full max-w-xl rounded-[2rem] border-2 border-[#D6E0D8] bg-white p-8 text-center shadow-md sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl" aria-hidden="true">
                🎉
              </div>

              <p className="mt-6 text-lg font-semibold text-[#557461]">
                Splendid effort!
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                You completed the sequence!
              </h1>

              <p className="mt-4 text-xl leading-8 text-[#68736D]">
                You remembered the sequence of {targetLength} shapes. Keep up the great practice!
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Sequence Length</p>
                  <p className="mt-1 text-2xl font-bold text-[#315C43]">{targetLength}</p>
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
        onResume={() => {
          setIsPaused(false);
          playSequencePlayback(sequence);
        }}
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