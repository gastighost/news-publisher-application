"use client";
import { useState, useEffect, use } from "react";
import One_Post from "../../components/scroll/Post";
import type { Post as PostType } from "../../types/post";
import axios from "axios";
import styles from "./page.module.css";
import { approveApi } from "../../../lib/auth/user_auth";
import OnePostApprove from "./onePostApprove";

export default function AdminPostApproval() {
  const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [post, setPost] = useState<PostType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const handleApprove = async (id: string) => {
    await approveApi.approvePost(id, true);
  };
  const loadPost = async () => {
    try {
      const response = await axios.get<{ message: string; posts: PostType[] }>(
        `${backendLink}/api/posts/admin-all?limit=100`,
        { withCredentials: true }
      );
      if (response.data?.posts?.length > 0) {
        setPosts(response.data.posts);
        console.log(response.data.posts);
      } else {
        console.error("No posts found");
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{ padding: "10px" }}>Admin Post Approval</h1>
      <div className={styles.fb}>
        {!posts.length ? (
          <p>Loading...</p>
        ) : (
          posts.map(
            (post) =>
              !post.approved && (
                <OnePostApprove
                  key={post.id}
                  post={post}
                  approvePost={handleApprove}
                />
                // <div key={post.id} className={styles.postbtnGrid}>
                //   <One_Post post={post} />
                //   <div className={styles.fbBtns}>
                //     <button onClick={handleApprove}>Approve</button>
                //     <button>Reject</button>
                //     <button>Delete</button>
                //   </div>
                // </div>
              )
          )
        )}
      </div>
    </div>
  );
}
