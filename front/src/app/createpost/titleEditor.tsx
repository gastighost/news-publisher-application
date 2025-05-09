import styles from "./page.module.css";

interface TitleEditorProps {
  titlePlaceholder: string;
  titleValue: string;
  width?: string;
  fontSize?: string;
  changeTitle: (newTitle: string) => void;
}

export default function TitleEditor(title: TitleEditorProps) {
  return (
    <div className="titleEditor">
      <input
        type="text"
        placeholder={title.titlePlaceholder}
        className={styles.titleInput}
        value={title.titleValue}
        style={{
          width: title.width,
          fontSize: title.fontSize, // override the default width
        }}
        onChange={(e) => title.changeTitle(e.target.value)}
      ></input>
    </div>
  );
}
