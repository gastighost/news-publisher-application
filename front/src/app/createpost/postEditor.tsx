import styles from "./page.module.css";

interface PostEditorProps {
  titlePlaceholder: string;
  titleValue: string;
  width?: string;
  fontSize?: string;
  changeTitle: (newTitle: string) => void;
}

export default function PostEditor() {
  const applyStyle = (style: string) => {
    const textarea = document.getElementById(
      styles.textarea
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const styledText =
        style === "bold"
          ? `<b>${selectedText}</b>`
          : style === "italic"
          ? `<i>${selectedText}</i>`
          : style === "underline"
          ? `<u>${selectedText}</u>`
          : style == "link"
          ? `<a href="${selectedText}">${selectedText}</a>`
          : selectedText;

      textarea.setRangeText(styledText, start, end, "end");
    }
  };

  return (
    <>
      <div id={styles.editor}>
        <div className={styles.stylebtns}>
          <button
            style={{ fontWeight: "bold" }}
            onClick={() => applyStyle("bold")}
          >
            B
          </button>
          <button
            style={{ fontStyle: "italic" }}
            onClick={() => applyStyle("italic")}
          >
            I
          </button>
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => applyStyle("underline")}
          >
            U
          </button>
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => applyStyle("link")}
          >
            @
          </button>
        </div>
        <textarea
          id={styles.textarea}
          rows={15}
          defaultValue={"Write your article here..."}
        ></textarea>
      </div>
    </>
  );
}
