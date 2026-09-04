import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clearPlayerSessionCookie } from "@/lib/playerSession";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    await clearPlayerSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Failed to sign out." }, { status: 500 });
  }
}
