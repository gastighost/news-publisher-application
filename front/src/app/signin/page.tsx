"use client"

import React, { useState } from "react"
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer"
import styles from "./signin.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faTelegram } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn")
  const googleSignInUrl = "/api/auth/google"

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
                >
                  Sign In
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "signUp" ? styles.active : ""}`}
                  onClick={() => setActiveTab("signUp")}
                >
                  Sign Up
                </button>
              </div>
              <div className={styles.formContent}>
                <div className={styles.avatar}>
                  <FontAwesomeIcon icon={faUser} size="3x" />
                </div>
                <form onSubmit={(e) => e.preventDefault()} className={styles.authForm}>
                  {activeTab === "signUp" && (
                    <div className={styles.inputGroup}>
                      <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                      <input type="text" placeholder="Username" required />
                    </div>
                  )}
                  <div className={styles.inputGroup}>
                    <FontAwesomeIcon
                      icon={activeTab === "signIn" ? faUser : faEnvelope}
                      className={styles.inputIcon}
                    />
                    <input
                      type={activeTab === "signIn" ? "text" : "email"}
                      placeholder={activeTab === "signIn" ? "Username or Email" : "youremail@gmail.com"}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input type="password" placeholder="********" required />
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    {activeTab === "signIn" ? "Sign In" : "Sign Up"}
                  </button>
                </form>
                <div className={styles.socialLogin}>
                  <p className={styles.socialLoginText}>
                    Or {activeTab === "signIn" ? "Sign In" : "Sign Up"} with
                  </p>
                  <div className={styles.socialIconsContainer}>
                    <Link href={googleSignInUrl} className={`${styles.socialIcon} ${styles.google}`}>
                      <FontAwesomeIcon icon={faGoogle} />
                    </Link>
                    <button className={`${styles.socialIcon} ${styles.telegram}`}>
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
  )
}