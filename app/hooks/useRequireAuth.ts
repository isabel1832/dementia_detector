"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CurrentUser {
  id: string;
  name: string;
  role: "player" | "caregiver" | "professional";
}

// Redirects away from a protected page if the visitor isn't signed in as one
// of `allowedRoles`. Returns the current user once known (null while
// checking or if redirecting).
export function useRequireAuth(allowedRoles: Array<CurrentUser["role"]>) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.ok ? await res.json() : null;
        const currentUser: CurrentUser | undefined = data?.user;

        if (cancelled) return;

        if (!currentUser || !allowedRoles.includes(currentUser.role)) {
          router.replace(allowedRoles.includes("player") ? "/access-code" : "/login");
          return;
        }

        setUser(currentUser);
      } catch {
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isChecking };
}
