const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Define the expected return type for the register function
interface RegistrationResponse {
  success: boolean;
  message?: string;
  user?: any; // You can replace 'any' with a more specific User type if available
}

async function register(username: string, email: string, password: string): Promise<RegistrationResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, { // Ensure this matches your backend API route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handles HTTP errors like 409 (User already exists), 400 (Validation error), etc.
      return { success: false, message: data.message || `Registration failed with status: ${response.status}` };
    }

    // Assuming your backend returns something like { message: "Registered a new user!", newUser: { ... } } on success (201)
    return { success: true, user: data.newUser, message: data.message };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "An unexpected error occurred during registration." };
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
  login: async (loginIdentifier: string, password: string): Promise<boolean> => { // Parameter name changed for clarity
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername: loginIdentifier, password }), // Corrected body
        credentials: "include",
      });

      if (response.ok) {
        // const data = await response.json(); // Optionally process user data from response
        return true;
      }
      // const errorData = await response.json(); // Optionally get error message from backend
      // console.error("Login failed on client:", errorData.message);
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
};
