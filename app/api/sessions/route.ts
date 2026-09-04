import { NextResponse } from "next/server";
import { recordGameSession, getPlayerSessions, getPlayerAnalytics, getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Default to the first demo player Sarah if playerId isn't passed
    let playerId = body.playerId;
    if (!playerId) {
      const db = getDb();
      const firstPlayer = db.prepare("SELECT id FROM players LIMIT 1").get() as { id: string } | undefined;
      playerId = firstPlayer?.id;
    }

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required." }, { status: 400 });
    }

    const session = recordGameSession({
      playerId,
      gameType: body.gameType,
      difficulty: body.difficulty || "medium",
      durationSeconds: body.durationSeconds || 60,
      score: body.score,
      accuracy: body.accuracy,
      attempts: body.attempts,
      hintsUsed: body.hintsUsed,
      errors: body.errors,
      status: body.status || "COMPLETED",
    });

    return NextResponse.json({ success: true, session });
  } catch (error: unknown) {
    console.error("Save session error:", error);
    return NextResponse.json(
      { error: "Failed to record game session." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let playerId: string | undefined = searchParams.get("playerId") ?? undefined;

    if (!playerId) {
      const db = getDb();
      const firstPlayer = db.prepare("SELECT id FROM players LIMIT 1").get() as { id: string } | undefined;
      playerId = firstPlayer?.id;
    }

    if (!playerId) {
      return NextResponse.json({ error: "No players found" }, { status: 404 });
    }

    const analytics = getPlayerAnalytics(playerId);
    return NextResponse.json({ success: true, analytics });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
