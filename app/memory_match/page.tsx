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

type Card = {
  id: number;
  value: string;
  matched: boolean;
};

const ALL_CARD_SYMBOLS = ["🌳", "🐶", "🌸", "⭐", "🍎", "🎈", "☀️", "🦋"];

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: string }> = {
  easy: { pairs: 2, cols: "grid-cols-2 max-w-md" },
  medium: { pairs: 4, cols: "grid-cols-2 sm:grid-cols-4 max-w-2xl" },
  hard: { pairs: 6, cols: "grid-cols-3 sm:grid-cols-4 max-w-3xl" },
};

function generateCards(difficulty: Difficulty): Card[] {
  const numPairs = DIFFICULTY_CONFIG[difficulty].pairs;
  const chosenSymbols = ALL_CARD_SYMBOLS.slice(0, numPairs);
  const cardValues = [...chosenSymbols, ...chosenSymbols];

  // Fisher-Yates shuffle
  const shuffled = [...cardValues];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((value, index) => ({
    id: index,
    value,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const router = useRouter();
  const { speak, playSound } = useAccessibility();

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<Card[]>(() => generateCards("medium"));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isShowingHint, setIsShowingHint] = useState(false);

  // Modals
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;

  // Speak instructions on mount
  useEffect(() => {
    speak("Welcome to Memory Match. Find the matching pairs. Turn over two cards at a time.");
  }, [speak]);

  // Timer
  useEffect(() => {
    if (isComplete || isPaused) return;

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, isPaused]);

  // Check matching cards
  useEffect(() => {
    if (flipped.length !== 2) return;

    setIsChecking(true);
    setAttempts((current) => current + 1);

    const firstCard = cards[flipped[0]];
    const secondCard = cards[flipped[1]];

    const timer = setTimeout(() => {
      if (firstCard.value === secondCard.value) {
        playSound("match");
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, matched: true }
              : card
          )
        );
        setMatches((current) => current + 1);
      } else {
        playSound("gentle-error");
      }

      setFlipped([]);
      setIsChecking(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [flipped, cards, playSound]);

  // Check for game completion
  useEffect(() => {
    if (matches > 0 && matches === totalPairs) {
      setIsComplete(true);
      playSound("success");
      speak("Great job! You found all of the matching pairs.");

      // Save to local storage session history for immediate feedback
      try {
        const history = JSON.parse(localStorage.getItem("dementia_sessions") || "[]");
        history.push({
          id: Date.now().toString(),
          gameType: "MEMORY_MATCH",
          difficulty,
          durationSeconds: seconds,
          attempts,
          hintsUsed,
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("dementia_sessions", JSON.stringify(history));
      } catch {
        // ignore
      }
    }
  }, [matches, totalPairs, playSound, speak, difficulty, seconds, attempts, hintsUsed]);

  function handleCardClick(index: number) {
    if (isChecking || isShowingHint || isPaused) return;
    if (flipped.includes(index) || cards[index].matched) return;
    if (flipped.length === 2) return;

    playSound("click");
    setFlipped((current) => [...current, index]);
  }

  function handleHint() {
    if (isShowingHint || isChecking || isComplete) return;

    playSound("click");
    setHintsUsed((current) => current + 1);
    setIsShowingHint(true);

    setTimeout(() => {
      setIsShowingHint(false);
    }, 1200);
  }

  const restartGame = useCallback(
    (newDiff?: Difficulty) => {
      const diff = newDiff || difficulty;
      if (newDiff) setDifficulty(newDiff);
      setCards(generateCards(diff));
      setFlipped([]);
      setAttempts(0);
      setMatches(0);
      setHintsUsed(0);
      setSeconds(0);
      setIsComplete(false);
      setIsChecking(false);
      setIsShowingHint(false);
      setIsPaused(false);
    },
    [difficulty]
  );

  function handleExitRequest() {
    if (isComplete || (attempts === 0 && matches === 0)) {
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
          title="Memory Match"
          onPause={() => setIsPaused((p) => !p)}
          onExitClick={handleExitRequest}
          onHearInstructions={() =>
            speak("Find the matching pairs. Turn over two cards at a time and try to find the cards that match.")
          }
          isPaused={isPaused}
        />

        {!isComplete ? (
          <>
            {/* Title & Instructions */}
            <section className="py-6 text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Memory Match
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Find the matching pairs
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-lg leading-7 text-[#68736D]">
                Turn over two cards at a time. Take all the time you need.
              </p>

              {/* Difficulty Selector */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-[#DCE3DD] bg-white p-1.5 shadow-sm">
                <span className="px-3 text-sm font-semibold text-[#68736D]">Difficulty:</span>
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      playSound("click");
                      restartGame(level);
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

            {/* Game Stats Bar */}
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-3 sm:p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">Matches</p>
                <p className="mt-0.5 text-2xl font-bold text-[#315C43]">
                  {matches} / {totalPairs}
                </p>
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

            {/* Cards Grid */}
            <section
              aria-label="Memory matching cards"
              className={`mx-auto grid gap-4 sm:gap-5 ${DIFFICULTY_CONFIG[difficulty].cols}`}
            >
              {cards.map((card, index) => {
                const isFlipped =
                  flipped.includes(index) || card.matched || isShowingHint;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(index)}
                    disabled={card.matched || isChecking || isShowingHint || isPaused}
                    aria-label={
                      card.matched
                        ? `Matched card ${card.value}`
                        : isFlipped
                        ? `Card showing ${card.value}`
                        : "Hidden memory card"
                    }
                    className={`aspect-square min-h-24 sm:min-h-32 rounded-3xl border-4 text-5xl sm:text-6xl shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#B8CEBD] ${
                      card.matched
                        ? "border-[#315C43] bg-[#E8F1EA] opacity-80"
                        : isFlipped
                        ? "border-[#315C43] bg-[#EDF4EE] scale-102"
                        : "border-[#B9C8BD] bg-white hover:-translate-y-0.5 hover:bg-[#F1F5F2]"
                    }`}
                  >
                    {isFlipped ? (
                      <span aria-hidden="true">{card.value}</span>
                    ) : (
                      <span aria-hidden="true" className="text-3xl text-[#557461]">
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </section>

            {/* In-Game Action Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleHint}
                disabled={isShowingHint || isChecking}
                className="flex min-h-14 items-center gap-2 rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-base font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
              >
                <span>💡</span>
                <span>{isShowingHint ? "Showing Cards..." : "Need a Hint?"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSkipModal(true)}
                className="text-base font-semibold text-[#68736D] underline hover:text-[#24302A]"
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
                Great job!
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                You completed the activity.
              </h1>

              <p className="mt-4 text-xl leading-8 text-[#68736D]">
                You found all of the matching pairs. Wonderful effort!
              </p>

              {/* Performance Summary Cards */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Time</p>
                  <p className="mt-1 text-2xl font-bold">{formatTime(seconds)}</p>
                </div>

                <div className="rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Attempts</p>
                  <p className="mt-1 text-2xl font-bold">{attempts}</p>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#F7F5EF] p-4">
                  <p className="text-sm font-semibold text-[#68736D]">Hints Used</p>
                  <p className="mt-1 text-2xl font-bold">{hintsUsed}</p>
                </div>
              </div>

              <p className="mt-8 text-lg leading-7 text-[#56615B]">
                Come back tomorrow for another activity.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => restartGame()}
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