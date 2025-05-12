"use client";
import { useState, useEffect } from "react";
import { User } from "./user";
import { UserType } from "./user";

import styles from "./page.module.css";

export default function AdminUserPage() {
  const user = {
    user_id: 1,
    user_name: "John Doe",
    user_email: "email@.com",
    user_bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleBlockUser = (id: number) => {
    alert(`User with ID ${id} blocked`);
  };
  const handleSuspendUser = (id: number) => {
    alert(`User with ID ${id} suspended`);
  };
  return (
    <div className={styles.main}>
      <h1>Users</h1>
      <div className={styles.mainUsers}>
        {users.map((user) => (
          <User
            key={user.id}
            user={user}
            blockUser={handleBlockUser}
            suspendUser={handleSuspendUser}
          />
        ))}
      </div>
    </div>
  );
}
