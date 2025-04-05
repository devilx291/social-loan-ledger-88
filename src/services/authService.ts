
import { mockDataStore } from "@/lib/mockData";
import { v4 as uuidv4 } from 'uuid';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Export AuthUser interface
export interface AuthUser {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  trustScore: number;
  isVerified?: boolean;
  selfieImage?: string | null;
  createdAt: string;
}

// Sign up a new user
export const signUp = async (email: string, name: string, password: string) => {
  // Simulate network delay
  await delay(800);
  
  // Check if user already exists
  const existingUser = mockDataStore.users.find(u => u.email === email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  
  const newUser: AuthUser = {
    id: uuidv4(),
    name,
    phoneNumber: email,
    email,
    password,
    trustScore: 50,
    isVerified: false,
    createdAt: new Date().toISOString()
  };
  
  mockDataStore.users.push(newUser);
  mockDataStore.persistData();
  
  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      trustScore: newUser.trustScore,
      isVerified: newUser.isVerified
    }
  };
};

// Sign in
export const signIn = async (email: string, password: string) => {
  // Simulate network delay
  await delay(800);
  
  const user = mockDataStore.users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Store current user in session storage
  sessionStorage.setItem('currentUserId', user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      trustScore: user.trustScore,
      isVerified: user.isVerified
    }
  };
};

// Sign out
export const signOut = async () => {
  await delay(300);
  sessionStorage.removeItem('currentUserId');
  return { success: true };
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const userId = sessionStorage.getItem('currentUserId');
  
  if (!userId) {
    return null;
  }
  
  const user = mockDataStore.users.find(u => u.id === userId);
  
  if (!user) {
    sessionStorage.removeItem('currentUserId');
    return null;
  }
  
  return {
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    trustScore: user.trustScore,
    isVerified: user.isVerified,
    selfieImage: user.selfieImage,
    createdAt: user.createdAt
  };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
  await delay(500);
  
  const userIndex = mockDataStore.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  mockDataStore.users[userIndex] = {
    ...mockDataStore.users[userIndex],
    ...updates
  };
  
  mockDataStore.persistData();
  
  return {
    success: true,
    user: mockDataStore.users[userIndex]
  };
};

// Update user trust score
export const updateUserTrustScore = async (userId: string, trustScore: number) => {
  await delay(500);
  
  const userIndex = mockDataStore.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  mockDataStore.users[userIndex].trustScore = trustScore;
  mockDataStore.persistData();
  
  return {
    success: true,
    user: mockDataStore.users[userIndex]
  };
};

// Process referral - adding missing function
export const processReferral = async (referrerId: string, newUserId: string) => {
  await delay(800);
  
  const referrerIndex = mockDataStore.users.findIndex(u => u.id === referrerId);
  const newUserIndex = mockDataStore.users.findIndex(u => u.id === newUserId);
  
  if (referrerIndex === -1 || newUserIndex === -1) {
    throw new Error("User not found");
  }
  
  // Increase trust scores for both referrer and new user
  const referrerTrustScore = Math.min(100, mockDataStore.users[referrerIndex].trustScore + 5);
  const newUserTrustScore = Math.min(100, mockDataStore.users[newUserIndex].trustScore + 10);
  
  mockDataStore.users[referrerIndex].trustScore = referrerTrustScore;
  mockDataStore.users[newUserIndex].trustScore = newUserTrustScore;
  
  mockDataStore.persistData();
  
  return {
    success: true,
    referrer: mockDataStore.users[referrerIndex],
    newUser: mockDataStore.users[newUserIndex]
  };
};
