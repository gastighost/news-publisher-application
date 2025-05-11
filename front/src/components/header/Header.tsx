import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Vancouver Times</div>
      <nav className={styles.nav}>
        <a href="#">Home</a>
        <a href="#">Crypto</a>
        <a href="#">Vancouver Today</a>
        <a href="#">Technologies</a>
        <a href="#">Health & Science</a>
      </nav>
      <button className={styles.signInButton}>Sign In</button>
    </header>
  );
};

export default Header;