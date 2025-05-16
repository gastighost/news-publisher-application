import React from "react";
import styles from "./page.module.css";

interface PublishSuccessPopupProps {
  message: string;
  onClose: () => void;
}

export default function PublishSuccessPopup({
  message,
  onClose,
}: PublishSuccessPopupProps) {
  return (
    <div className={styles.createPostPopupOverlay}>
      <div className={styles.createPostPopupBox}>
        <div className={styles.createPostPopupContent}>
          <h2>✅ Success!</h2>
          <p>Your post was created successfully!</p>
          <button className={styles.createPostPopupButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
