'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import useAuthStatus from "@/hooks/useAuthStatus";
import UserControls from "@/global/components/UserControls";
import styles from "@/global/styles/Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const { isAdmin } = useAuthStatus();

  const user = useSelector((state) => state.auth.user);
  console.log("Redux user:", user);
  console.log("Header - isAdmin:", isAdmin);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/fixmobile_logo.svg"
              alt="FixMobile Logo"
              width={120}
              height={40}
              priority
            />
          </Link>

          <nav className={styles.nav}>
            <a
              href="https://serviss.fixmobile.lv/"
              className={styles.navLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Serviss
            </a>
            <Link
              href="/shop"
              className={`${styles.navLink} ${pathname === "/shop" ? styles.active : ""}`}
            >
              Shop
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`${styles.navLink} ${pathname === "/admin" ? styles.active : ""}`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <UserControls />
      </div>
    </header>
  );
}
