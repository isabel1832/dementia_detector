import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getAuthenticatedProfileId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createUniqueAccessCode(): Promise<string> {
  const admin = getSupabaseAdmin();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateAccessCode();
    const { data } = await admin.from("players").select("id").eq("access_code", code).maybeSingle();
    if (!data) return code;
  }
  throw new Error("Could not generate a unique access code. Please try again.");
}

export async function GET() {
  try {
    const caregiverId = await getAuthenticatedProfileId();
    if (!caregiverId) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("caregiver_connections")
      .select("relationship, created_at, players(id, first_name, last_name, access_code)")
      .eq("caregiver_id", caregiverId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const players = (data || [])
      .filter((row) => row.players)
      .map((row) => {
        const player = row.players as unknown as {
          id: string;
          first_name: string;
          last_name: string | null;
          access_code: string;
        };
        return {
          id: player.id,
          first_name: player.first_name,
          last_name: player.last_name,
          access_code: player.access_code,
          relationship: row.relationship,
          connected_at: row.created_at,
        };
      });

    return NextResponse.json({ success: true, players });
  } catch (error: unknown) {
    console.error("Get caregiver players error:", error);
    return NextResponse.json({ error: "Failed to fetch caregiver players" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const caregiverId = await getAuthenticatedProfileId();
    if (!caregiverId) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const body = await req.json();
    const { action, accessCode, firstName, lastName, relationship } = body;
    const admin = getSupabaseAdmin();

    if (action === "create") {
      if (!firstName) {
        return NextResponse.json({ error: "First name is required." }, { status: 400 });
      }

      const newAccessCode = await createUniqueAccessCode();
      const { data: newPlayer, error: insertError } = await admin
        .from("players")
        .insert({ first_name: firstName, last_name: lastName || null, access_code: newAccessCode })
        .select("id, first_name, last_name, access_code")
        .single();

      if (insertError) throw insertError;

      const { error: connectError } = await admin
        .from("caregiver_connections")
        .insert({ caregiver_id: caregiverId, player_id: newPlayer.id, relationship: relationship || "Family" });

      if (connectError) throw connectError;

      return NextResponse.json({
        success: true,
        player: {
          id: newPlayer.id,
          firstName: newPlayer.first_name,
          lastName: newPlayer.last_name,
          accessCode: newPlayer.access_code,
        },
      });
    }

    // Default: connect to an existing player via access code
    if (!accessCode) {
      return NextResponse.json({ error: "Access code is required." }, { status: 400 });
    }

    const cleanCode = String(accessCode).replace(/\s+/g, "");
    const { data: player, error: findError } = await admin
      .from("players")
      .select("id, first_name, last_name, access_code")
      .eq("access_code", cleanCode)
      .maybeSingle();

    if (findError || !player) {
      return NextResponse.json(
        { error: "Invalid access code. Please verify the 6-digit code with the player." },
        { status: 404 }
      );
    }

    const { error: connectError } = await admin
      .from("caregiver_connections")
      .upsert(
        { caregiver_id: caregiverId, player_id: player.id, relationship: relationship || "Family" },
        { onConflict: "caregiver_id,player_id" }
      );

    if (connectError) throw connectError;

    return NextResponse.json({ success: true, player });
  } catch (error: unknown) {
    console.error("Caregiver player action error:", error);
    const msg = error instanceof Error ? error.message : "Failed to connect player";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
