"use client";
import styles from "./[id]/page.module.css";
import mockusers from "./mockusers";
import UserInfoPage from "./[id]/userInfoPage";

import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <div className={styles.layer1}></div>
      {mockusers.map((mockuser) => (
        <div key={mockuser.id} style={{ marginBottom: "25px" }}>
          <UserInfoPage user={mockuser} />
        </div>
      ))}
    </>
  );
}
