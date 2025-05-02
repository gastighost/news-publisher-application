"use client";

import { useState, useEffect } from "react";
import { authApi } from "../../lib/api";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true);
      const status = await authApi.checkStatus();
      if (status.authenticated && status.user) {
        setUser(status.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, []);

  const handleLogout = async () => {
    const success = await authApi.logout();
    if (success) {
      setUser(null);
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello World</h1>
      {user ? (
        <div>
          <p>Welcome, {user.firstName || user.email}!</p>
          <button onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => (window.location.href = authApi.getGoogleAuthUrl())}
          type="button"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
