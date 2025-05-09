import { useState, useEffect } from "react";

import styles from "./page.module.css";
import EditorButton from "./button";
import TitleEditor from "./titleEditor";

export default function CreatePost() {
  const [keyPress, setKey] = useState();
  const [title, setTitle] = useState("Click to edit your title");
  const [subtitle, setSubtitle] = useState("Give it a subtitle");
  const log = () =>
    alert(`Article Title: ${title}\nArticle Subtitle ${subtitle}`);

  return (
    <div className={styles.main}>
      <div id={styles.left}>
        <div id={styles.upload}></div>
        <div className={styles.buttons}>
          <EditorButton bgColor="darkorange" clickEvent={log}>
            💾 Save Draft
          </EditorButton>
          <EditorButton bgColor="green" clickEvent={log}>
            🌎 Publish
          </EditorButton>
        </div>
      </div>
      <div id="page">
        <TitleEditor
          titlePlaceholder="Your awesome article title"
          titleValue={title}
          changeTitle={setTitle}
          fontSize="1.5rem"
        />
        <TitleEditor
          titlePlaceholder="Give it a subtitle"
          titleValue={subtitle}
          changeTitle={setSubtitle}
          fontSize="1.2rem"
        />
        <p id={styles.editor} contentEditable="true">
          This feature is not finished yet. Lorem ipsum dit alor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </div>
    </div>
  );
}
