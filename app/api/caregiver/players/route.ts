import { NextResponse } from "next/server";
import { getPlayersForCaregiver, connectPlayerToCaregiver, createPlayer, getDb } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let caregiverId: string | undefined = searchParams.get("caregiverId") ?? undefined;

    if (!caregiverId) {
      try {
        const { data } = await supabase.from("profiles").select("id").eq("role", "caregiver").limit(1).maybeSingle();
        if (data?.id) caregiverId = data.id;
      } catch {
        // ignore
      }

      if (!caregiverId) {
        const db = getDb();
        const caregiver = db.prepare("SELECT id FROM users WHERE role = 'caregiver' LIMIT 1").get() as { id: string } | undefined;
        caregiverId = caregiver?.id;
      }
    }

    if (!caregiverId) {
      return NextResponse.json({ players: [] });
    }

    const players = await getPlayersForCaregiver(caregiverId);
    return NextResponse.json({ success: true, players });
  } catch (error: unknown) {
    console.error("Get caregiver players error:", error);
    return NextResponse.json({ error: "Failed to fetch caregiver players" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, caregiverId, accessCode, firstName, lastName, relationship } = body;

    let effectiveCaregiverId = caregiverId;
    if (!effectiveCaregiverId) {
      try {
        const { data } = await supabase.from("profiles").select("id").eq("role", "caregiver").limit(1).maybeSingle();
        if (data?.id) effectiveCaregiverId = data.id;
      } catch {
        // ignore
      }

      if (!effectiveCaregiverId) {
        const db = getDb();
        const caregiver = db.prepare("SELECT id FROM users WHERE role = 'caregiver' LIMIT 1").get() as { id: string } | undefined;
        effectiveCaregiverId = caregiver?.id;
      }
    }

    if (!effectiveCaregiverId) {
      return NextResponse.json({ error: "Caregiver ID is required." }, { status: 400 });
    }

    if (action === "create") {
      if (!firstName) {
        return NextResponse.json({ error: "First name is required." }, { status: 400 });
      }
      const newPlayer = await createPlayer({ firstName, lastName });
      await connectPlayerToCaregiver(effectiveCaregiverId, newPlayer.accessCode, relationship || "Family");
      return NextResponse.json({ success: true, player: newPlayer });
    }

    // Default: Connect existing player via accessCode
    if (!accessCode) {
      return NextResponse.json({ error: "Access code is required." }, { status: 400 });
    }

    const connected = await connectPlayerToCaregiver(effectiveCaregiverId, accessCode, relationship || "Family");
    return NextResponse.json({ success: true, player: connected });
  } catch (error: unknown) {
    console.error("Caregiver player action error:", error);
    const msg = error instanceof Error ? error.message : "Failed to connect player";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
