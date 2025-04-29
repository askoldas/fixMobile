"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStatus from "@/hooks/useAuthStatus"; // Use our hook

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isLoggedIn, isAdmin, user } = useAuthStatus();

  useEffect(() => {
    // Wait until user is resolved
    if (user === null) return;

    if (!isLoggedIn) {
      router.replace("/login"); // Or wherever your login modal/route is
    } else if (!isAdmin) {
      router.replace("/shop"); // Redirect non-admins to a safe page
    }
  }, [isLoggedIn, isAdmin, user, router]);

  if (!user || !isLoggedIn || !isAdmin) {
    return <div>Loading...</div>;
  }

  return children;
}
