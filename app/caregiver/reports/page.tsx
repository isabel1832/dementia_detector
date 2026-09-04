"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CaregiverNavigation from "@/app/components/CaregiverNavigation";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";

interface GameStat {
  gameType: string;
  totalSessions: number;
  hasBaseline: boolean;
  baselineAccuracy: number | null;
  currentAccuracy: number | null;
  avgDurationSeconds: number;
}

interface Analytics {
  totalCompleted: number;
  thisWeekCount: number;
  lastActive: string | null;
  recentSessions: Array<{
    id: string;
    game_type: string;
    difficulty: string;
    duration_seconds: number;
    accuracy: number;
    attempts: number;
    hints_used: number;
    created_at: string;
  }>;
  gameStats: GameStat[];
}

export default function CaregiverReportsPage() {
  useRequireAuth(["caregiver", "professional"]);
  const [players, setPlayers] = useState<Array<{ id: string; first_name: string; last_name: string | null }>>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/caregiver/players");
        if (res.ok) {
          const data = await res.json();
          if (data.players?.length) {
            setPlayers(data.players);
            setSelectedPlayerId(data.players[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedPlayerId) return;
    async function loadStats() {
      try {
        const res = await fetch(`/api/sessions?playerId=${selectedPlayerId}`);
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, [selectedPlayerId]);

  const activePlayer = players.find((p) => p.id === selectedPlayerId);

  function handlePrint() {
    window.print();
  }

  function getGameName(type: string) {
    if (type === "MEMORY_MATCH") return "Memory Match";
    if (type === "PICTURE_RECALL") return "Picture Recall";
    if (type === "SEQUENCE") return "Sequence";
    return type;
  }

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${minutes}m ${sec}s`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="print:hidden">
        <CaregiverNavigation />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Controls Bar (hidden during print) */}
        <div className="print:hidden mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE3DD] pb-6">
          <div>
            <h1 className="text-3xl font-bold">Activity Report</h1>
            <p className="text-sm text-[#68736D]">Printable summary report for caregivers and consultations</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="rounded-xl border-2 border-[#B9C8BD] bg-white px-4 py-2 font-bold text-sm text-[#315C43]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name || ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-[#315C43] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#274C36]"
            >
              <span>🖨️</span>
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <article className="rounded-3xl border-2 border-[#DCE3DD] bg-white p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="border-b-2 border-[#24302A] pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <span className="text-xl font-bold tracking-tight">Memory & Puzzle</span>
              </div>
              <h2 className="text-3xl font-black mt-3">Player Activity Summary</h2>
              <p className="text-sm text-[#68736D] mt-1">Generated on {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#68736D]">Player</span>
              <p className="text-2xl font-bold text-[#315C43]">
                {activePlayer ? `${activePlayer.first_name} ${activePlayer.last_name || ""}` : "Player"}
              </p>
            </div>
          </div>

          {/* Mandatory Medical Disclaimer (UI/UX Spec Section 53) */}
          <section className="mt-6 rounded-xl border-2 border-[#A2B8A8] bg-[#F1F6F2] p-4 text-sm leading-relaxed text-[#1F3D2C]">
            <p className="font-bold uppercase tracking-wider text-xs text-[#315C43] mb-1">
              Important Product Notice
            </p>
            <p>
              Game performance is observational activity data and is <strong>not a medical diagnosis</strong> of dementia, cognitive impairment, or any other medical condition. These results reflect engagement with recreational cognitive games.
            </p>
          </section>

          {/* Overview Metrics */}
          <div className="mt-8 grid grid-cols-3 gap-4 border border-[#DCE3DD] rounded-2xl p-4 bg-[#FBFBF9]">
            <div>
              <span className="text-xs uppercase text-[#68736D] font-bold">Total Completed</span>
              <p className="text-2xl font-bold text-[#24302A] mt-1">{analytics?.totalCompleted || 0} activities</p>
            </div>
            <div>
              <span className="text-xs uppercase text-[#68736D] font-bold">Weekly Activity</span>
              <p className="text-2xl font-bold text-[#24302A] mt-1">{analytics?.thisWeekCount || 0} this week</p>
            </div>
            <div>
              <span className="text-xs uppercase text-[#68736D] font-bold">Last Active</span>
              <p className="text-2xl font-bold text-[#24302A] mt-1">{analytics?.lastActive ? formatDate(analytics.lastActive) : "None"}</p>
            </div>
          </div>

          {/* Game-by-Game Baseline Performance Table */}
          <section className="mt-8">
            <h3 className="text-xl font-bold mb-3">Historical Baseline Performance</h3>
            <table className="w-full text-left text-sm border border-[#DCE3DD] rounded-xl overflow-hidden">
              <thead className="bg-[#EDF4EE] text-xs font-bold text-[#315C43] uppercase">
                <tr>
                  <th className="p-3">Activity</th>
                  <th className="p-3">Total Played</th>
                  <th className="p-3">Recent Accuracy</th>
                  <th className="p-3">Historical Baseline</th>
                  <th className="p-3">Avg Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {analytics?.gameStats?.map((g) => (
                  <tr key={g.gameType}>
                    <td className="p-3 font-bold">{getGameName(g.gameType)}</td>
                    <td className="p-3">{g.totalSessions}</td>
                    <td className="p-3 font-bold text-[#315C43]">
                      {g.currentAccuracy !== null ? `${g.currentAccuracy}%` : "—"}
                    </td>
                    <td className="p-3">
                      {g.hasBaseline && g.baselineAccuracy !== null
                        ? `${g.baselineAccuracy}% (5-session baseline)`
                        : "Collecting baseline (5 required)"}
                    </td>
                    <td className="p-3">{formatTime(g.avgDurationSeconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Recent Session Logs */}
          <section className="mt-8">
            <h3 className="text-xl font-bold mb-3">Recent Session Log (Past 10 Activities)</h3>
            <table className="w-full text-left text-sm border border-[#DCE3DD] rounded-xl overflow-hidden">
              <thead className="bg-[#EDF4EE] text-xs font-bold text-[#315C43] uppercase">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Game</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {analytics?.recentSessions?.slice(0, 10).map((s) => (
                  <tr key={s.id}>
                    <td className="p-3 text-[#68736D]">{formatDate(s.created_at)}</td>
                    <td className="p-3 font-medium">{getGameName(s.game_type)}</td>
                    <td className="p-3 capitalize">{s.difficulty}</td>
                    <td className="p-3 font-bold text-[#315C43]">{s.accuracy}%</td>
                    <td className="p-3">{formatTime(s.duration_seconds)}</td>
                    <td className="p-3">{s.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Report Footer */}
          <footer className="mt-12 border-t border-[#DCE3DD] pt-4 text-center text-xs text-[#68736D]">
            <p>Memory & Puzzle Application • Confidential Personal Activity Summary</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
