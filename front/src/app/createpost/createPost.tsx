import { useState, useEffect } from "react";

import styles from "./page.module.css";

export default function CreatePost() {
  return (
    <div className={styles.main}>
      <div id={styles.left}>
        <img
          src="default-avatar.png"
          alt="placeholder"
          style={{ height: "100px" }}
        ></img>
      </div>
      <div id="page">
        <h1>Page</h1>
        <h2>Subtitle</h2>
        <p>Lorem ipsum dit alor dlor ahwt.</p>
      </div>
    </div>
  );
}
