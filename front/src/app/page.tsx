import prisma from "@/prisma/prisma_config";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await prisma.post.findMany(
    {
    // where: { // have to remove after testing
    //   approved: true,
    // },
    include: {
      author: true,
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
            {posts[0].titleImage ? (
              <img
                src={posts[0].titleImage}
                alt={posts[0].title}
                className={styles.featuredImagePlaceholder}
              />
            ) : (
              <div className={styles.featuredImagePlaceholder}></div>
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
              <div key={post.id} className={styles.sidebarArticle}>
                {post.titleImage ? (
                  <img
                    src={post.titleImage}
                    alt={post.title}
                    className={styles.sidebarImagePlaceholder}
                  />
                ) : (
                  <div className={styles.sidebarImagePlaceholder}></div>
                )}
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
    </div>
  );
}
