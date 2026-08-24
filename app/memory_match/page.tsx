"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Card = {
  id: number;
  value: string;
  matched: boolean;
};

const CARD_VALUES = ["🌳", "🌳", "🐶", "🐶", "🌸", "🌸", "⭐", "⭐"];

function createCards(): Card[] {
  const shuffled = [...CARD_VALUES].sort(() => Math.random() - 0.5);

  return shuffled.map((value, index) => ({
    id: index,
    value,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Timer
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  // Check cards after two cards are flipped
  useEffect(() => {
    if (flipped.length !== 2) return;

    setIsChecking(true);
    setAttempts((current) => current + 1);

    const firstCard = cards[flipped[0]];
    const secondCard = cards[flipped[1]];

    const timer = setTimeout(() => {
      if (firstCard.value === secondCard.value) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, matched: true }
              : card
          )
        );

        setMatches((current) => current + 1);
      }

      setFlipped([]);
      setIsChecking(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [flipped, cards]);

  // Check if game is complete
  useEffect(() => {
    if (matches === CARD_VALUES.length / 2) {
      setIsComplete(true);
    }
  }, [matches]);

  function handleCardClick(index: number) {
    if (isChecking) return;
    if (flipped.includes(index)) return;
    if (cards[index].matched) return;
    if (flipped.length === 2) return;

    setFlipped((current) => [...current, index]);
  }

  function restartGame() {
    setCards(createCards());
    setFlipped([]);
    setAttempts(0);
    setMatches(0);
    setSeconds(0);
    setIsComplete(false);
    setIsChecking(false);
  }

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const secondsRemaining = totalSeconds % 60;

    return `${minutes}:${secondsRemaining.toString().padStart(2, "0")}`;
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href="/player"
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
            href="/player"
            className="rounded-xl px-5 py-3 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9]"
          >
            Exit
          </Link>
        </header>

        {!isComplete ? (
          <>
            {/* Instructions */}
            <section className="py-8 text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Memory Match
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Find the matching pairs
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#68736D]">
                Turn over two cards at a time and try to find the cards that
                match.
              </p>
            </section>

            {/* Game stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">
                  Matches
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {matches} / 4
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE3DD] bg-white p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#68736D]">
                  Attempts
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {attempts}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-[#DCE3DD] bg-white p-4 text-center shadow-sm sm:col-span-1">
                <p className="text-sm font-semibold text-[#68736D]">
                  Time
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatTime(seconds)}
                </p>
              </div>
            </div>

            {/* Cards */}
            <section
              aria-label="Memory matching cards"
              className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5"
            >
              {cards.map((card, index) => {
                const isFlipped =
                  flipped.includes(index) || card.matched;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(index)}
                    disabled={card.matched || isChecking}
                    aria-label={
                      isFlipped
                        ? `Card showing ${card.value}`
                        : "Hidden memory card"
                    }
                    className={`aspect-square min-h-28 rounded-3xl border-4 text-5xl shadow-sm transition sm:min-h-36 sm:text-6xl ${
                      isFlipped
                        ? "border-[#315C43] bg-[#EDF4EE]"
                        : "border-[#B9C8BD] bg-white hover:-translate-y-1 hover:bg-[#F1F5F2]"
                    } focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]`}
                  >
                    {isFlipped ? (
                      <span aria-hidden="true">{card.value}</span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="text-3xl text-[#557461]"
                      >
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </section>

            {/* Bottom instruction */}
            <div className="mt-8 rounded-2xl bg-[#EDF4EE] p-5 text-center">
              <p className="text-lg font-semibold text-[#56615B]">
                Take your time. There is no need to rush.
              </p>
            </div>
          </>
        ) : (
          /* Completion screen */
          <section className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="w-full max-w-xl rounded-[2rem] border border-[#D6E0D8] bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl">
                🎉
              </div>

              <p className="mt-7 text-lg font-semibold text-[#557461]">
                Great job!
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                You completed the activity.
              </h1>

              <p className="mt-5 text-xl leading-8 text-[#68736D]">
                You found all of the matching pairs. Nice work!
              </p>

              {/* Results */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F7F5EF] p-5">
                  <p className="text-sm font-semibold text-[#68736D]">
                    Time
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {formatTime(seconds)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5EF] p-5">
                  <p className="text-sm font-semibold text-[#68736D]">
                    Attempts
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {attempts}
                  </p>
                </div>
              </div>

              <p className="mt-8 text-lg leading-7 text-[#56615B]">
                Come back tomorrow for another activity.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={restartGame}
                  className="min-h-16 rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
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
    </main>
  );
}