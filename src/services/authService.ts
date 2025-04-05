
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  name: string;
  phoneNumber: string;
  trustScore: number;
};

export const signUp = async (phoneNumber: string, name: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    phone: phoneNumber,
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

export const signIn = async (phoneNumber: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: phoneNumber,
    password,
  });

  if (error) throw error;
  return data;
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: 'sms',
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
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name,
    phoneNumber: profile.phone_number || '',
    trustScore: profile.trust_score,
  };
};

export const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      phone_number: updates.phoneNumber,
    })
    .eq('id', userId);
    
  if (error) throw error;
  return data;
};
