
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { signUp, signIn, signOut, getCurrentUser, AuthUser, updateUserProfile } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>; // Updated return type
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error checking authentication status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Register a new user
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signUp(email, name, password);
      
      if (result && result.user) {
        const userData = {
          id: result.user.id,
          name,
          phoneNumber: email, // Using email instead of phone
          trustScore: 50, // Default trust score for new users
          createdAt: new Date().toISOString() // Adding the missing createdAt property
        };
        
        setUser(userData);
        
        toast({
          title: "Account created!",
          description: "Welcome to Social Loan Ledger!",
          duration: 5000,
        });
        
        return result; // Return the full result
      }
      
      return result; // Return whatever we got
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast({
        title: "Registration failed",
        description: err.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user } = await signIn(email, password);
      
      if (user) {
        const userData = await getCurrentUser();
        setUser(userData);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
          duration: 3000,
        });
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive",
        duration: 5000,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await signOut();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        duration: 3000,
      });
    } catch (err: any) {
      setError(err.message || "Logout failed");
      toast({
        title: "Logout failed",
        description: err.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await updateUserProfile(user.id, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        duration: 3000,
      });
    } catch (err: any) {
      setError(err.message || "Profile update failed");
      toast({
        title: "Update failed",
        description: err.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
