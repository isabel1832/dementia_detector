import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { supabase } from "./supabase";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "memory_app.sqlite");

// Ensure data folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    initializeTables(dbInstance);
  }
  return dbInstance;
}

function initializeTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('player', 'caregiver', 'professional')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT,
      access_code TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS caregiver_connections (
      id TEXT PRIMARY KEY,
      caregiver_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      relationship TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(caregiver_id, player_id),
      FOREIGN KEY(caregiver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      score INTEGER NOT NULL,
      accuracy INTEGER NOT NULL,
      attempts INTEGER NOT NULL,
      hints_used INTEGER NOT NULL DEFAULT 0,
      errors INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS player_settings (
      player_id TEXT PRIMARY KEY,
      text_size TEXT DEFAULT 'standard',
      contrast TEXT DEFAULT 'standard',
      sound_effects INTEGER DEFAULT 1,
      music INTEGER DEFAULT 0,
      voice_instructions INTEGER DEFAULT 1,
      repeat_instructions INTEGER DEFAULT 1,
      voice_speed TEXT DEFAULT 'normal',
      reduced_motion INTEGER DEFAULT 0,
      FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE
    );
  `);
}

// Password hashing using node:crypto
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const checkHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(checkHash, "hex"));
  } catch {
    return false;
  }
}

// User Helpers (Supabase-first with SQLite fallback)
export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role: "player" | "caregiver" | "professional";
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  const { hash, salt } = hashPassword(params.password);
  const now = new Date().toISOString();
  const normalizedEmail = params.email.toLowerCase().trim();

  // 1. Try Supabase profiles
  try {
    const { error } = await supabase.from("profiles").insert({
      id,
      name: params.name,
      email: normalizedEmail,
      role: params.role,
      created_at: now,
    });
    if (error && error.code !== "PGRST205") {
      console.warn("Supabase profile insert notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase profile insert skipped:", err);
  }

  // 2. Also save to local SQLite for reliability
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, params.name, normalizedEmail, hash, salt, params.role, now);
  } catch (e) {
    console.warn("SQLite user save warning:", e);
  }

  // If registering as a player, automatically create a linked player profile
  if (params.role === "player") {
    await createPlayer({
      firstName: params.name,
      userId: id,
    });
  }

  return { id, name: params.name, email: params.email, role: params.role };
}

export async function findUserByEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!error && data) {
      // Find password info from local store
      const db = getDb();
      const localUser = db.prepare("SELECT password_hash, salt FROM users WHERE email = ?").get(cleanEmail) as { password_hash: string; salt: string } | undefined;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        password_hash: localUser?.password_hash || "",
        salt: localUser?.salt || "",
        role: data.role as "player" | "caregiver" | "professional",
        created_at: data.created_at,
      };
    }
  } catch {
    // Fallback to SQLite
  }

  // 2. SQLite fallback
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const row = stmt.get(cleanEmail) as {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    salt: string;
    role: "player" | "caregiver" | "professional";
    created_at: string;
  } | undefined;
  return row;
}

export async function findUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as {
        id: string;
        name: string;
        email: string;
        role: "player" | "caregiver" | "professional";
        created_at: string;
      };
    }
  } catch {
    // Fallback
  }

  const db = getDb();
  const stmt = db.prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
  return stmt.get(id) as {
    id: string;
    name: string;
    email: string;
    role: "player" | "caregiver" | "professional";
    created_at: string;
  } | undefined;
}

// Player Helpers (Supabase-first)
export async function createPlayer(params: {
  firstName: string;
  lastName?: string;
  userId?: string;
}) {
  const id = crypto.randomUUID();
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date().toISOString();

  // 1. Save to Supabase
  try {
    const { error } = await supabase.from("players").insert({
      id,
      user_id: params.userId || null,
      first_name: params.firstName,
      last_name: params.lastName || null,
      access_code: accessCode,
      created_at: now,
    });
    if (error && error.code !== "PGRST205") {
      console.warn("Supabase createPlayer warning:", error.message);
    }
  } catch (err) {
    console.warn("Supabase createPlayer skipped:", err);
  }

  // 2. Save to SQLite
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO players (id, user_id, first_name, last_name, access_code, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, params.userId || null, params.firstName, params.lastName || null, accessCode, now);
  } catch (err) {
    console.warn("SQLite createPlayer warning:", err);
  }

  return { id, firstName: params.firstName, lastName: params.lastName, accessCode };
}

export async function findPlayerByAccessCode(code: string) {
  const cleanCode = code.replace(/\s+/g, "");

  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("access_code", cleanCode)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        access_code: data.access_code,
        created_at: data.created_at,
      };
    }
  } catch {
    // fallback
  }

  // 2. SQLite fallback
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM players WHERE access_code = ?");
  return stmt.get(cleanCode) as {
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string | null;
    access_code: string;
    created_at: string;
  } | undefined;
}

export async function findPlayerById(id: string) {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        access_code: data.access_code,
        created_at: data.created_at,
      };
    }
  } catch {
    // fallback
  }

  const db = getDb();
  const stmt = db.prepare("SELECT * FROM players WHERE id = ?");
  return stmt.get(id) as {
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string | null;
    access_code: string;
    created_at: string;
  } | undefined;
}

export async function getPlayersForCaregiver(caregiverId: string) {
  // 1. Try Supabase
  try {
    const { data: connections, error } = await supabase
      .from("caregiver_connections")
      .select("player_id, relationship, created_at")
      .eq("caregiver_id", caregiverId);

    if (!error && connections && connections.length > 0) {
      const playerIds = connections.map((c) => c.player_id);
      const { data: playersData } = await supabase
        .from("players")
        .select("*")
        .in("id", playerIds);

      if (playersData) {
        return playersData.map((p) => {
          const conn = connections.find((c) => c.player_id === p.id);
          return {
            id: p.id,
            user_id: p.user_id,
            first_name: p.first_name,
            last_name: p.last_name,
            access_code: p.access_code,
            relationship: conn?.relationship || "Family",
            connected_at: conn?.created_at || p.created_at,
          };
        });
      }
    }
  } catch {
    // fallback
  }

  // 2. SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    SELECT p.*, cc.relationship, cc.created_at as connected_at
    FROM players p
    JOIN caregiver_connections cc ON cc.player_id = p.id
    WHERE cc.caregiver_id = ?
    ORDER BY p.first_name ASC
  `);
  return stmt.all(caregiverId) as Array<{
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string | null;
    access_code: string;
    relationship: string | null;
    connected_at: string;
  }>;
}

export async function connectPlayerToCaregiver(caregiverId: string, accessCode: string, relationship = "Family") {
  const player = await findPlayerByAccessCode(accessCode);
  if (!player) {
    throw new Error("Invalid access code. Please verify the 6-digit code with the player.");
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // 1. Try Supabase
  try {
    await supabase.from("caregiver_connections").upsert({
      id,
      caregiver_id: caregiverId,
      player_id: player.id,
      relationship,
      created_at: now,
    });
  } catch (err) {
    console.warn("Supabase connectPlayer warning:", err);
  }

  // 2. SQLite
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO caregiver_connections (id, caregiver_id, player_id, relationship, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, caregiverId, player.id, relationship, now);
  } catch (err) {
    console.warn("SQLite connectPlayer warning:", err);
  }

  return player;
}

export async function disconnectPlayerFromCaregiver(caregiverId: string, playerId: string) {
  try {
    await supabase
      .from("caregiver_connections")
      .delete()
      .eq("caregiver_id", caregiverId)
      .eq("player_id", playerId);
  } catch (e) {
    console.warn("Supabase disconnect warning:", e);
  }

  const db = getDb();
  const stmt = db.prepare(`
    DELETE FROM caregiver_connections WHERE caregiver_id = ? AND player_id = ?
  `);
  stmt.run(caregiverId, playerId);
}

// Session Tracking (Supabase-first)
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
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const calculatedScore = input.score ?? Math.max(0, 100 - (input.attempts || 1) * 2 - (input.hintsUsed || 0) * 5);
  const accuracy = input.accuracy ?? 100;
  const attempts = input.attempts ?? 1;
  const hintsUsed = input.hintsUsed ?? 0;
  const errors = input.errors ?? 0;
  const status = input.status ?? "COMPLETED";

  // 1. Save to Supabase
  try {
    const { error } = await supabase.from("game_sessions").insert({
      id,
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
      created_at: now,
    });
    if (error && error.code !== "PGRST205") {
      console.warn("Supabase recordGameSession notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase recordGameSession skipped:", err);
  }

  // 2. Save to SQLite
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO game_sessions (
        id, player_id, game_type, difficulty, duration_seconds,
        score, accuracy, attempts, hints_used, errors, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      input.playerId,
      input.gameType,
      input.difficulty,
      input.durationSeconds,
      calculatedScore,
      accuracy,
      attempts,
      hintsUsed,
      errors,
      status,
      now
    );
  } catch (err) {
    console.warn("SQLite recordGameSession warning:", err);
  }

  return { id, ...input, score: calculatedScore, createdAt: now };
}

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

export async function getPlayerSessions(playerId: string, gameType?: string, limit = 50): Promise<SessionRow[]> {
  // 1. Try Supabase
  try {
    let query = supabase
      .from("game_sessions")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (gameType) {
      query = query.eq("game_type", gameType);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as SessionRow[];
    }
  } catch {
    // fallback
  }

  // 2. SQLite fallback
  const db = getDb();
  if (gameType) {
    const stmt = db.prepare(`
      SELECT * FROM game_sessions
      WHERE player_id = ? AND game_type = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(playerId, gameType, limit) as unknown as SessionRow[];
  }

  const stmt = db.prepare(`
    SELECT * FROM game_sessions
    WHERE player_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(playerId, limit) as unknown as SessionRow[];
}

// Detailed Player Analytics (Baseline after 5 valid sessions)
export async function getPlayerAnalytics(playerId: string) {
  const allSessions: SessionRow[] = await getPlayerSessions(playerId, undefined, 100);

  const completed = allSessions.filter((s) => s.status === "COMPLETED");
  const totalCompleted = completed.length;

  // Calculate this week count
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thisWeekCount = completed.filter((s) => s.created_at >= oneWeekAgo).length;

  // Group by game type
  const games = ["MEMORY_MATCH", "PICTURE_RECALL", "SEQUENCE"] as const;
  const gameStats = games.map((type) => {
    const typeSessions = completed.filter((s) => s.game_type === type);
    const count = typeSessions.length;

    // Baseline: first 5 completed sessions (chronologically earliest)
    const baselineSessions = typeSessions.slice(-5);
    const hasBaseline = baselineSessions.length >= 5;

    const avgBaselineAccuracy = hasBaseline
      ? Math.round(baselineSessions.reduce((acc, s) => acc + s.accuracy, 0) / baselineSessions.length)
      : null;

    const avgCurrentAccuracy = count > 0
      ? Math.round(typeSessions.slice(0, 5).reduce((acc, s) => acc + s.accuracy, 0) / Math.min(count, 5))
      : null;

    const avgDuration = count > 0
      ? Math.round(typeSessions.reduce((acc, s) => acc + s.duration_seconds, 0) / count)
      : 0;

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
