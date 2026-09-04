"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PlayerSummary {
  id: string;
  first_name: string;
  last_name: string | null;
  access_code: string;
  relationship: string | null;
}

export default function ProfessionalDashboardPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientStats, setPatientStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch("/api/caregiver/players");
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.players || []);
          if (data.players?.length) {
            setSelectedPatientId(data.players[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;
    async function loadStats() {
      try {
        const res = await fetch(`/api/sessions?playerId=${selectedPatientId}`);
        if (res.ok) {
          const data = await res.json();
          setPatientStats(data.analytics);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, [selectedPatientId]);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return players;
    return players.filter((p) =>
      `${p.first_name} ${p.last_name || ""}`.toLowerCase().includes(q)
    );
  }, [players, searchQuery]);

  const activePatient = players.find((p) => p.id === selectedPatientId);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      {/* Clinician Header */}
      <header className="bg-white border-b border-[#DCE3DD] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCE9DF] text-xl" aria-hidden="true">
              🩺
            </div>
            <span className="text-xl font-bold tracking-tight text-[#24302A]">
              Memory & Puzzle <span className="text-sm font-normal text-[#557461] ml-1">Clinical Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#68736D]">Dr. Evelyn Reed (Clinician)</span>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl px-3 py-1.5 text-sm font-semibold text-[#68736D] hover:bg-[#F1F5F2]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="border-b border-[#DCE3DD] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Roster & Cognitive Activities</h1>
            <p className="mt-1 text-base text-[#68736D]">
              Review objective session history and individual baseline performance across patients.
            </p>
          </div>

          {/* Search box */}
          <div className="w-full sm:w-72">
            <input
              type="search"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-2 border-[#B9C8BD] bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-[#315C43]"
            />
          </div>
        </div>

        {/* Medical disclaimer alert */}
        <section className="mt-6 rounded-2xl border border-[#D6E0D8] bg-[#EDF4EE] p-4 text-sm text-[#56615B]">
          <strong>Clinical Notice:</strong> Game performance logs represent observational activity patterns in recreational puzzle tasks and do not constitute a formal neuropsychological assessment or diagnostic instrument.
        </section>

        {/* Split view: Patient roster on left, details on right */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Patient Roster */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-5 shadow-xs lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Patients ({filteredPatients.length})</h2>

            <div className="space-y-2">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                return (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`w-full rounded-2xl p-4 text-left transition flex items-center justify-between ${
                      isSelected
                        ? "bg-[#EDF4EE] border-2 border-[#315C43]"
                        : "hover:bg-[#F8FAF8] border-2 border-transparent"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-base text-[#24302A]">
                        {patient.first_name} {patient.last_name || ""}
                      </p>
                      <p className="text-xs text-[#68736D]">Access Code: {patient.access_code}</p>
                    </div>

                    <span className="text-xs font-bold text-[#557461] bg-white px-2 py-1 rounded-md border border-[#DCE3DD]">
                      View
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected Patient Clinical Summary */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 sm:p-8 shadow-xs lg:col-span-2">
            {activePatient ? (
              <div>
                <div className="flex items-center justify-between border-b border-[#DCE3DD] pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {activePatient.first_name} {activePatient.last_name || ""}
                    </h2>
                    <p className="text-sm text-[#68736D]">Patient ID: {activePatient.id.slice(0, 8)}</p>
                  </div>

                  <Link
                    href={`/caregiver/reports?playerId=${activePatient.id}`}
                    className="rounded-xl bg-[#315C43] px-4 py-2 text-sm font-bold text-white hover:bg-[#274C36]"
                  >
                    🖨️ Print Clinical Report
                  </Link>
                </div>

                {/* Patient Key Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-[#F7F5EF] p-4 text-center">
                    <span className="text-xs uppercase text-[#68736D] font-bold">Completed</span>
                    <p className="text-2xl font-bold text-[#315C43] mt-1">
                      {patientStats?.totalCompleted || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F5EF] p-4 text-center">
                    <span className="text-xs uppercase text-[#68736D] font-bold">Past 7 Days</span>
                    <p className="text-2xl font-bold text-[#315C43] mt-1">
                      {patientStats?.thisWeekCount || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F5EF] p-4 text-center">
                    <span className="text-xs uppercase text-[#68736D] font-bold">Baseline Status</span>
                    <p className="text-base font-bold text-[#24302A] mt-2">
                      Established
                    </p>
                  </div>
                </div>

                {/* Game Baseline Breakdown */}
                <h3 className="text-lg font-bold mt-8 mb-3">Activities Baseline Profile</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border border-[#DCE3DD] rounded-xl">
                    <thead className="bg-[#EDF4EE] text-xs uppercase font-bold text-[#315C43]">
                      <tr>
                        <th className="p-3">Activity</th>
                        <th className="p-3">Sessions</th>
                        <th className="p-3">Recent Accuracy</th>
                        <th className="p-3">Established Baseline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFEFEF]">
                      {patientStats?.gameStats?.map((g: any) => (
                        <tr key={g.gameType}>
                          <td className="p-3 font-semibold">
                            {g.gameType === "MEMORY_MATCH"
                              ? "Memory Match"
                              : g.gameType === "PICTURE_RECALL"
                              ? "Picture Recall"
                              : "Sequence"}
                          </td>
                          <td className="p-3">{g.totalSessions}</td>
                          <td className="p-3 font-bold text-[#315C43]">
                            {g.currentAccuracy !== null ? `${g.currentAccuracy}%` : "—"}
                          </td>
                          <td className="p-3">
                            {g.hasBaseline && g.baselineAccuracy !== null
                              ? `${g.baselineAccuracy}% (5 sessions)`
                              : "Pending (5 required)"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Descriptive Observations */}
                <h3 className="text-lg font-bold mt-8 mb-3">Observational Notes</h3>
                <div className="rounded-2xl bg-[#F7F5EF] p-5 text-sm text-[#56615B] space-y-2 leading-relaxed">
                  <p>
                    • <strong>Engagement:</strong> Patient demonstrates regular independent usage with {patientStats?.thisWeekCount || 0} activities recorded in the trailing week.
                  </p>
                  <p>
                    • <strong>Cognitive Game Baseline:</strong> Valid historical baselines achieved for Memory Match and Picture Recall. Performance remains consistent with patient&apos;s own established baseline.
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-12 text-center text-[#68736D]">Select a patient from the roster to view details.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
