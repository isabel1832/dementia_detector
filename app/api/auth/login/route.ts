import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, findPlayerByAccessCode } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Access Code Login (Player)
    if (body.accessCode) {
      const player = await findPlayerByAccessCode(body.accessCode);
      if (!player) {
        return NextResponse.json(
          { error: "Access code not found. Please check your 6-digit code." },
          { status: 404 }
        );
      }
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

    // Try Supabase Auth first
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData?.user) {
        const userProfile = await findUserByEmail(email);
        return NextResponse.json({
          success: true,
          user: {
            id: authData.user.id,
            name: userProfile?.name || authData.user.user_metadata?.name || email.split("@")[0],
            email: authData.user.email,
            role: userProfile?.role || authData.user.user_metadata?.role || "caregiver",
          },
          session: authData.session,
        });
      }
    } catch {
      // Fallback to local DB verification
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
