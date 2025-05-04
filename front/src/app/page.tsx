"use client";
import { useState, useEffect } from "react";

import styles from './page.module.css'; 







export default function Home() {
  return (
    <div className={styles.container}>
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

      <main className={styles.mainContent}>
        <section className={styles.featuredSection}>
          <div className={styles.featuredText}>
            <h1>Vancouver Prepares for Early Heatwave as Temperatures Soar Above 25 °C</h1>
            <p>Meteorologists predict that a Pacific high-pressure ridge will bring clear skies and unseasonably warm weather to the region, with daytime highs expected to reach 27 °C and minimal overnight cooling through the weekend.</p>
            <div className={styles.meta}>Health & Science | Sophie Nguyen | May 3, 2025</div>
          </div>
          <div className={styles.featuredImagePlaceholder}></div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarArticle}>
            <div className={styles.sidebarImagePlaceholder}></div>
            <div className={styles.sidebarText}>
              <div className={styles.meta}>Daniel Albarta | October 22, 2023</div>
              <h3>'Washy Clouds and a Weepy Sky Floating Upside Down...'</h3>
              <div className={styles.meta}>Our Planet | 8 mins read</div>
            </div>
          </div>
          <div className={styles.sidebarArticle}>
            <div className={styles.sidebarImagePlaceholder}></div>
            <div className={styles.sidebarText}>
              <div className={styles.meta}>Natalia Freigman | October 21, 2023</div>
              <h3>Curiosity Rover Discovers New Evidence Mars Once...</h3>
              <div className={styles.meta}>Space | 7 mins read</div>
            </div>
          </div>
          <div className={styles.sidebarArticle}>
            <div className={styles.sidebarImagePlaceholder}></div>
            <div className={styles.sidebarText}>
              <div className={styles.meta}>Antonio Roberto | October 19, 2023</div>
              <h3>Satellite Data Reveals Ancient Landscape Preser...</h3>
              <div className={styles.meta}>Space | 12 mins read</div>
            </div>
          </div>
        </aside>
      </main>

      <section className={styles.bottomSection}>
        <div className={styles.bottomArticle}>
          <div className={styles.meta}>Donn Robinson | October 22, 2023</div>
          <h4>If Alien Life is Artificially Intelligent, it May be.....</h4>
          <div className={styles.meta}>Space and Universe | 9 mins read</div>
        </div>
        <div className={styles.bottomArticle}>
          <div className={styles.meta}>Max Wellerman | October 22, 2023</div>
          <h4>Climate change has pushed Earth into 'Uncharted.....</h4>
          <div className={styles.meta}>Our Planet | 35mins read</div>
        </div>
        <div className={styles.bottomArticle}>
          <div className={styles.meta}>Sean Paula | October 19, 2023</div>
          <h4>Humanity at Risk from AI 'Race to the Bottom'.....</h4>
          <div className={styles.meta}>Space | 12 mins read</div>
        </div>
        <div className={styles.bottomArticle}>
          <div className={styles.meta}>Antonio Roberto | October 19, 2023</div>
          <h4>UN Science Body Head Fears Lower Chance of Keeping...</h4>
          <div className={styles.meta}>Space | 12 mins read</div>
        </div>
      </section>
    </div>
  );
}