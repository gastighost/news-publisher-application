"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [authData, setAuthData] = useState({ isAuthenticated: false, username: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        console.log("Checking authentication status...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/status`,
          {
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json"
            }
          }
        );

        console.log("Auth status response:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Auth data received:", data);

          const isAuthenticated = data.authenticated === true && data.user && data.user.id;
          const username = data.user?.username || "";

          console.log(`Authentication status: ${isAuthenticated}, Username: ${username}`);

          setAuthData({
            isAuthenticated,
            username
          });
        } else {
          console.log("Auth status response not ok, setting unauthenticated state");
          setAuthData({ isAuthenticated: false, username: "" });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthData({ isAuthenticated: false, username: "" });
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
    window.addEventListener("focus", checkAuthStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkAuthStatus);
    };
  }, []);

  const handleProfileClick = (e: any) => {
    if (!authData.isAuthenticated || !authData.username) {
      console.log("User appears to be unauthenticated. Preventing navigation and redirecting to signin.");
      e.preventDefault();
      window.location.href = "/signin";
    } else {
      console.log("User authenticated, proceeding to profile page:", authData);
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Vancouver Times
      </Link>
      <nav className={styles.nav}>
        <Link href="/category/crypto">Crypto</Link>
        <Link href="/category/vancouver-today">Vancouver Today</Link>
        <Link href="/category/technologies">Technologies</Link>
        <Link href="/category/health-science">Health & Science</Link>
      </nav>

      {loading ? (
        <div className={styles.signInButton}>Loading...</div>
      ) : authData.isAuthenticated && authData.username ? (
        <Link
          href={`/user/${authData.username}/profile`}
          className={styles.signInButton}
          onClick={handleProfileClick}
        >
          Profile
        </Link>
      ) : (
        <Link href="/signin" className={styles.signInButton}>
          Sign In
        </Link>
      )}
    </header>
  );
}
