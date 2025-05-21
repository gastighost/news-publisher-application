import { Author } from "@/types/author";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface RegistrationResponse {
  success: boolean;
  message?: string;
  user?: any;
}

async function register(
  username: string,
  email: string,
  password: string
): Promise<RegistrationResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || `Registration failed with status: ${response.status}`,
      };
    }

    return { success: true, user: data.newUser, message: data.message };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error.message || "An unexpected error occurred during registration.",
    };
  }
}

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
  login: async (
    loginIdentifier: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername: loginIdentifier, password }),
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
  register,

  getAllUsers: async (): Promise<Author[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const data = await response.json();
      return data.users as Author[];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  updateUserStatus: async (
    userId: number,
    status: "ACTIVE" | "SUSPENDED" | "BLOCKED"
  ): Promise<Author> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userStatus: status }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }
      const data = await response.json();
      return data.user as Author;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },
};

export const postApi = {
  createPost: async (formData: FormData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
};
