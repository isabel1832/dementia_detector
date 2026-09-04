import { getDb, createUser, createPlayer, connectPlayerToCaregiver } from "./db";

export async function seedDatabase() {
  const db = getDb();

  // Check if users already seeded
  const check = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
  if (check && check.count > 0) {
    return { message: "Database already seeded." };
  }

  // 1. Create Caregiver User
  const caregiver = await createUser({
    name: "Eleanor Vance",
    email: "caregiver@example.com",
    password: "password123",
    role: "caregiver",
  });

  // 2. Create Professional / Clinician User
  const clinician = await createUser({
    name: "Dr. Evelyn Reed",
    email: "doctor@example.com",
    password: "password123",
    role: "professional",
  });

  // 3. Create Demo Players
  const player1 = await createPlayer({ firstName: "Sarah", lastName: "Lee" });
  const player2 = await createPlayer({ firstName: "Robert", lastName: "Davis" });
  const player3 = await createPlayer({ firstName: "Maria", lastName: "Garcia" });

  // 4. Connect players to caregiver & clinician
  await connectPlayerToCaregiver(caregiver.id, player1.accessCode, "Mother");
  await connectPlayerToCaregiver(caregiver.id, player2.accessCode, "Father");
  await connectPlayerToCaregiver(caregiver.id, player3.accessCode, "Aunt");

  await connectPlayerToCaregiver(clinician.id, player1.accessCode, "Patient");
  await connectPlayerToCaregiver(clinician.id, player2.accessCode, "Patient");
  await connectPlayerToCaregiver(clinician.id, player3.accessCode, "Patient");

  // 5. Seed realistic historical sessions for Sarah Lee (18 sessions across 30 days)
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const games = ["MEMORY_MATCH", "PICTURE_RECALL", "SEQUENCE"] as const;
  const difficulties = ["easy", "medium", "hard"] as const;

  for (let i = 18; i >= 1; i--) {
    const daysAgo = Math.floor(i * 1.5);
    const sessionTime = new Date(now - daysAgo * DAY_MS);
    const gameType = games[i % games.length];
    const diff = i > 6 ? (i > 14 ? "hard" : "medium") : "easy";

    // Realistic accuracy with slight natural variation
    const baseAcc = gameType === "MEMORY_MATCH" ? 85 : gameType === "PICTURE_RECALL" ? 90 : 80;
    const accuracy = Math.min(100, Math.max(60, baseAcc + (Math.sin(i) * 10)));
    const duration = 120 + Math.floor(Math.random() * 90);

    const dbHandle = getDb();
    const stmt = dbHandle.prepare(`
      INSERT INTO game_sessions (
        id, player_id, game_type, difficulty, duration_seconds,
        score, accuracy, attempts, hints_used, errors, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      `seed-session-${i}`,
      player1.id,
      gameType,
      diff,
      duration,
      accuracy,
      Math.round(accuracy),
      diff === "easy" ? 4 : diff === "medium" ? 7 : 11,
      i % 4 === 0 ? 1 : 0,
      i % 5 === 0 ? 1 : 0,
      "COMPLETED",
      sessionTime.toISOString()
    );
  }

  // Seed 8 sessions for Robert Davis
  for (let i = 8; i >= 1; i--) {
    const daysAgo = i * 2;
    const sessionTime = new Date(now - daysAgo * DAY_MS);
    const gameType = games[i % games.length];

    const stmt = db.prepare(`
      INSERT INTO game_sessions (
        id, player_id, game_type, difficulty, duration_seconds,
        score, accuracy, attempts, hints_used, errors, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      `seed-session-robert-${i}`,
      player2.id,
      gameType,
      "medium",
      160,
      88,
      88,
      6,
      0,
      1,
      "COMPLETED",
      sessionTime.toISOString()
    );
  }

  return {
    message: "Seed data successfully created.",
    caregiver: "caregiver@example.com / password123",
    clinician: "doctor@example.com / password123",
    sampleCode: player1.accessCode,
  };
}

// Auto seed on import if empty
seedDatabase().catch((e) => {
  console.error("Seed error:", e);
});
