import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserControls from "@/global/components/UserControls"; // Import UserControls
import styles from "@/global/styles/Header.module.scss";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/fixmobile_logo.svg" alt="FixMobile Logo" width={120} height={40} priority/>
                </Link>

                {/* Navigation Links */}
                <nav className={styles.nav}>
                    {/* External link for Serviss (opens in new tab) */}
                    <a href="https://serviss.fixmobile.lv/" className={styles.navLink} target="_blank" rel="noopener noreferrer">
                        Serviss
                    </a>

                    {/* Internal Next.js Links */}
                    <Link href="/shop" className={styles.navLink}>Shop</Link>

                    {/* External Links for About & Contacts */}
                    {/* <a href="https://serviss.fixmobile.lv/about/" className={styles.navLink} target="_blank" rel="noopener noreferrer">
                        About
                    </a>
                    <a href="https://serviss.fixmobile.lv/contact/" className={styles.navLink} target="_blank" rel="noopener noreferrer">
                        Contacts
                    </a> */}

                    {/* Admin Panel Link */}
                    <Link href="/admin" className={styles.navLink}>Admin</Link>
                </nav>


                {/* User Controls (Contact Us, Cart, User) */}
                <UserControls />
            </div>
        </header>
    );
}
