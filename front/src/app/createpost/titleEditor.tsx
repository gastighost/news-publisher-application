import styles from "./page.module.css";

interface TitleEditorProps {
  titlePlaceholder?: string;
  titleValue: string;
  width?: string;
  fontSize?: string;
  changeTitle: (newTitle: string) => void;
}

export default function TitleEditor(title: TitleEditorProps) {
  return (
    <div className="titleEditor">
      <textarea
        rows={1}
        onInput={(e) => {
          e.currentTarget.style.height = "auto"; // reset the height
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // set the height to the scroll height
        }}
        // type="text"
        placeholder={title.titlePlaceholder}
        className={styles.titleInput}
        value={title.titleValue}
        style={{
          width: title.width,
          fontSize: title.fontSize, // override the default width
        }}
        onChange={(e) => title.changeTitle(e.target.value)}
      ></textarea>
    </div>
  );
}
