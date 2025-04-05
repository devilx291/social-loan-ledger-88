
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  name: string;
  phoneNumber: string; // This will store email
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
  
  // Fetch the profile data from the profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error("Error fetching profile:", error);
    // Fallback to user metadata if profile fetch fails
    return {
      id: user.id,
      name: user.user_metadata?.name || 'User',
      phoneNumber: user.email || '',
      trustScore: 50,
    };
  }
  
  return {
    id: user.id,
    name: profile.name || user.user_metadata?.name || 'User',
    phoneNumber: user.email || '',
    trustScore: profile.trust_score || 50,
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

// Updated function to update a user's trust score
export const updateUserTrustScore = async (userId: string, trustScore: number) => {
  try {
    // First, make sure the score is within valid range
    const boundedScore = Math.max(0, Math.min(100, trustScore));
    
    // Call the RPC function to update trust score
    const { error } = await supabase.rpc('update_trust_score', {
      user_id: userId,
      score_change: boundedScore - 50 // Assuming 50 is the base score, adjust by difference
    });

    if (error) {
      console.error("Error updating trust score:", error);
      throw error;
    }
    
    // Verify the update by fetching the updated profile
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching updated profile:", fetchError);
    } else {
      console.log("Updated trust score:", data.trust_score);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to update trust score:", error);
    throw error;
  }
};
