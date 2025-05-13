"use client";

import { useState } from "react";
import { postApi } from "../../../../lib/auth/user_auth";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [titleImage, setTitleImage] = useState<File | null>(null);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTitleImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    formData.append("commentsEnabled", commentsEnabled ? "true" : "false");
    if (titleImage) {
      formData.append("titleImage", titleImage);
    }

    try {
      await postApi.createPost(formData);

      setMessage("Post created successfully!");
      setTitle("");
      setSubtitle("");
      setContent("");
      setTitleImage(null);
      setCommentsEnabled(true);
    } catch (error) {
      console.log(error);
      setMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="subtitle">Subtitle:</label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              height: "100px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="titleImage">Title Image:</label>
          <input
            type="file"
            id="titleImage"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="commentsEnabled">
            <input
              type="checkbox"
              id="commentsEnabled"
              checked={commentsEnabled}
              onChange={(e) => setCommentsEnabled(e.target.checked)}
            />
            Enable Comments
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Create Post"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.includes("successfully") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
