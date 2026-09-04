import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setPlayerSessionCookie } from "@/lib/playerSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = getSupabaseAdmin();

    // 1. Access Code Login (Player, no email/password account)
    if (body.accessCode) {
      const cleanCode = String(body.accessCode).replace(/\s+/g, "");
      const { data: player, error } = await admin
        .from("players")
        .select("id, first_name, last_name, access_code")
        .eq("access_code", cleanCode)
        .maybeSingle();

      if (error || !player) {
        return NextResponse.json(
          { error: "Access code not found. Please check your 6-digit code." },
          { status: 404 }
        );
      }

      await setPlayerSessionCookie(player.id);

      return NextResponse.json({
        success: true,
        user: {
          id: player.id,
          name: `${player.first_name} ${player.last_name || ""}`.trim(),
          role: "player",
          playerId: player.id,
          accessCode: player.access_code,
        },
      });
    }

    // 2. Email & Password Login (Caregiver / Professional / Player)
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("id, name, role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        { error: "Account is missing a profile. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        name: profile.name,
        email: data.user.email,
        role: profile.role,
      },
    });
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
