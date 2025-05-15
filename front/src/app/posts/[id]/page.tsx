"use client";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import IndividualPost from "./individualPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { PostProps } from "./individualPost";
import React from "react";
import mainStyles from "@/app/page.module.css";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [post, setPost] = useState<PostProps | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get<{ message: string; post: PostProps }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${id}`
        );
        setPost(res.data.post);
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setPost(null);
        } else {
          console.error("Failed to fetch post:", err);
        }
      }
    };

    fetchPost();
  }, [id]);

  return (
    <>
      <div className={mainStyles.container}>
        <Header />
        {post ? (
          <IndividualPost {...post} />
        ) : (
          <div>Content still loading or not found ...</div>
        )}
        <Footer />
      </div>
    </>
  );
}
