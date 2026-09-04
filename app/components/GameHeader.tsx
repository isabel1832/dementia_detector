"use client";

import React from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/context/AccessibilityContext";

interface GameHeaderProps {
  title: string;
  onPause?: () => void;
  onExitClick: () => void;
  onHearInstructions?: () => void;
  isPaused?: boolean;
}

export default function GameHeader({
  title,
  onPause,
  onExitClick,
  onHearInstructions,
  isPaused = false,
}: GameHeaderProps) {
  const { playSound } = useAccessibility();

  return (
    <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-5">
      <div className="flex items-center gap-3">
        <Link
          href="/player"
          onClick={(e) => {
            e.preventDefault();
            playSound("click");
            onExitClick();
          }}
          className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl" aria-hidden="true">
            🧠
          </div>

          <span className="text-xl font-semibold tracking-tight">
            Memory & Puzzle
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {onHearInstructions && (
          <button
            type="button"
            onClick={() => {
              playSound("click");
              onHearInstructions();
            }}
            className="flex min-h-12 items-center gap-2 rounded-xl px-4 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            title="Hear instructions"
            aria-label="Hear instructions"
          >
            <span aria-hidden="true">🔊</span>
            <span className="hidden sm:inline">Hear</span>
          </button>
        )}

        {onPause && (
          <button
            type="button"
            onClick={() => {
              playSound("click");
              onPause();
            }}
            className="flex min-h-12 items-center gap-2 rounded-xl border border-[#B9C8BD] px-4 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            aria-label={isPaused ? "Resume activity" : "Pause activity"}
          >
            <span aria-hidden="true">{isPaused ? "▶️" : "⏸️"}</span>
            <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            playSound("click");
            onExitClick();
          }}
          className="rounded-xl px-5 py-3 text-base font-semibold text-[#68736D] hover:bg-[#E8EFE9] hover:text-[#24302A] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
        >
          Exit
        </button>
      </div>
    </header>
  );
}
