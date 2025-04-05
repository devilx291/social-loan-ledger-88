
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, getCurrentUser, signIn, signUp, verifyOtp, signOut } from "@/services/authService";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  register: (name: string, phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  requestOtp: (phoneNumber: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session?.user) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user data", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error initializing auth", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const requestOtp = async (phoneNumber: string) => {
    try {
      await signIn(phoneNumber);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("OTP request failed", error);
      toast({
        title: "OTP Request Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      await verifyOtp(phoneNumber, otp);
      const userData = await getCurrentUser();
      setUser(userData);
      toast({
        title: "Login Successful",
        description: "Welcome to the Social Loan Ledger!",
      });
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your OTP and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, phoneNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      await signUp(phoneNumber, name, otp);
      const userData = await getCurrentUser();
      setUser(userData);
      toast({
        title: "Registration Successful",
        description: "Welcome to the Social Loan Ledger!",
      });
    } catch (error: any) {
      console.error("Registration failed", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout failed", error);
      toast({
        title: "Logout Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        requestOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
