
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  name: string;
  phoneNumber: string; // This will now store email
  trustScore: number;
};

export const signUp = async (email: string, name: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // We're emulating a real user until the profiles table is set up
  // In a production app, you'd fetch this from a profiles table
  return {
    id: user.id,
    name: user.user_metadata?.name || 'User',
    phoneNumber: user.email || '',
    trustScore: 50,
  };
};

export const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
  // Here we would update the user profile in a profiles table
  // For now, we'll just update the user metadata
  const { error } = await supabase.auth.updateUser({
    data: {
      name: updates.name,
    }
  });
    
  if (error) throw error;
  return true;
};
