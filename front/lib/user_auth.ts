const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const authApi = {
  getGoogleAuthUrl: () => {
    return `${BACKEND_URL}/api/auth/google`;
  },
  checkStatus: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/status`, {
        credentials: "include",
      });
      if (!response.ok) {
        return { authenticated: false };
      }
      return await response.json();
    } catch (error) {
      console.error("Error checking auth status:", error);
      return { authenticated: false };
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error logging in:", error);

      return false;
    }
  },
  logout: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      return response.ok;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  },
};
