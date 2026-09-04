import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, findPlayerByAccessCode } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Access Code Login (Player)
    if (body.accessCode) {
      const player = findPlayerByAccessCode(body.accessCode);
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

    const user = findUserByEmail(email);
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
