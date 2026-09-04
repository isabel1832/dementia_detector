"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

export type TextSize = "standard" | "large" | "extraLarge";
export type ContrastMode = "standard" | "high";
export type VoiceSpeed = "slow" | "normal" | "fast";

export interface AccessibilitySettings {
  textSize: TextSize;
  contrast: ContrastMode;
  soundEffects: boolean;
  music: boolean;
  voiceInstructions: boolean;
  repeatInstructions: boolean;
  voiceSpeed: VoiceSpeed;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  playSound: (type: "click" | "match" | "success" | "gentle-error") => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: "standard",
  contrast: "standard",
  soundEffects: true,
  music: false,
  voiceInstructions: true,
  repeatInstructions: true,
  voiceSpeed: "normal",
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Helper to get or lazily initialize the singleton AudioContext
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Global listener to unlock audio & speech on the first user interaction
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unlockAudio = () => {
      getAudioContext();
      if ("speechSynthesis" in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [getAudioContext]);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("dementia_app_accessibility");
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Update HTML data attributes whenever settings change
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    root.setAttribute("data-text-size", settings.textSize);
    root.setAttribute("data-contrast", settings.contrast);
    root.setAttribute("data-reduced-motion", settings.reducedMotion ? "true" : "false");

    try {
      localStorage.setItem("dementia_app_accessibility", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, isClient]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Web Speech API
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!settings.voiceInstructions) return;

      stopSpeaking();

      // Ensure any paused synthesis state is unpaused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      // Retain reference on ref to prevent browser garbage collection cutting off audio
      utteranceRef.current = utterance;
      utterance.lang = "en-US";

      // Rate adjustment
      if (settings.voiceSpeed === "slow") {
        utterance.rate = 0.8;
      } else if (settings.voiceSpeed === "fast") {
        utterance.rate = 1.2;
      } else {
        utterance.rate = 1.0;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    },
    [settings.voiceInstructions, settings.voiceSpeed, stopSpeaking]
  );

  // Gentle audio tones using Web Audio API (calm, non-punitive, warm chimes)
  const playSound = useCallback(
    (type: "click" | "match" | "success" | "gentle-error") => {
      if (!settings.soundEffects) return;
      if (typeof window === "undefined") return;

      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "click") {
          // Soft tap
          osc.type = "sine";
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === "match") {
          // Pleasant chord
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === "success") {
          // Warm harmonic chime
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554.37, now + 0.15);
          osc.frequency.setValueAtTime(659.25, now + 0.3);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        } else if (type === "gentle-error") {
          // Soft warm low tone
          osc.type = "sine";
          osc.frequency.setValueAtTime(260, now);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        }
      } catch {
        // audio context could be blocked by browser policy until user interaction
      }
    },
    [settings.soundEffects, getAudioContext]
  );

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        speak,
        stopSpeaking,
        isSpeaking,
        playSound,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
