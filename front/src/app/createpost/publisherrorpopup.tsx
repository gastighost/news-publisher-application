import styles from "./page.module.css";

interface PublishErrorPopupProps {
  message: string;
  onClose: () => void;
}

function PublishErrorPopup({ message, onClose }: PublishErrorPopupProps) {
  return (
    <div className={styles.createPostPopupOverlay}>
      <div className={`${styles.createPostPopupBox} ${styles.error}`}>
        <div className={styles.createPostPopupContent}>
          <h2 className={styles.error}>❌ Error. Please try again</h2>
          <p>{message}</p>
          <button
            className={`${styles.createPostPopupButton} ${styles.error}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishErrorPopup;
