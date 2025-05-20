import React from "react";
import styles from "./page.module.css";

interface AdminPostErrorPopupProps {
  message: string;
  onClose: () => void;
}

export default function AdminPostErrorPopup({
  message,
  onClose,
}: AdminPostErrorPopupProps) {
  return (
    <div className={styles.adminPostPopupOverlay}>
      <div className={`${styles.adminPostPopupBox} ${styles.error}`}>
        <div className={styles.adminPostPopupContent}>
          <h2 className={styles.error}>❌ Error</h2>
          <p>{message}</p>
          <button
            className={`${styles.adminPostPopupButton} ${styles.error}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
