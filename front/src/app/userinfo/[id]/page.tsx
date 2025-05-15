"use client";
import styles from "./page.module.css";
import EditorButton from "./button"; // this should be moved in /components once the other PR is merged
import UserInfoPage from "./userInfoPage";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  // Mock user data
  const user = {
    id: id,
    username: "johndoe",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    bio: "Enthusiastic writer and news publisher. John is a passionate journalist with a knack for storytelling. He loves to explore new topics and share his insights with the world. In his free time, he enjoys reading, traveling, and spending time with family and friends.",
    type: "editor",
    registrationDate: "2023-01-15",
    lastLoginDate: "2024-06-01",
    userStatus: "active",
  };
  return (
    <>
      <div className={styles.layer1}></div>
      <UserInfoPage user={user} />
    </>
  );
}
