"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStatus from "@/hooks/useAuthStatus";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isLoggedIn, isAdmin, loading } = useAuthStatus();

  useEffect(() => {
    if (loading) return; // ⏳ Wait until auth is resolved

    if (!isLoggedIn) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/shop");
    }
  }, [loading, isLoggedIn, isAdmin, router]);

  if (loading || !isLoggedIn || !isAdmin) {
    return <div>Loading...</div>;
  }

  return children;
}
