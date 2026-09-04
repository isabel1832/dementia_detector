import crypto from "node:crypto";
import { cookies } from "next/headers";

// Players who join with a caregiver-provided 6-digit access code have no
// email/password and no Supabase Auth account, so they can't use Supabase's
// session cookies. This is a small hand-rolled equivalent: an httpOnly
// cookie containing the player id plus an HMAC signature, so the server can
// trust it without a database lookup on every request.

const COOKIE_NAME = "player_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.PLAYER_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing PLAYER_SESSION_SECRET environment variable.");
  }
  return secret;
}

function sign(playerId: string): string {
  return crypto.createHmac("sha256", getSecret()).update(playerId).digest("hex");
}

function encode(playerId: string): string {
  return `${playerId}.${sign(playerId)}`;
}

function decode(value: string): string | null {
  const dotIndex = value.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const playerId = value.slice(0, dotIndex);
  const signature = value.slice(dotIndex + 1);
  const expected = sign(playerId);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }
  return playerId;
}

export async function setPlayerSessionCookie(playerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encode(playerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearPlayerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getPlayerIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decode(raw);
}
