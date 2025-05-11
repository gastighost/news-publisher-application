"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import One_Post from "./Post"
import type { Post as PostType } from "../../types/post"
import styles from "./ScrollPosts.module.css"

const POSTS_TO_FETCH_ON_SCROLL = 3
const INITIAL_POST_COUNT_FROM_SSR = 5

export default function ScrollPosts({ initialPosts = [] }: { initialPosts?: PostType[] }) {
    const backendLink: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL

    const seenPostIds = useRef<Set<number | string>>(new Set())

    const [posts, setPosts] = useState<PostType[]>(() => {
        const uniquePosts: PostType[] = []
        initialPosts.forEach(post => {
            if (post.id && !seenPostIds.current.has(post.id)) {
                seenPostIds.current.add(post.id)
                uniquePosts.push(post)
            }
        })
        return uniquePosts
    })

    const [offset, setOffset] = useState<number>(posts.length)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const observer = useRef<IntersectionObserver | null>(null)

    const loadMorePosts = useCallback(async () => {
        if (!backendLink) {
            console.error("Backend URL (NEXT_PUBLIC_BACKEND_URL) is not defined.")
            setIsLoading(false)
            setHasMore(false)
            return
        }
        if (!hasMore || isLoading) return

        setIsLoading(true)
        try {
            const response = await axios.get<{ message: string; posts: PostType[] }>(
                `${backendLink}/api/posts?offset=${offset}&limit=${POSTS_TO_FETCH_ON_SCROLL}`
            )

            if (response.data && response.data.posts) {
                const newPosts = response.data.posts

                const uniqueNewPosts = newPosts.filter(post => {
                    if (!post.id || seenPostIds.current.has(post.id)) {
                        return false
                    }
                    seenPostIds.current.add(post.id)
                    return true
                })

                if (uniqueNewPosts.length > 0) {
                    setPosts(prevPosts => [...prevPosts, ...uniqueNewPosts])
                    setOffset(prevOffset => prevOffset + newPosts.length)
                }

                if (newPosts.length < POSTS_TO_FETCH_ON_SCROLL || uniqueNewPosts.length === 0) {
                    setHasMore(false)
                }
            } else {
                console.warn("Fetched data is not in the expected format or 'posts' property is missing:", response.data)
                setHasMore(false)
            }
        } catch (error) {
            console.error("Failed to fetch more posts:", error)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [backendLink, offset, hasMore, isLoading])

    const lastPostElementRef = useCallback((node: HTMLElement | null) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts()
            }
        })
        if (node) observer.current.observe(node)
    }, [isLoading, hasMore, loadMorePosts])

    useEffect(() => {
        if (initialPosts.length === 0 && posts.length === 0 && hasMore && !isLoading && backendLink) {
            loadMorePosts()
        }
    }, [initialPosts, posts, hasMore, isLoading, loadMorePosts, backendLink])

    if (posts.length === 0 && !isLoading && !hasMore) {
        return (
            <div className={styles.noPostsIndicator}>
                <p>No articles to display at the moment.</p>
            </div>
        )
    }

    if (posts.length === 0 && isLoading) {
        return (
            <div className={styles.loadingIndicator}>
                <p>Loading articles...</p>
            </div>
        )
    }

    return (
        <div className={styles.scrollContainer}>
            {posts.map((post, index) => (
                <div
                    ref={posts.length === index + 1 ? lastPostElementRef : null}
                    key={post.id ? `post-${post.id}` : `post-index-${index}`}
                    className={styles.postWrapper}
                >
                    <One_Post post={post} />
                </div>
            ))}
            {isLoading && (
                <div className={styles.loadingIndicator}>
                    <p>Loading more articles...</p>
                </div>
            )}
            {!hasMore && posts.length > 0 && (
                <div className={styles.noMorePostsIndicator}>
                    <p>You've seen it all!</p>
                </div>
            )}
        </div>
    )
}
