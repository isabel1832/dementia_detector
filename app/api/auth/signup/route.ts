import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createUniquePlayerAccessCode(): Promise<string> {
  const admin = getSupabaseAdmin();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateAccessCode();
    const { data } = await admin
      .from("players")
      .select("id")
      .eq("access_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error("Could not generate a unique access code. Please try again.");
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are all required." },
        { status: 400 }
      );
    }

    if (!["player", "caregiver", "professional"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });

    if (error) {
      const isDuplicate = error.message.toLowerCase().includes("already registered");
      const message = isDuplicate ? "An account with this email already exists." : error.message;
      return NextResponse.json({ error: message }, { status: isDuplicate ? 409 : error.status || 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "An unexpected error occurred during signup." },
        { status: 500 }
      );
    }

    // The on_auth_user_created trigger creates the profiles row. If this
    // account is a player, also give it a player profile + access code so
    // it behaves the same as a caregiver-created player.
    if (role === "player") {
      const admin = getSupabaseAdmin();
      const accessCode = await createUniquePlayerAccessCode();
      await admin.from("players").insert({
        user_id: data.user.id,
        first_name: name,
        access_code: accessCode,
      });
    }

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, name, email, role },
      // If Supabase Auth requires email confirmation, there is no session
      // yet even though the account was created.
      emailConfirmationRequired: !data.session,
    });
  } catch (error: unknown) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
