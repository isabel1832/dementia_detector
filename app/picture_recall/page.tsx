"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
];

const NUMBER_TO_REMEMBER = 4;

function choosePictures() {
  return [...ALL_PICTURES]
    .sort(() => Math.random() - 0.5)
    .slice(0, NUMBER_TO_REMEMBER);
}

function chooseOptions(correctPictures: Picture[]) {
  const correctIds = new Set(correctPictures.map((picture) => picture.id));

  const incorrectPictures = ALL_PICTURES.filter(
    (picture) => !correctIds.has(picture.id)
  )
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return [...correctPictures, ...incorrectPictures].sort(
    () => Math.random() - 0.5
  );
}

export default function PictureRecallPage() {
  const [pictures, setPictures] = useState<Picture[]>(choosePictures);
  const [options, setOptions] = useState<Picture[]>([]);
  const [phase, setPhase] = useState<"remember" | "recall" | "complete">(
    "remember"
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Timer
  useEffect(() => {
    if (phase === "complete") return;

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  function startRecall() {
    setOptions(chooseOptions(pictures));
    setPhase("recall");
  }

  function togglePicture(id: number) {
    if (submitted) return;

    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((pictureId) => pictureId !== id);
      }

      return [...current, id];
    });
  }

  function checkAnswers() {
    const correctIds = new Set(pictures.map((picture) => picture.id));

    const correct = selected.filter((id) => correctIds.has(id)).length;

    const incorrect = selected.filter((id) => !correctIds.has(id)).length;

    setCorrectAnswers(Math.max(0, correct - incorrect));
    setSubmitted(true);

    setTimeout(() => {
      setPhase("complete");
    }, 1000);
  }

  function restartGame() {
    const newPictures = choosePictures();

    setPictures(newPictures);
    setOptions([]);
    setSelected([]);
    setSeconds(0);
    setCorrectAnswers(0);
    setSubmitted(false);
    setPhase("remember");
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

        {/* Remember phase */}
        {phase === "remember" && (
          <section className="py-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Picture Recall
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Remember these pictures
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#68736D]">
                Take a moment to look at these pictures. Try to remember all
                of them.
              </p>
            </div>

            {/* Pictures */}
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-5 sm:grid-cols-4">
              {pictures.map((picture) => (
                <div
                  key={picture.id}
                  className="flex aspect-square flex-col items-center justify-center rounded-3xl border-2 border-[#DCE3DD] bg-white shadow-sm"
                >
                  <span className="text-6xl sm:text-7xl">
                    {picture.emoji}
                  </span>

                  <span className="mt-3 text-base font-semibold text-[#68736D]">
                    {picture.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Start button */}
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={startRecall}
                className="min-h-16 rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                I&apos;m Ready
              </button>
            </div>

            <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-[#EDF4EE] p-5 text-center">
              <p className="text-lg font-semibold text-[#56615B]">
                Take your time. There is no rush.
              </p>
            </div>
          </section>
        )}

        {/* Recall phase */}
        {phase === "recall" && (
          <section className="py-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#557461]">
                Picture Recall
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Which pictures did you see?
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#68736D]">
                Select the pictures you remember seeing.
              </p>
            </div>

            {/* Timer */}
            <div className="mt-6 flex justify-center">
              <div className="rounded-full bg-white px-5 py-3 text-base font-semibold shadow-sm">
                ⏱ {formatTime(seconds)}
              </div>
            </div>

            {/* Options */}
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-5 sm:grid-cols-4">
              {options.map((picture) => {
                const isSelected = selected.includes(picture.id);

                const isCorrect =
                  submitted &&
                  pictures.some((item) => item.id === picture.id);

                const isIncorrect =
                  submitted &&
                  isSelected &&
                  !pictures.some((item) => item.id === picture.id);

                return (
                  <button
                    key={picture.id}
                    type="button"
                    onClick={() => togglePicture(picture.id)}
                    disabled={submitted}
                    className={`flex aspect-square flex-col items-center justify-center rounded-3xl border-4 bg-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#B8CEBD] ${
                      isCorrect
                        ? "border-[#315C43] bg-[#EDF4EE]"
                        : isIncorrect
                          ? "border-[#A85D5D] bg-[#F9EEEE]"
                          : isSelected
                            ? "border-[#315C43] bg-[#EDF4EE]"
                            : "border-[#DCE3DD] hover:bg-[#F1F5F2]"
                    }`}
                  >
                    <span className="text-6xl sm:text-7xl">
                      {picture.emoji}
                    </span>

                    <span className="mt-3 text-base font-semibold">
                      {picture.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Check button */}
            {!submitted && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={checkAnswers}
                  disabled={selected.length === 0}
                  className="min-h-16 rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white transition hover:bg-[#274C36] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  Check My Answers
                </button>
              </div>
            )}

            {/* Feedback */}
            {submitted && (
              <div className="mt-8 rounded-2xl bg-[#EDF4EE] p-5 text-center">
                <p className="text-lg font-semibold text-[#56615B]">
                  Nice work! Let&apos;s see how you did.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Completion */}
        {phase === "complete" && (
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
                You remembered {correctAnswers} out of {pictures.length}{" "}
                pictures.
              </p>

              {/* Results */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F7F5EF] p-5">
                  <p className="text-sm font-semibold text-[#68736D]">
                    Pictures remembered
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {correctAnswers} / {pictures.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5EF] p-5">
                  <p className="text-sm font-semibold text-[#68736D]">
                    Time
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {formatTime(seconds)}
                  </p>
                </div>
              </div>

              <p className="mt-8 text-lg leading-7 text-[#56615B]">
                Every activity is an opportunity to practice. Nice work!
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

        {/* Footer */}
        <footer className="border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}