"use client";

import React from "react";
import Link from "next/link";
import Button from "@/global/components/base/Button"; // Import reusable Button component
import styles from "@/global/components/layout/hero.module.scss"; // Import SCSS styles

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1>Welcome to FixMobile</h1>
        <h2>Your Trusted Mobile Repair and Parts Shop</h2>
        <div className={styles.heroButtons}>
          <Button variant="primary" onClick={() => window.open("https://serviss.fixmobile.lv/", "_blank")}>
            Serviss
          </Button>
          <Link href="/shop">
            <Button variant="secondary">Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
