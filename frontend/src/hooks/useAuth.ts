import { useState, useEffect } from "react";
import axios from "axios"; // or fetch

interface User {
  id: string;
  full_name: string;
  profile_photo_path: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user?: User;
  isLoading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });

        setAuthState({
          isAuthenticated: true,
          user: response.data.body,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    fetchAuthStatus();
  }, []);

  return authState;
};

export default useAuth;
