import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPlayerIdFromSession } from "@/lib/playerSession";
import { recordGameSession, getPlayerAnalytics } from "@/lib/analytics";

// Returns the caregiver/professional's profile id if this is a caregiver
// session, or null otherwise.
async function getCaregiverId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function caregiverCanViewPlayer(caregiverId: string, playerId: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("caregiver_connections")
    .select("id")
    .eq("caregiver_id", caregiverId)
    .eq("player_id", playerId)
    .maybeSingle();
  return !!data;
}

export async function POST(req: Request) {
  try {
    // Only the player themselves may record their own game session - the
    // player id always comes from their signed session cookie, never from
    // the request body, so a game can't be recorded against someone else.
    const playerId = await getPlayerIdFromSession();
    if (!playerId) {
      return NextResponse.json({ error: "Not signed in as a player." }, { status: 401 });
    }

    const body = await req.json();
    const session = await recordGameSession({
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
    return NextResponse.json({ error: "Failed to record game session." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedPlayerId = searchParams.get("playerId") ?? undefined;

    // A logged-in player can only ever see their own analytics.
    const ownPlayerId = await getPlayerIdFromSession();
    if (ownPlayerId) {
      const analytics = await getPlayerAnalytics(ownPlayerId);
      return NextResponse.json({ success: true, analytics });
    }

    // A caregiver/professional must specify which connected player to view,
    // and can only view players actually connected to their account.
    const caregiverId = await getCaregiverId();
    if (caregiverId) {
      if (!requestedPlayerId) {
        return NextResponse.json({ error: "playerId is required." }, { status: 400 });
      }
      const allowed = await caregiverCanViewPlayer(caregiverId, requestedPlayerId);
      if (!allowed) {
        return NextResponse.json({ error: "Player not found." }, { status: 404 });
      }
      const analytics = await getPlayerAnalytics(requestedPlayerId);
      return NextResponse.json({ success: true, analytics });
    }

    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
