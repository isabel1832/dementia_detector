import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPlayerIdFromSession } from "@/lib/playerSession";

export async function GET() {
  try {
    const admin = getSupabaseAdmin();

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id, name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        return NextResponse.json({
          success: true,
          user: { id: profile.id, name: profile.name, email: user.email, role: profile.role },
        });
      }
    }

    const playerId = await getPlayerIdFromSession();
    if (playerId) {
      const { data: player } = await admin
        .from("players")
        .select("id, first_name, last_name")
        .eq("id", playerId)
        .maybeSingle();

      if (player) {
        return NextResponse.json({
          success: true,
          user: {
            id: player.id,
            name: `${player.first_name} ${player.last_name || ""}`.trim(),
            role: "player",
            playerId: player.id,
          },
        });
      }
    }

    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  } catch (error: unknown) {
    console.error("Me API error:", error);
    return NextResponse.json({ error: "Failed to load current user." }, { status: 500 });
  }
}
