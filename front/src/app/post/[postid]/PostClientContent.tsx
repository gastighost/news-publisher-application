"use client"
import { useState, useEffect } from "react"
import { CldImage } from "next-cloudinary"
import styles from "./post.module.css"
import Link from "next/link"
import { authApi } from "../../../../lib/auth/user_auth"
import { notFound } from "next/navigation"

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

interface Post {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  date: string;
  category?: string;
  author: Author;
  titleImage?: string;
  commentsEnabled?: boolean;
  comments?: Comment[];
}

interface Comment {
  id: number;
  comment: string;
  date: string;
  user: {
    firstName: string;
    lastName: string;
    username: string; 
  };
}

export default function PostClientContent({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        if (!backendUrl) {
          console.error("Backend URL not defined in environment variables")
          setLoading(false)
          return
        }
        
        const res = await fetch(`${backendUrl}/api/posts/${postId}`)
        
        if (!res.ok) {
          throw new Error(`Failed to fetch post: ${res.status}`)
        }
        
        const data = await res.json()
        setPost(data.post)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    const checkAuthStatus = async () => {
      try {
        const status = await authApi.checkStatus()
        setIsAuthenticated(status.authenticated)
        if (status.authenticated && status.user) {
          setUser(status.user)
        }
      } catch (error) {
        console.error("Error checking authentication status:", error)
      }
    }

    fetchPost()
    checkAuthStatus()
  }, [postId])

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (!post) return notFound()

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const getAuthorName = (author: Author): string => {
    if (!author) return "Unknown Author"
    const nameParts = [author.firstName, author.lastName].filter(Boolean)
    return nameParts.join(" ") || "Unknown Author"
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim()) return
    if (!isAuthenticated) {
      setSubmitError("You must be logged in to comment")
      return
    }
    
    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ comment: commentText }),
      })
      
      if (response.ok) {
        setCommentText("")
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}`)
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          setPost(data.post)
        }
      } else {
        const errorData = await response.json()
        setSubmitError(errorData.message || "Failed to submit comment")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      setSubmitError("Error submitting comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <article className={styles.postContainer}>
        <header className={styles.postHeader}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          {post.subtitle && <h2 className={styles.postSubtitle}>{post.subtitle}</h2>}
          <div className={styles.postMeta}>
            {post.category || "General"} | {getAuthorName(post.author)} | {formattedDate}
          </div>
        </header>
        
        {post.titleImage && (
          <div className={styles.heroImage}>
            <CldImage
              src={post.titleImage}
              alt={post.title}
              width={1200}
              height={630}
              priority
              className={styles.image}
            />
          </div>
        )}
        
        <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments</h2>
          
          {post.commentsEnabled ? (
            <>
              {isAuthenticated ? (
                <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                  <textarea 
                    className={styles.commentTextarea} 
                    placeholder="Write a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  {submitError && <p className={styles.errorMessage}>{submitError}</p>}
                  <button 
                    type="submit" 
                    className={styles.commentButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              ) : (
                <div className={styles.unauthorizedCommentSection}>
                  <p className={styles.authPrompt}>Sign in to join the conversation</p>
                  <Link href="/signin" className={styles.commentSignInButton}>
                    Comment
                  </Link>
                </div>
              )}
              
              <div className={styles.commentsList}>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div className={styles.commentAuthorInfo}>
                          <span className={styles.commentUsername}>@{comment.user.username}</span>
                          <span className={styles.commentAuthor}>
                            {comment.user.firstName} {comment.user.lastName}
                          </span>
                        </div>
                        <span className={styles.commentDate}>
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles.commentContent}>{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noComments}>Be the first to comment!</p>
                )}
              </div>
            </>
          ) : (
            <p className={styles.noComments}>Comments are disabled for this post.</p>
          )}
        </div>
      </article>
    </div>
  )
}