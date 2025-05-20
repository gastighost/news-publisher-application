"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import One_Post from "../../components/scroll/Post";
import AdminPostSuccessPopup from "./adminpostsuccesspopup";
import AdminPostErrorPopup from "./adminposterrorpopup";
import type { Post as PostType } from "../../types/post";

import styles from "./page.module.css";

export default function AdminPostApproval() {
  const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [posts, setPosts] = useState<PostType[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const loadPost = async (pageNum = page) => {
    try {
      const offset = (pageNum - 1) * limit;
      const response = await axios.get<{ message: string; posts: PostType[] }>(
        `${backendLink}/api/posts/admin-all?offset=${offset}&limit=${limit}`,
        { withCredentials: true }
      );

      if (response.data?.posts?.length > 0) {
        setPosts(response.data.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const updatePostStatus = async (postId: number, approved: boolean) => {
    try {
      await axios.patch(
        `${backendLink}/api/posts/${postId}/status`,
        { approved },
        { withCredentials: true }
      );

      setSuccessMsg(`Post ${approved ? "approved" : "rejected"} successfully!`);

      loadPost();
    } catch (err) {
      setErrorMsg("Failed to update post status.");

      console.error("Error updating post status:", err);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await axios.delete(`${backendLink}/api/posts/${postId}`, {
        withCredentials: true,
      });

      setSuccessMsg("Post deleted successfully!");

      loadPost();
    } catch (err) {
      setErrorMsg("Failed to delete post.");

      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    loadPost(page);
  }, [page]);

  return (
    <div className={styles.container}>
      <h1 style={{ padding: "10px" }}>Admin Post Approval</h1>
      <div className={styles.fb}>
        {!posts.length ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles.postbtnGrid}>
              <One_Post post={post} />
              <div className={styles.fbBtns}>
                {post.approved ? ( // not working right now
                  <p>Approved</p>
                ) : (
                  <p>Not Approved</p>
                )}
                <button onClick={() => updatePostStatus(post.id, true)}>
                  Approve
                </button>
                <button onClick={() => updatePostStatus(post.id, false)}>
                  Reject
                </button>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.paginationControls}>
        <button
          className={styles.paginationButton}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className={styles.paginationPage}>Page {page}</span>
        <button
          className={styles.paginationButton}
          disabled={posts.length < limit}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {successMsg && (
        <AdminPostSuccessPopup
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      {errorMsg && (
        <AdminPostErrorPopup
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}
    </div>
  );
}
