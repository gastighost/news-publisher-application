import { useState } from "react";

import styles from "./page.module.css";
import EditorButton from "./button";
import TitleEditor from "./titleEditor";
import PostEditor from "./postEditor";
import PublishSuccessPopup from "./publishsuccesspopup";
import { postApi } from "../../../lib/auth/user_auth";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const handlePublish = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);

    if (image) {
      formData.append("titleImage", image);
    }

    try {
      await postApi.createPost(formData);
      setShowPopup(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      alert("Failed to create post: " + (error.message || error));
    }
  };

  const log = () =>
    alert(
      `Article Title: ${title}\nArticle Subtitle: ${subtitle}\nContent: ${content}`
    );

  return (
    <div className={styles.main}>
      <div id={styles.left}>
        <div id={styles.upload}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className={styles.buttons}>
          <EditorButton bgColor="darkorange" clickEvent={log}>
            💾 Save Draft
          </EditorButton>
          <EditorButton bgColor="green" clickEvent={handlePublish}>
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
        <PostEditor
          titlePlaceholder=""
          titleValue={content}
          changeTitle={setContent}
        />
      </div>
      {showPopup && (
        <PublishSuccessPopup
          message="Your post was created successfully!"
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
