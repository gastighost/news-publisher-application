import { notFound } from "next/navigation";
import prisma from "@/prisma/prisma_config";
import styles from "./profile.module.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import { Author } from "@/types/author";
import { Post as PostType } from "@/types/post";

import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

type UserData = {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatar: string | null;
  type: "ADMIN" | "WRITER" | "READER";
  registrationDate: string;
  lastLoginDate: string | null;
  userStatus:
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING"
    | "BANNED"
    | "SUSPENDED"
    | "BLOCKED";
  posts: PostType[];
};

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ username: string }>;
}) {
  const params = await paramsPromise;
  const userData = await getUserData(params.username);

  if (!userData) {
    return {
      title: "User Not Found | Vancouver Times",
    };
  }

  const name = `${userData.firstName || "User"} ${
    userData.lastName || ""
  }`.trim();
  return {
    title: `${name}'s Profile | Vancouver Times`,
    description: userData.bio || `${name}'s profile on Vancouver Times`,
  };
}

async function getUserData(username: string): Promise<UserData | null> {
  try {
    const basicUser = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        type: true,
        registrationDate: true,
        lastLoginDate: true,
        userStatus: true,
      },
    });

    if (!basicUser || !basicUser.username || !basicUser.email) return null;

    const posts = await prisma.post.findMany({
      where: {
        authorId: basicUser.id,
        approved: true,
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        content: true,
        date: true,
        titleImage: true,
        category: true,
        commentsEnabled: true,
        authorId: true,
      },
    });

    const userNameFields = await prisma.$queryRaw`
      SELECT 
        COALESCE(firstName, '') as firstName, 
        COALESCE(lastName, '') as lastName
      FROM User
      WHERE id = ${basicUser.id}
      LIMIT 1
    `;

    const nameData =
      Array.isArray(userNameFields) && userNameFields.length > 0
        ? userNameFields[0]
        : { firstName: "", lastName: "" };

    const userData: UserData = {
      id: basicUser.id,
      email: basicUser.email as string,
      username: basicUser.username as string,
      firstName: nameData.firstName || "",
      lastName: nameData.lastName || "",
      bio: basicUser.bio,
      avatar: basicUser.avatar,
      type: basicUser.type as "ADMIN" | "WRITER" | "READER",
      registrationDate: basicUser.registrationDate.toISOString(),
      lastLoginDate: basicUser.lastLoginDate
        ? basicUser.lastLoginDate.toISOString()
        : null,
      userStatus: basicUser.userStatus,
      posts: posts.map((post) => ({
        ...post,
        date: post.date.toISOString(),
        updatedDate: null,
        lastUpdate: null,
        approved: true,
        category: post.category || "General",
        author: {
          id: basicUser.id,
          email: basicUser.email as string,
          username: basicUser.username as string,
          firstName: nameData.firstName || "",
          lastName: nameData.lastName || "",
          bio: basicUser.bio,
          avatar: basicUser.avatar,
          type: basicUser.type as "ADMIN" | "WRITER" | "READER",
          registrationDate: basicUser.registrationDate.toISOString(),
          lastLoginDate: basicUser.lastLoginDate
            ? basicUser.lastLoginDate.toISOString()
            : null,
          userStatus: basicUser.userStatus,
        } as Author,
      })),
    };

    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function UserProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ username: string }>;
}) {
  const params = await paramsPromise; // Await the params promise
  const userData = await getUserData(params.username);

  if (!userData) {
    notFound();
  }

  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  const hasName = !!(userData.firstName || userData.lastName);
  const fullName = hasName
    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
    : userData.username || "Anonymous User";

  const memberSince = new Date(userData.registrationDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const lastActive = userData.lastLoginDate
    ? new Date(userData.lastLoginDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Never";

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={`$</h1>{fullName}'s avatar`}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {userData.firstName?.[0] || "A"}
                {userData.lastName?.[0] || "U"}
              </div>
            )}
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {hasName ? fullName : userData.username || "Anonymous"}
            </h1>
            <p className={styles.userUsername}>@{userData.username}</p>
            <p className={styles.userRole}>{userData.type}</p>
            {userData.bio && <p className={styles.userBio}>{userData.bio}</p>}

            {/* New container for metadata and admin actions */}
            <div className={styles.metaAdminContainer}>
              <div className={styles.userMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Member since:</span>
                  <span className={styles.metaValue}>{memberSince}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Last active:</span>
                  <span className={styles.metaValue}>{lastActive}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status:</span>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[`status${userData.userStatus}`]
                    }`}
                  >
                    {userData.userStatus}
                  </span>
                </div>
              </div>

              {userData.type === "ADMIN" && (
                <div className={styles.adminActions}>
                  <Link href="/user_management" className={styles.adminButton}>
                    Manage Users
                  </Link>
                  <Link href="/approvepost" className={styles.adminButton}>
                    Post Management
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Published Articles</h2>

          {userData.posts.length > 0 ? (
            <div className={styles.postsList}>
              {userData.posts.map((post) => {
                let cloudinaryImageUrl: string | null = null;

                if (post.titleImage) {
                  try {
                    cloudinaryImageUrl = cld
                      .image(post.titleImage)
                      .resize(
                        auto().gravity(autoGravity()).width(350).height(200)
                      )
                      .delivery(format("auto"))
                      .delivery(quality("auto"))
                      .toURL();
                  } catch (e) {
                    console.error(
                      `Failed to generate Cloudinary URL for ${post.titleImage}:`,
                      e
                    );
                  }
                }

                return (
                  <Link href={`/post/${post.id}`} key={post.id}>
                    <div className={styles.postCard}>
                      <div className={styles.postImageContainer}>
                        {cloudinaryImageUrl ? (
                          <img
                            src={cloudinaryImageUrl}
                            alt={post.title}
                            className={styles.postImage}
                          />
                        ) : (
                          <div className={styles.postImagePlaceholder}>
                            <span>Image not available</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.postContent}>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        {post.subtitle && (
                          <p className={styles.postSubtitle}>{post.subtitle}</p>
                        )}
                        <div className={styles.postMeta}>
                          <span>{post.category || "General"}</span>
                          <span>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyPosts}>
              <p>This user hasn't published any articles yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
