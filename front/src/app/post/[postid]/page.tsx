import { Metadata } from "next"
import PostClientContent from "./PostClientContent"

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
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { postid: string } }): Promise<Metadata> {
  // Await the entire params object first
  const resolvedParams = await params;
  const postId = resolvedParams.postid;
  const post = await fetchPostById(postId);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return {
    title: post.title,
    description: post.subtitle || post.content.substring(0, 160),
  }
}

// Server function to fetch post data
async function fetchPostById(postId: string): Promise<Post | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) {
    console.error("Backend URL not defined in environment variables")
    return null
  }
  
  try {
    const res = await fetch(`${backendUrl}/api/posts/${postId}`, { 
      next: { revalidate: 3600 } // Revalidate cache every hour
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status}`)
    }
    
    const data = await res.json()
    return data.post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Server Component - Make async to support awaiting params
export default async function PostPage({ params }: { params: { postid: string } }) {
  // Await the entire params object first
  const resolvedParams = await params;
  const postId = resolvedParams.postid;
  return <PostClientContent postId={postId} />
}