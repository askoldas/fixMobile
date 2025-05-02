"use client";

import React, { useEffect } from "react";
import "./globals.scss";
import styles from "./layout.module.scss";
import ReduxProvider from "../store/ReduxProvider";
import Header from "@/global/components/Header";
import AuthModal from "@/global/components/Auth/AuthModal";
import Cart from "@/global/components/Cart";
import { metadata } from "./metadata";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "@/store/slices/cartSlice";

function CartPersistence() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch(setCart(parsed));
      } catch (e) {
        console.warn("Failed to parse cart:", e);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return null;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="antialiased">
        <ReduxProvider>
          <Header />
          <main className={styles.mainContent}>{children}</main>
          <Cart />
          <CartPersistence />
          <AuthModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
