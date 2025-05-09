import prisma from "@/prisma/prisma_config";
import styles from "./page.module.css";

import ScrollPosts from "../components/scroll/ScrollPosts"

import image1 from "../fake_image_db/pexels-abeysaksham-31701587.jpg";
import image2 from "../fake_image_db/pexels-alinaskazka-31551090.jpg";
import image3 from "../fake_image_db/pexels-apasaric-618079.jpg";
import image4 from "../fake_image_db/pexels-camcasey-1722183.jpg";
import image5 from "../fake_image_db/pexels-dr-failov-2151930529-31984777.jpg";
import image6 from "../fake_image_db/pexels-ingewallu-177809.jpg";
import image7 from "../fake_image_db/pexels-pixabay-160755.jpg";
import image8 from "../fake_image_db/pexels-sarah-deal-1194085-2418479.jpg";
import image9 from "../fake_image_db/pexels-pixabay-76964.jpg";

const localImages = [image1, image2, image3, image4, image5, image6, image7, image8, image9];

export default async function Home() {



  const posts = await prisma.post.findMany({
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
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  }

);

  // console.log(posts) 

  const getAuthorName = (author: typeof posts[0]["author"] | null | undefined): string => {
    if (!author) {
      return "Unknown Author";
    }
    const nameParts = [author.firstName, author.lastName].filter(Boolean);
    return nameParts.join(" ") || "Unknown Author";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Vancouver Times</div>
        <nav className={styles.nav}>
          <a href="#">Home</a>
          <a href="#">Crypto</a>
          <a href="#">Vancouver Today</a>
          <a href="#">Technologies</a>
          <a href="#">Health & Science</a>
        </nav>
        <button className={styles.signInButton}>Sign In</button>
      </header>

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
              <div className={styles.meta}>{`${posts[0].category || "General"} | ${getAuthorName(posts[0].author)} | ${new Date(posts[0].date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}</div>
            </div>
            <img
              src={localImages[0 % localImages.length].src}
              alt={posts[0].title}
              className={styles.featuredImagePlaceholder}
            />
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
          {posts.slice(1, 4).map((post, idx) => {
            const formattedDate = new Date(post.date).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            );
            const authorDisplayName = getAuthorName(post.author);
            const imageIndex = (idx + 1) % localImages.length; // +1 because we used index 0 for featured post

            return (
              <div key={post.id} className={styles.sidebarArticle}>
                <img
                  src={localImages[imageIndex].src}
                  alt={post.title}
                  className={styles.sidebarImagePlaceholder}
                />
                <div className={styles.sidebarText}>
                  <div className={styles.meta}>
                    {`${post.category || "General"} | ${authorDisplayName} | ${formattedDate}`}
                  </div>
                  <h3>{post.title}</h3>
                  {post.subtitle && (
                    <p className={styles.sidebarSubtitle}>{post.subtitle}</p>
                  )}
                  <div className={styles.meta}>Space | 7 mins read</div>
                </div>
              </div>
            );
          })}
        </aside>
      </main>

      <section className={styles.bottomSection}>
        {posts.slice(4, 8).map((post) => {
          const formattedDate = new Date(post.date).toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
          const authorDisplayName = getAuthorName(post.author);

          return (
            <div key={post.id} className={styles.bottomArticle}>
              <div
                className={styles.meta}
              >{`${post.category || "General"} | ${authorDisplayName} | ${formattedDate}`}</div>
              <h4 className={styles.bottomTitle} >{post.title}</h4>
              {post.subtitle && (
                <p className={styles.bottomArticleSubtitle}>{post.subtitle}</p>
              )}
              <div className={styles.meta}>
                Space | {Math.floor(Math.random() * 10) + 5} mins read
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.infiniteScrollSection}>
        <h2 className={styles.sectionTitle}>More Articles</h2>
        <ScrollPosts initialPosts={posts.slice(8) as unknown as []} />
      </section>

    </div>
  );
}