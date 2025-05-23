"use client"
import React from "react"
import { CldImage } from "next-cloudinary"
import { Post as PostType } from "../../types/post"
import styles from "./Post.module.css"
import Link from "next/link"

export default function One_Post({ post }: { post: PostType }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const getAuthorName = (author: PostType["author"]): string => {
    if (!author) return "Unknown Author"
    const nameParts = [author.firstName, author.lastName].filter(Boolean)
    return nameParts.join(" ") || "Unknown Author"
  }

  const displayContent =
    post.content.length > 350
      ? post.content.substring(0, 347) + "..."
      : post.content

  return (
    <article className={styles.postContainer}>
      <div className={styles.imageWrapper}>
        {post.titleImage ? (
          <CldImage
            src={post.titleImage}
            alt={post.title}
            width={558}
            height={427}
            className={styles.postImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>Image Not Available</span>
          </div>
        )}
      </div>
      <div className={styles.postTextContent}>
        <div>
          <h2 className={styles.postTitle}>{post.title}</h2>
          {post.subtitle && (
            <p className={styles.postSubtitle}>{post.subtitle}</p>
          )}
          <p className={styles.postBody}>{displayContent}</p>
        </div>
        <div className={styles.postFooter}>
          <p className={styles.postMeta}>
            {post.category || "General"} | {getAuthorName(post.author)} | {formattedDate}
          </p>
          <Link href={`/post/${post.id}`} className={styles.moreButton}>More</Link>
        </div>
      </div>
    </article>
  )
}
