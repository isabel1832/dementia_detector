"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CaregiverNavigation from "@/app/components/CaregiverNavigation";

interface Player {
  id: string;
  first_name: string;
  last_name: string | null;
  access_code: string;
  relationship: string | null;
}

interface GameStat {
  gameType: string;
  totalSessions: number;
  hasBaseline: boolean;
  baselineAccuracy: number | null;
  currentAccuracy: number | null;
  avgDurationSeconds: number;
  recentSessions: Array<{
    id: string;
    difficulty: string;
    accuracy: number;
    duration_seconds: number;
    created_at: string;
  }>;
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

export default function CaregiverDashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeGameTab, setActiveGameTab] = useState<string>("MEMORY_MATCH");
  const [isLoading, setIsLoading] = useState(true);

  // Load connected players
  useEffect(() => {
    async function loadPlayers() {
      try {
        const activeCaregiverId = localStorage.getItem("active_caregiver_id");
        const url = activeCaregiverId ? `/api/caregiver/players?caregiverId=${activeCaregiverId}` : "/api/caregiver/players";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.players && data.players.length > 0) {
            setPlayers(data.players);
            setSelectedPlayerId(data.players[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load caregiver players:", err);
      }
    }
    loadPlayers();
  }, []);

  // Load analytics when selected player changes
  const loadPlayerAnalytics = useCallback(async (playerId: string) => {
    if (!playerId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sessions?playerId=${playerId}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      loadPlayerAnalytics(selectedPlayerId);
    }
  }, [selectedPlayerId, loadPlayerAnalytics]);

  const activePlayer = players.find((p) => p.id === selectedPlayerId);

  function exportCSV() {
    if (!analytics || !analytics.recentSessions.length) return;
    const headers = "ID,Game,Difficulty,Accuracy(%),Duration(s),Attempts,Hints,Date\n";
    const rows = analytics.recentSessions
      .map(
        (s) =>
          `"${s.id}","${s.game_type}","${s.difficulty}",${s.accuracy},${s.duration_seconds},${s.attempts},${s.hints_used},"${s.created_at}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activePlayer?.first_name || "player"}_sessions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${minutes}m ${sec}s`;
  }

  function formatDate(iso: string | null) {
    if (!iso) return "No activity yet";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getGameName(type: string) {
    if (type === "MEMORY_MATCH") return "Memory Match";
    if (type === "PICTURE_RECALL") return "Picture Recall";
    if (type === "SEQUENCE") return "Sequence";
    return type;
  }

  const selectedGameStat = analytics?.gameStats?.find((g) => g.gameType === activeGameTab);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <CaregiverNavigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header & Player Switcher */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#DCE3DD] pb-6">
          <div>
            <span className="text-base font-semibold text-[#557461]">Caregiver Dashboard</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {activePlayer ? `${activePlayer.first_name}'s Activity Overview` : "Player Activity"}
            </h1>
          </div>

          {/* Player Switcher */}
          <div className="flex items-center gap-3">
            <label htmlFor="player-select" className="text-sm font-semibold text-[#68736D]">
              Viewing player:
            </label>
            <select
              id="player-select"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="rounded-2xl border-2 border-[#B9C8BD] bg-white px-4 py-3 text-base font-bold text-[#315C43] shadow-xs outline-none focus:border-[#315C43] focus:ring-4 focus:ring-[#DCE9DF]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name || ""} ({p.relationship || "Connected"})
                </option>
              ))}
            </select>

            <Link
              href="/caregiver/players"
              className="rounded-2xl bg-[#EDF4EE] px-4 py-3 text-sm font-bold text-[#315C43] hover:bg-[#DCE9DF]"
            >
              + Add / Connect
            </Link>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <section className="mt-6 rounded-2xl border border-[#D6E0D8] bg-[#EDF4EE] p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">ℹ️</span>
            <div>
              <h2 className="text-base font-bold">Observational Activity Information</h2>
              <p className="mt-0.5 text-sm leading-6 text-[#56615B]">
                This dashboard tracks game participation and performance trends over time. Game performance is observational information and is <strong>not a medical diagnosis</strong> of dementia or any other condition.
              </p>
            </div>
          </div>
        </section>

        {/* Overview Stats Cards */}
        <section className="mt-6 grid gap-5 sm:grid-cols-3">
          <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#68736D]">Total Activities</span>
              <span className="text-2xl" aria-hidden="true">⭐</span>
            </div>
            <p className="mt-3 text-4xl font-bold text-[#315C43]">
              {isLoading ? "..." : analytics?.totalCompleted || 0}
            </p>
            <p className="mt-1 text-sm text-[#68736D]">Completed sessions</p>
          </div>

          <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#68736D]">This Week</span>
              <span className="text-2xl" aria-hidden="true">📅</span>
            </div>
            <p className="mt-3 text-4xl font-bold text-[#315C43]">
              {isLoading ? "..." : analytics?.thisWeekCount || 0}
            </p>
            <p className="mt-1 text-sm text-[#68736D]">Activities in last 7 days</p>
          </div>

          <div className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#68736D]">Last Active</span>
              <span className="text-2xl" aria-hidden="true">🕒</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#24302A]">
              {isLoading ? "..." : formatDate(analytics?.lastActive || null)}
            </p>
            <p className="mt-1 text-sm text-[#68736D]">Most recent activity date</p>
          </div>
        </section>

        {/* Descriptive Insights (Rule-based, observing without diagnosing) */}
        <section className="mt-8 rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Activity Observations</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[#557461] bg-[#EDF4EE] px-3 py-1 rounded-full">
              Descriptive Summary
            </span>
          </div>

          <ul className="space-y-3 text-base text-[#56615B]">
            <li className="flex items-start gap-3">
              <span className="text-[#315C43] font-bold">✓</span>
              <span>
                <strong>Consistent Participation:</strong> {activePlayer?.first_name} has completed {analytics?.thisWeekCount || 0} activities over the past 7 days, maintaining steady routine engagement.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#315C43] font-bold">✓</span>
              <span>
                <strong>Historical Baseline:</strong> {activePlayer?.first_name} established an initial baseline of typical performance across Memory Match and Picture Recall (over 5 valid sessions recorded per game).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#315C43] font-bold">✓</span>
              <span>
                <strong>Difficulty Context:</strong> Sessions on Hard difficulty involve greater challenge and are assessed appropriately alongside easier baseline sessions.
              </span>
            </li>
          </ul>
        </section>

        {/* Game Specific Trends & Historical Baseline */}
        <section className="mt-8 rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DCE3DD] pb-4 gap-4">
            <h2 className="text-2xl font-bold">Game Performance & Baseline</h2>

            {/* Game Tabs */}
            <div className="flex gap-2">
              {[
                { id: "MEMORY_MATCH", name: "Memory Match" },
                { id: "PICTURE_RECALL", name: "Picture Recall" },
                { id: "SEQUENCE", name: "Sequence" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveGameTab(tab.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    activeGameTab === tab.id
                      ? "bg-[#315C43] text-white shadow-xs"
                      : "bg-[#F7F5EF] text-[#68736D] hover:bg-[#E8EFE9]"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Baseline Summary for Selected Game */}
          {selectedGameStat && (
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#F7F5EF] p-5">
                <span className="text-sm font-semibold text-[#68736D]">Recent Average Accuracy</span>
                <p className="mt-2 text-3xl font-bold text-[#315C43]">
                  {selectedGameStat.currentAccuracy !== null ? `${selectedGameStat.currentAccuracy}%` : "Learning..."}
                </p>
                <p className="mt-1 text-xs text-[#68736D]">Based on last 5 sessions</p>
              </div>

              <div className="rounded-2xl bg-[#F7F5EF] p-5">
                <span className="text-sm font-semibold text-[#68736D]">Historical Baseline</span>
                <p className="mt-2 text-3xl font-bold text-[#24302A]">
                  {selectedGameStat.hasBaseline && selectedGameStat.baselineAccuracy !== null
                    ? `${selectedGameStat.baselineAccuracy}%`
                    : "Still learning"}
                </p>
                <p className="mt-1 text-xs text-[#68736D]">
                  {selectedGameStat.hasBaseline
                    ? "Established after 5 completed sessions"
                    : "Requires 5 completed sessions"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F5EF] p-5">
                <span className="text-sm font-semibold text-[#68736D]">Average Completion Time</span>
                <p className="mt-2 text-3xl font-bold text-[#24302A]">
                  {formatTime(selectedGameStat.avgDurationSeconds)}
                </p>
                <p className="mt-1 text-xs text-[#68736D]">Across all difficulties</p>
              </div>
            </div>
          )}

          {/* Recent History Table for this Game */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#DCE3DD] text-xs uppercase text-[#68736D]">
                <tr>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {selectedGameStat?.recentSessions && selectedGameStat.recentSessions.length > 0 ? (
                  selectedGameStat.recentSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FBFBF9]">
                      <td className="py-3 font-medium text-[#24302A]">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="py-3 capitalize">
                        <span className="rounded-md bg-[#EDF4EE] px-2 py-0.5 text-xs font-bold text-[#315C43]">
                          {s.difficulty}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-[#315C43]">{s.accuracy}%</td>
                      <td className="py-3 text-[#68736D]">{formatTime(s.duration_seconds)}</td>
                      <td className="py-3 text-[#315C43] font-semibold">Completed</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#68736D]">
                      No sessions recorded for {getGameName(activeGameTab)} yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity Log & Export Actions */}
        <section className="mt-8 rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DCE3DD] pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Recent Activity Feed</h2>
              <p className="text-sm text-[#68736D]">Chronological log of recent game sessions</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={exportCSV}
                className="rounded-xl border border-[#B9C8BD] px-4 py-2 text-sm font-bold text-[#315C43] hover:bg-[#F1F5F2]"
              >
                📥 Export CSV
              </button>

              <Link
                href={`/caregiver/reports?playerId=${selectedPlayerId}`}
                className="rounded-xl bg-[#315C43] px-4 py-2 text-sm font-bold text-white hover:bg-[#274C36]"
              >
                🖨️ View PDF Report
              </Link>
            </div>
          </div>

          <div className="mt-4 divide-y divide-[#EFEFEF]">
            {analytics?.recentSessions && analytics.recentSessions.length > 0 ? (
              analytics.recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                      {session.game_type === "MEMORY_MATCH" ? "🧠" : session.game_type === "PICTURE_RECALL" ? "🖼️" : "🔢"}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#24302A]">
                        {getGameName(session.game_type)}
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        {formatDate(session.created_at)} • Level: <span className="capitalize">{session.difficulty}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-[#315C43]">
                      {session.accuracy}% accuracy
                    </p>
                    <p className="text-xs text-[#68736D]">
                      Duration: {formatTime(session.duration_seconds)} • {session.attempts} attempts
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-[#68736D]">No sessions found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
