"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccessibility } from "@/app/context/AccessibilityContext";

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onExit: () => void;
}

export function PauseModal({ isOpen, onResume, onExit }: PauseModalProps) {
  const { playSound } = useAccessibility();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-8 text-center shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl" aria-hidden="true">
          ⏸️
        </div>

        <h2 id="pause-title" className="mt-6 text-3xl font-bold tracking-tight">
          Activity Paused
        </h2>

        <p className="mt-3 text-xl text-[#68736D]">
          Take your time. Whenever you are ready, you can continue.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              playSound("click");
              onResume();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={() => {
              playSound("click");
              onExit();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            Exit Activity
          </button>
        </div>
      </div>
    </div>
  );
}

interface ExitConfirmModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onConfirmExit: () => void;
}

export function ExitConfirmModal({
  isOpen,
  onContinue,
  onConfirmExit,
}: ExitConfirmModalProps) {
  const { playSound } = useAccessibility();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="exit-title">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-8 text-center shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl" aria-hidden="true">
          🌱
        </div>

        <h2 id="exit-title" className="mt-6 text-3xl font-bold tracking-tight">
          Are you sure?
        </h2>

        <p className="mt-3 text-xl text-[#68736D]">
          Your activity isn&apos;t finished yet. You can stay or leave anytime.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              playSound("click");
              onContinue();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
          >
            Continue Activity
          </button>

          <button
            type="button"
            onClick={() => {
              playSound("click");
              onConfirmExit();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#68736D] transition hover:bg-[#F1F5F2] hover:text-[#24302A] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

interface SkipModalProps {
  isOpen: boolean;
  onStay: () => void;
  onSkip: () => void;
}

export function SkipModal({ isOpen, onStay, onSkip }: SkipModalProps) {
  const { playSound } = useAccessibility();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="skip-title">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-[#DCE3DD] bg-white p-8 text-center shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EDF4EE] text-4xl" aria-hidden="true">
          ⏭️
        </div>

        <h2 id="skip-title" className="mt-6 text-3xl font-bold tracking-tight">
          Skip this activity?
        </h2>

        <p className="mt-3 text-xl text-[#68736D]">
          That&apos;s okay. You can choose another activity whenever you like.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              playSound("click");
              onSkip();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-6 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
          >
            Skip Activity
          </button>

          <button
            type="button"
            onClick={() => {
              playSound("click");
              onStay();
            }}
            className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-6 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
}
