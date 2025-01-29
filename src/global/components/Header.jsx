import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/global/components/Button";
import styles from "@/global/styles/Header.module.scss";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/fixmobile_logo.svg" alt="FixMobile Logo" width={120} height={40} />
                </Link>


                {/* Navigation Links */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                    <Link href="/services" className={styles.navLink}>Services</Link>
                    <Link href="/works" className={styles.navLink}>Works</Link>
                </nav>


                {/* Call-to-Action Button */}
                <Button variant="primary">Contact Us</Button>
            </div>
        </header>
    );
}
