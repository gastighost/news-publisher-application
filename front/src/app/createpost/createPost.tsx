import { useState, useEffect } from "react";

import styles from "./page.module.css";
import EditorButton from "./button";
import TitleEditor from "./titleEditor";
import PostEditor from "./postEditor";

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
      <div id={styles.right}>
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
        <PostEditor />
      </div>
    </div>
  );
}
