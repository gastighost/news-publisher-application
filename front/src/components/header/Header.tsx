import React from 'react';
import Link from 'next/link';
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>Vancouver Times</Link>
      <nav className={styles.nav}>
        <Link href="/category/crypto">Crypto</Link>
        <Link href="/category/vancouver-today">Vancouver Today</Link>
        <Link href="/category/technologies">Technologies</Link>
        <Link href="/category/health-science">Health & Science</Link>
      </nav>
      <Link href="/signin" className={styles.signInButton}>
        Sign In
      </Link>
    </header>
  );
};

export default Header;