import { ReactNode } from "react";
import styles from "./page.module.css";

interface EditorButtonProps {
  bgColor?: string;
  children: ReactNode;
  clickEvent: () => void;
}

export default function EditorButton({
  bgColor = "white",
  children,
  clickEvent,
}: EditorButtonProps) {
  return (
    <button
      className={styles.btn}
      style={{ backgroundColor: bgColor }}
      type="button"
      onClick={() => clickEvent()}
    >
      {children}
    </button>
  );
}
