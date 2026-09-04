import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface SessionRow {
  id: string;
  player_id: string;
  game_type: string;
  difficulty: string;
  duration_seconds: number;
  score: number;
  accuracy: number;
  attempts: number;
  hints_used: number;
  errors: number;
  status: string;
  created_at: string;
}

export interface GameSessionInput {
  playerId: string;
  gameType: "MEMORY_MATCH" | "PICTURE_RECALL" | "SEQUENCE";
  difficulty: "easy" | "medium" | "hard";
  durationSeconds: number;
  score?: number;
  accuracy?: number;
  attempts?: number;
  hintsUsed?: number;
  errors?: number;
  status?: "COMPLETED" | "SKIPPED" | "EXITED_EARLY";
}

export async function recordGameSession(input: GameSessionInput) {
  const admin = getSupabaseAdmin();

  const attempts = input.attempts ?? 1;
  const hintsUsed = input.hintsUsed ?? 0;
  const calculatedScore = input.score ?? Math.max(0, 100 - attempts * 2 - hintsUsed * 5);
  const accuracy = input.accuracy ?? 100;
  const errors = input.errors ?? 0;
  const status = input.status ?? "COMPLETED";

  const { data, error } = await admin
    .from("game_sessions")
    .insert({
      player_id: input.playerId,
      game_type: input.gameType,
      difficulty: input.difficulty,
      duration_seconds: input.durationSeconds,
      score: calculatedScore,
      accuracy,
      attempts,
      hints_used: hintsUsed,
      errors,
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SessionRow;
}

export async function getPlayerSessions(
  playerId: string,
  gameType?: "MEMORY_MATCH" | "PICTURE_RECALL" | "SEQUENCE",
  limit = 50
): Promise<SessionRow[]> {
  const admin = getSupabaseAdmin();
  let query = admin
    .from("game_sessions")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (gameType) {
    query = query.eq("game_type", gameType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as SessionRow[];
}

// Mirrors the previous SQLite implementation: baseline = first 5 completed
// sessions recorded for a game, current = the 5 most recent.
export async function getPlayerAnalytics(playerId: string) {
  const allSessions = await getPlayerSessions(playerId, undefined, 200);

  const completed = allSessions.filter((s) => s.status === "COMPLETED");
  const totalCompleted = completed.length;

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thisWeekCount = completed.filter((s) => s.created_at >= oneWeekAgo).length;

  const games = ["MEMORY_MATCH", "PICTURE_RECALL", "SEQUENCE"] as const;
  const gameStats = games.map((type) => {
    const typeSessions = completed.filter((s) => s.game_type === type);
    const count = typeSessions.length;

    const baselineSessions = typeSessions.slice(-5);
    const hasBaseline = baselineSessions.length >= 5;

    const avgBaselineAccuracy = hasBaseline
      ? Math.round(baselineSessions.reduce((acc, s) => acc + s.accuracy, 0) / baselineSessions.length)
      : null;

    const avgCurrentAccuracy =
      count > 0
        ? Math.round(typeSessions.slice(0, 5).reduce((acc, s) => acc + s.accuracy, 0) / Math.min(count, 5))
        : null;

    const avgDuration =
      count > 0 ? Math.round(typeSessions.reduce((acc, s) => acc + s.duration_seconds, 0) / count) : 0;

    return {
      gameType: type,
      totalSessions: count,
      hasBaseline,
      baselineAccuracy: avgBaselineAccuracy,
      currentAccuracy: avgCurrentAccuracy,
      avgDurationSeconds: avgDuration,
      recentSessions: typeSessions.slice(0, 5),
    };
  });

  return {
    totalCompleted,
    thisWeekCount,
    lastActive: completed[0]?.created_at || null,
    recentSessions: allSessions.slice(0, 10),
    gameStats,
  };
}
