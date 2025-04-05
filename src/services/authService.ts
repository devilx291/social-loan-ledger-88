
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

// New function to update a user's trust score
export const updateUserTrustScore = async (userId: string, trustScore: number) => {
  // Call the RPC function to update trust score
  const { error } = await supabase.rpc('update_trust_score', {
    user_id: userId,
    score_change: trustScore - 50 // Assuming 50 is the base score, adjust by difference
  });

  if (error) throw error;
  return true;
};
