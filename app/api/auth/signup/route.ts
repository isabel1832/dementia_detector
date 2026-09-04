import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are all required." },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Try creating user with Supabase Auth
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });
    } catch (err) {
      console.warn("Supabase auth signUp warning:", err);
    }

    const user = await createUser({
      name,
      email,
      password,
      role: role as "player" | "caregiver" | "professional",
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
