import React from "react";
import styles from "./page.module.css";

interface AdminPostSuccessPopupProps {
  message: string;
  onClose: () => void;
}

export default function AdminPostSuccessPopup({
  message,
  onClose,
}: AdminPostSuccessPopupProps) {
  return (
    <div className={styles.adminPostPopupOverlay}>
      <div className={styles.adminPostPopupBox}>
        <div className={styles.adminPostPopupContent}>
          <h2>✅ Success!</h2>
          <p>{message}</p>
          <button className={styles.adminPostPopupButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
