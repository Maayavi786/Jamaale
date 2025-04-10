import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

// Custom hook for accessing the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // For demo purposes, we'll check localStorage
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);
  
  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", { username });
      
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Login error response:", error);
        throw new Error(error.message || "Login failed");
      }
      
      const userData = await response.json();
      console.log("Login successful, user data:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Invalidate queries that might depend on user authentication
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      console.log("Attempting registration with data:", userData);
      
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      console.log("Registration response status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Registration error response:", error);
        throw new Error(error.message || "Registration failed");
      }
      
      const registeredUser = await response.json();
      console.log("Registration successful, user data:", registeredUser);
      setUser(registeredUser);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      
      // Invalidate queries that might depend on user authentication
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    
    // Invalidate queries that might depend on user authentication
    queryClient.invalidateQueries();
  };
  
  // Update user data
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
