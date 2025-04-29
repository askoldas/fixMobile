"use client";

import "./globals.scss";
import styles from "./layout.module.scss"; // Import the SCSS file
import ReduxProvider from "../store/ReduxProvider";
import Header from "@/global/components/Header"; // Import Header Component
import AuthModal from "@/global/components/Auth/AuthModal";
import { metadata } from "./metadata";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <AuthModal /> {/* Add modal here */}
        </ReduxProvider>
      </body>
    </html>
  );
}
