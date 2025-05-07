'use-client'
import React from "react"
import { useState, useEffect } from "react"

import type { Post } from "../../types/post";

import styles from "./ScrollPosts.module.css"

export default async function Post({ post }: { post: Post }) {
    const getAuthorDisplayName = () => {
        if (!post.author) {
            return "Unknown Author";
        }
        const { firstName, lastName } = post.author;
        const nameParts = [firstName, lastName].filter(Boolean);
        return nameParts.join(" ") || "Unknown Author";
    };

    const authorDisplayName = getAuthorDisplayName();

    // Format date
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className={styles.postItemContainer}> {}
            {post.titleImage && (
                <div className={styles.postImageContainer}>
                    <img 
                        src={post.titleImage} 
                        alt={`Image for ${post.title}`} 
                        className={styles.postImage} 
                    />
                </div>
            )}
            <div className={styles.postTextContent}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postDescription}>{post.content}</p>
                <div className={styles.postMeta}>
                    {post.category && <span className={styles.postCategory}>{post.category}</span>}
                    {post.category && authorDisplayName !== "Unknown Author" && <span className={styles.metaSeparator}> | </span>}
                    {authorDisplayName !== "Unknown Author" && <span className={styles.postAuthor}>{authorDisplayName}</span>}
                    {(post.category || authorDisplayName !== "Unknown Author") && <span className={styles.metaSeparator}> | </span>}
                    <span className={styles.postDate}>{formattedDate}</span>
                </div>
                <button className={styles.moreButton}>More</button>
            </div>
        </div>
    );
}