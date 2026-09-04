import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

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
  const checkHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(checkHash, "hex"));
}

// User Helpers
export function createUser(params: {
  name: string;
  email: string;
  password: string;
  role: "player" | "caregiver" | "professional";
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  const { hash, salt } = hashPassword(params.password);
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, salt, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, params.name, params.email.toLowerCase().trim(), hash, salt, params.role, now);

  // If registering as a player, automatically create a linked player profile
  if (params.role === "player") {
    createPlayer({
      firstName: params.name,
      userId: id,
    });
  }

  return { id, name: params.name, email: params.email, role: params.role };
}

export function findUserByEmail(email: string) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const row = stmt.get(email.toLowerCase().trim()) as {
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

export function findUserById(id: string) {
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

// Player Helpers
export function createPlayer(params: {
  firstName: string;
  lastName?: string;
  userId?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  // 6-digit access code formatted as e.g. 482731
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO players (id, user_id, first_name, last_name, access_code, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, params.userId || null, params.firstName, params.lastName || null, accessCode, now);

  return { id, firstName: params.firstName, lastName: params.lastName, accessCode };
}

export function findPlayerByAccessCode(code: string) {
  const db = getDb();
  const cleanCode = code.replace(/\s+/g, "");
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

export function findPlayerById(id: string) {
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

export function getPlayersForCaregiver(caregiverId: string) {
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

export function connectPlayerToCaregiver(caregiverId: string, accessCode: string, relationship = "Family") {
  const player = findPlayerByAccessCode(accessCode);
  if (!player) {
    throw new Error("Invalid access code. Please verify the 6-digit code with the player.");
  }

  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO caregiver_connections (id, caregiver_id, player_id, relationship, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, caregiverId, player.id, relationship, now);

  return player;
}

export function disconnectPlayerFromCaregiver(caregiverId: string, playerId: string) {
  const db = getDb();
  const stmt = db.prepare(`
    DELETE FROM caregiver_connections WHERE caregiver_id = ? AND player_id = ?
  `);
  stmt.run(caregiverId, playerId);
}

// Session Tracking
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

export function recordGameSession(input: GameSessionInput) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const calculatedScore = input.score ?? Math.max(0, 100 - (input.attempts || 1) * 2 - (input.hintsUsed || 0) * 5);
  const accuracy = input.accuracy ?? 100;
  const attempts = input.attempts ?? 1;
  const hintsUsed = input.hintsUsed ?? 0;
  const errors = input.errors ?? 0;
  const status = input.status ?? "COMPLETED";

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

export function getPlayerSessions(playerId: string, gameType?: string, limit = 50): SessionRow[] {
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
export function getPlayerAnalytics(playerId: string) {
  const db = getDb();
  const allSessions: SessionRow[] = getPlayerSessions(playerId, undefined, 100);

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

    // Baseline: first 5 completed sessions
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
