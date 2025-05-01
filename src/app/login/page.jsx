"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(openAuthModal("login")); // Open login modal immediately

    // Optional: redirect after modal closes, depends how you manage modals
  }, [dispatch]);

  return <div>Redirecting...</div>; // Or even just empty
}
