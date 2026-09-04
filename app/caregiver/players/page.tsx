"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CaregiverNavigation from "@/app/components/CaregiverNavigation";

interface Player {
  id: string;
  first_name: string;
  last_name: string | null;
  access_code: string;
  relationship: string | null;
  connected_at: string;
}

export default function CaregiverPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [relationshipInput, setRelationshipInput] = useState("Family Member");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newRelationship, setNewRelationship] = useState("Family Member");

  const [connectMsg, setConnectMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadPlayers() {
    try {
      const res = await fetch("/api/caregiver/players");
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setConnectMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/caregiver/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode: accessCodeInput,
          relationship: relationshipInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setConnectMsg({ type: "error", text: data.error || "Failed to connect player." });
        return;
      }

      setConnectMsg({ type: "success", text: `Successfully connected ${data.player.first_name}!` });
      setAccessCodeInput("");
      loadPlayers();
    } catch {
      setConnectMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/caregiver/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          firstName: newFirstName,
          lastName: newLastName,
          relationship: newRelationship,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCreateMsg({ type: "error", text: data.error || "Failed to create player." });
        return;
      }

      setCreateMsg({
        type: "success",
        text: `Player created! Give them this 6-digit access code: ${data.player.accessCode}`,
      });
      setNewFirstName("");
      setNewLastName("");
      loadPlayers();
    } catch {
      setCreateMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <CaregiverNavigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-[#DCE3DD] pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Manage Players
          </h1>
          <p className="mt-2 text-lg text-[#68736D]">
            Connect family members and players using their 6-digit access codes.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Connect Player Form */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                🔗
              </span>
              <div>
                <h2 className="text-2xl font-bold">Connect with Access Code</h2>
                <p className="text-sm text-[#68736D]">Enter code generated on player&apos;s device</p>
              </div>
            </div>

            {connectMsg && (
              <div
                className={`mt-4 rounded-xl p-4 text-sm font-bold ${
                  connectMsg.type === "success"
                    ? "bg-[#EDF4EE] text-[#315C43] border border-[#B9C8BD]"
                    : "bg-[#FDF2F2] text-[#9C2B2B] border border-[#F0B8B8]"
                }`}
              >
                {connectMsg.text}
              </div>
            )}

            <form onSubmit={handleConnect} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  6-Digit Player Access Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 482731"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  className="min-h-14 w-full rounded-xl border-2 border-[#C9D4CC] px-4 font-mono text-xl font-bold outline-none focus:border-[#315C43]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Your Relationship to Player
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mother, Father, Spouse, Friend"
                  value={relationshipInput}
                  onChange={(e) => setRelationshipInput(e.target.value)}
                  className="min-h-14 w-full rounded-xl border-2 border-[#C9D4CC] px-4 text-base outline-none focus:border-[#315C43]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="min-h-14 w-full rounded-xl bg-[#315C43] px-6 text-base font-bold text-white transition hover:bg-[#274C36] disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Connect Player"}
              </button>
            </form>
          </section>

          {/* Create New Player Form */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                ➕
              </span>
              <div>
                <h2 className="text-2xl font-bold">Add a New Player</h2>
                <p className="text-sm text-[#68736D]">Create a profile and generate their login code</p>
              </div>
            </div>

            {createMsg && (
              <div
                className={`mt-4 rounded-xl p-4 text-sm font-bold ${
                  createMsg.type === "success"
                    ? "bg-[#EDF4EE] text-[#315C43] border border-[#B9C8BD]"
                    : "bg-[#FDF2F2] text-[#9C2B2B] border border-[#F0B8B8]"
                }`}
              >
                {createMsg.text}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="min-h-14 w-full rounded-xl border-2 border-[#C9D4CC] px-4 text-base outline-none focus:border-[#315C43]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="min-h-14 w-full rounded-xl border-2 border-[#C9D4CC] px-4 text-base outline-none focus:border-[#315C43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Mother, Father, Client"
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value)}
                  className="min-h-14 w-full rounded-xl border-2 border-[#C9D4CC] px-4 text-base outline-none focus:border-[#315C43]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="min-h-14 w-full rounded-xl bg-[#315C43] px-6 text-base font-bold text-white transition hover:bg-[#274C36] disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create & Generate Access Code"}
              </button>
            </form>
          </section>
        </div>

        {/* Connected Players List */}
        <section className="mt-10 rounded-[2rem] border border-[#DCE3DD] bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-2xl font-bold mb-6">Your Connected Players</h2>

          {players.length === 0 ? (
            <p className="py-6 text-center text-[#68736D]">No players connected yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border-2 border-[#DCE3DD] p-5 hover:border-[#315C43] transition bg-[#FCFCFA]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">👤</span>
                    <span className="rounded-full bg-[#EDF4EE] px-3 py-1 text-xs font-bold text-[#315C43]">
                      {p.relationship || "Player"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold">
                    {p.first_name} {p.last_name || ""}
                  </h3>

                  <p className="mt-2 text-sm text-[#68736D]">
                    Access Code: <span className="font-mono font-bold text-[#24302A]">{p.access_code}</span>
                  </p>

                  <Link
                    href={`/caregiver/dashboard`}
                    className="mt-4 inline-block font-bold text-sm text-[#315C43] hover:underline"
                  >
                    View in Dashboard →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
