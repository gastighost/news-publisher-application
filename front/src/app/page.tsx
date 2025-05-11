import prisma from "@/prisma/prisma_config"
import styles from "./page.module.css"

import ScrollPosts from "../components/scroll/ScrollPosts"
import { Post as PostType } from "@/types/post"
import { Author as AuthorType } from "@/types/author"

import { Cloudinary } from "@cloudinary/url-gen"
import { auto } from "@cloudinary/url-gen/actions/resize"
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity"
import { format, quality } from "@cloudinary/url-gen/actions/delivery"

import Footer from "../components/footer/Footer";
import Header from "../components/header/Header"; 

export default async function Home() {
  console.log(
    "Cloudinary Cloud Name:",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  )

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }
  })

  const rawPosts = await prisma.post.findMany({
    where: { approved: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      titleImage: true,
      content: true,
      category: true,
      date: true,
      authorId: true,
      updatedDate: true,
      commentsEnabled: true,
      lastUpdate: true,
      approved: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          bio: true,
          avatar: true,
          type: true,
          registrationDate: true,
          lastLoginDate: true,
          userStatus: true
        }
      }
    }
  })

  const posts: PostType[] = rawPosts.map((p) => {
    const authorData = p.author
    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      titleImage: p.titleImage,
      content: p.content,
      category: p.category ?? "General",
      date: p.date.toISOString(),
      authorId: p.authorId,
      updatedDate: p.updatedDate ? p.updatedDate.toISOString() : null,
      commentsEnabled: p.commentsEnabled,
      lastUpdate: p.lastUpdate ? p.lastUpdate.toISOString() : null,
      approved: p.approved,
      author: {
        id: authorData.id,
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        email: authorData.email,
        username: authorData.username,
        bio: authorData.bio,
        avatar: authorData.avatar,
        type: authorData.type,
        registrationDate: authorData.registrationDate.toISOString(),
        lastLoginDate: authorData.lastLoginDate
          ? authorData.lastLoginDate.toISOString()
          : null,
        userStatus: authorData.userStatus
      } as AuthorType
    }
  })

  const getAuthorName = (
    author: AuthorType | null | undefined
  ): string => {
    if (!author) {
      return "Unknown Author"
    }
    const nameParts = [author.firstName, author.lastName].filter(Boolean)
    return nameParts.join(" ") || "Unknown Author"
  }

  const initialPostsForScroll: PostType[] = posts
    .slice(8)
    .map((p) => {
      let generatedImageUrl: string | null = null
      if (p.titleImage) {
        try {
          generatedImageUrl = cld
            .image(p.titleImage)
            .resize(
              auto().gravity(autoGravity()).width(558).height(314)
            )
            .delivery(format("auto"))
            .delivery(quality("auto"))
            .toURL()
        } catch (e) {
          console.error(
            `Failed to generate Cloudinary URL for public ID ${p.titleImage}:`,
            e
          )
        }
      }
      return { ...p, imageUrl: generatedImageUrl }
    })

  return (
    <div className={styles.container}>
      <Header /> {/* Use the Header component here */}

      <main className={styles.mainContent}>
        {posts[0] ? (
          <section className={styles.featuredSection}>
            <div className={styles.featuredText}>
              <h1>{posts[0].title}</h1>
              <p>
                {posts[0].subtitle ||
                  posts[0].content.substring(0, 200) +
                    (posts[0].content.length > 200 ? "..." : "")}
              </p>
              <div className={styles.meta}>
                {`${posts[0].category || "General"} | ${getAuthorName(
                  posts[0].author
                )} | ${new Date(posts[0].date).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }
                )}`}
              </div>
            </div>
            {posts[0].titleImage ? (
              (() => {
                const publicId = posts[0].titleImage!
                const imageUrl = cld
                  .image(publicId)
                  .resize(
                    auto().gravity(autoGravity()).width(600).height(400)
                  )
                  .delivery(format("auto"))
                  .delivery(quality("auto"))
                  .toURL()
                return (
                  <img
                    src={imageUrl}
                    alt={posts[0].title}
                    className={styles.featuredImagePlaceholder}
                  />
                )
              })()
            ) : (
              <div className={styles.featuredImagePlaceholder}>
                <span>Image not available</span>
              </div>
            )}
          </section>
        ) : (
          <section className={styles.featuredSection}>
            <div className={styles.featuredText}>
              <h1>Post not available</h1>
              <p>The featured post could not be loaded at this time.</p>
            </div>
            <div className={styles.featuredImagePlaceholder}></div>
          </section>
        )}

        <aside className={styles.sidebar}>
          {posts.slice(1, 4).map((post) => {
            const formattedDate = new Date(
              post.date
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
            const authorDisplayName = getAuthorName(post.author)

            let cloudinaryImageUrl: string | null = null
            if (post.titleImage) {
              cloudinaryImageUrl = cld
                .image(post.titleImage)
                .resize(
                  auto().gravity(autoGravity()).width(300).height(200)
                )
                .delivery(format("auto"))
                .delivery(quality("auto"))
                .toURL()
            }

            return (
              <div
                key={post.id}
                className={styles.sidebarArticle}
              >
                {cloudinaryImageUrl ? (
                  <img
                    src={cloudinaryImageUrl}
                    alt={post.title}
                    className={styles.sidebarImagePlaceholder}
                  />
                ) : (
                  <div className={styles.sidebarImagePlaceholder}>
                    <span>Image not available</span>
                  </div>
                )}
                <div className={styles.sidebarText}>
                  <div className={styles.meta}>
                    {`${post.category || "General"} | ${authorDisplayName} | ${formattedDate}`}
                  </div>
                  <h3>{post.title}</h3>
                  {post.subtitle && (
                    <p className={styles.sidebarSubtitle}>
                      {post.subtitle}
                    </p>
                  )}
                  <div className={styles.meta}>
                    Space | 7 mins read
                  </div>
                </div>
              </div>
            )
          })}
        </aside>
      </main>

      <section className={styles.bottomSection}>
        {posts.slice(4, 8).map((post) => {
          const formattedDate = new Date(
            post.date
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          })
          const authorDisplayName = getAuthorName(post.author)
          return (
            <div key={post.id} className={styles.bottomArticle}>
              <div className={styles.meta}>
                {`${post.category || "General"} | ${authorDisplayName} | ${formattedDate}`}
              </div>
              <h4 className={styles.bottomTitle}>
                {post.title}
              </h4>
              {post.subtitle && (
                <p className={styles.bottomArticleSubtitle}>
                  {post.subtitle}
                </p>
              )}
              <div className={styles.meta}>
                Space | {Math.floor(Math.random() * 10) + 5} mins read
              </div>
            </div>
          )
        })}
      </section>

      <section className={styles.infiniteScrollSection}>
        <h2 className={styles.sectionTitle}>More Articles</h2>
        <ScrollPosts initialPosts={initialPostsForScroll} />
      </section>

      <Footer />

    </div>
  )
}