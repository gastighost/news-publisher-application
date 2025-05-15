"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import styles from "./signin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faTelegram } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "../../../lib/auth/user_auth";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setLoginIdentifier("");
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage(null);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "signIn") {
        const success = await authApi.login(loginIdentifier, password);
        if (success) {
          setSuccessMessage("Login successful! Redirecting...");
          setError(null); // Good practice to clear previous errors
          // setTimeout(() => { // Temporarily comment out setTimeout
          router.push("/"); 
          // }, 1500);
        } else {
          setError("Invalid username/email or password.");
        }
      } else {
        const registrationResponse = await authApi.register(username, email, password);
        if (registrationResponse.success) {
          setSuccessMessage("Registration successful! Please sign in.");
          setActiveTab("signIn");
        } else {
          setError(registrationResponse.message || "Registration failed. Please try again.");
        }
      }
    } catch (err: any) {
      console.error(`Error during ${activeTab}:`, err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.authSection}>
          <article className={styles.formWrapper}>
            <div className={styles.formContainer}>
              <div className={styles.tabMenu}>
                <button
                  className={`${styles.tab} ${activeTab === "signIn" ? styles.active : ""}`}
                  onClick={() => setActiveTab("signIn")}
                  disabled={!!successMessage}
                >
                  Sign In
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "signUp" ? styles.active : ""}`}
                  onClick={() => setActiveTab("signUp")}
                  disabled={!!successMessage}
                >
                  Sign Up
                </button>
              </div>
              <div className={styles.formContent}>
                <div className={styles.avatar}>
                  <FontAwesomeIcon icon={faUser} size="3x" />
                </div>
                <form onSubmit={handleSubmit} className={styles.authForm}>
                  {activeTab === "signUp" && (
                    <>
                      <div className={styles.inputGroup}>
                        <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          disabled={!!successMessage}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                        <input
                          type="email"
                          placeholder="youremail@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={!!successMessage}
                        />
                      </div>
                    </>
                  )}
                  {activeTab === "signIn" && (
                    <div className={styles.inputGroup}>
                      <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                      <input
                        type="text"
                        placeholder="Username or Email"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                        disabled={!!successMessage}
                      />
                    </div>
                  )}
                  <div className={styles.inputGroup}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={!!successMessage}
                    />
                  </div>
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                  <button type="submit" className={styles.submitButton} disabled={!!successMessage}>
                    {activeTab === "signIn" ? "Sign In" : "Sign Up"}
                  </button>
                </form>
                <div className={styles.socialLogin}>
                  <p className={styles.socialLoginText}>
                    Or {activeTab === "signIn" ? "Sign In" : "Sign Up"} with
                  </p>
                  <div className={styles.socialIconsContainer}>
                    <Link
                      href="/api/auth/google"
                      className={`${styles.socialIcon} ${styles.google} ${successMessage ? styles.disabledLink : ""}`}
                    >
                      <FontAwesomeIcon icon={faGoogle} />
                    </Link>
                    <button
                      className={`${styles.socialIcon} ${styles.telegram} ${successMessage ? styles.disabledLink : ""}`}
                      disabled={!!successMessage}
                    >
                      <FontAwesomeIcon icon={faTelegram} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
