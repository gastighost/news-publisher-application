import test from "node:test";
import "./indivisual_post_css.css";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { Cloudinary } from "@cloudinary/url-gen";

export interface PostProps {
  id: number;
  title: string;
  subtitle: string;
  titleImage: string;
  content: string;
  category: string;
  date: string;
  updatedDate: string | null;
  commentsEnabled: boolean;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  comments: any[];
  likes: any[];
  likeCount: number;
}

export default function IndividualPost(post: PostProps) {
  const mainContent = post.content.split("\n\n");
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });
  let cloudinaryImageUrl: string | null = null;
  if (post.titleImage) {
    cloudinaryImageUrl = cld
      .image(post.titleImage)
      .resize(auto().gravity(autoGravity()).width(300).height(200))
      .delivery(format("auto"))
      .delivery(quality("auto"))
      .toURL();
  }
  return (
    <main>
      <section className="article-header">
        <div className="article-category">{post.category}</div>
        <h1 className="article-title">{post.title}</h1>
        <h2 className="article-subtitle">{post.subtitle}</h2>

        <div className="article-meta">
          <span className="byline">{`By: ${authorName}`}</span>
          <span className="publish-date">
            {new Date(post.date).toDateString()}
          </span>
        </div>

        <div className="article-actions">
          <button className="action-button">
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button className="action-button">
            <i className="fas fa-expand"></i> Resize
          </button>
          <button
            className="action-button"
            onClick={() => {
              const commentSection = document.getElementById("comment");
              if (commentSection) {
                commentSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <i className="fas fa-comment"></i> Comments
          </button>
          <button className="action-button">
            <i className="fas fa-volume-up"></i> Listen
          </button>
        </div>
      </section>

      <section className="feature-image">
        <img src={cloudinaryImageUrl || ""} alt={post.titleImage}></img>
        <div className="feature-caption">
          This is an image caption. Vancouver's technology sector has grown by
          35% in the past three years, transforming the city's business
          landscape. Credit: BCIT Times
        </div>
      </section>

      <section className="article-content">
        {mainContent.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <section className="author-bio">
        <h2>About the Author</h2>
        <div className="author-info">
          <div className="author-image">
            <img
              src={
                post.author.avatar
                  ? `/` + post.author.avatar
                  : "/default-avatar.png"
              }
              alt={authorName}
            />
          </div>
          <div className="author-details">
            <p>
              <strong>{authorName}</strong> Author name is not exposed via API.
            </p>
          </div>
        </div>
      </section>

      <section className="related-stories">
        <h2>Related Stories</h2>
        <div className="stories-grid">
          <div className="story-card">
            <h3>
              <a href="#">
                Vancouver's AI Companies Attract $2.3 Billion in Funding
              </a>
            </h3>
            <p>
              Local artificial intelligence startups are drawing major
              investment despite global economic uncertainty
            </p>
          </div>
          <div className="story-card">
            <h3>
              <a href="#">
                Tech Workers Drive Housing Demand in Mount Pleasant
              </a>
            </h3>
            <p>
              Real estate prices continue to climb as high-earning professionals
              seek homes near innovation hubs
            </p>
          </div>
          <div className="story-card">
            <h3>
              <a href="#">BCIT Launches Advanced Machine Learning Program</a>
            </h3>
            <p>
              New educational initiative aims to meet growing industry demand
              for specialized AI talent
            </p>
          </div>
        </div>
      </section>

      <section id="comment" className="comments-section">
        <div className="comments-header">
          <h2>Comments</h2>
          <button className="button-outline">Comment</button>
        </div>
        <div className="comments-container">
          {post.comments.length > 0 ? (
            <p>Comments found</p>
          ) : (
            <p>Be the first to comment!</p>
          )}
        </div>
      </section>

      <section className="popular-section">
        <h2>Popular Now in Technology</h2>
        <div className="popular-list">
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                Quantum Computing Breakthrough Could Transform Machine Learning
                Applications
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                Canadian Tech Salaries See Largest Annual Increase in Decade
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                The Environmental Cost of Data Centers: New Study Reveals Impact
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">Five Technologies That Will Define the Next Decade</a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                How Digital Nomads Are Changing Vancouver's Work Culture
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
