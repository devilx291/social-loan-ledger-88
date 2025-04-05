
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

// Store OTPs temporarily (in a real app, this would be in a database with expiration)
const otpStore: Record<string, { otp: string, expiresAt: number }> = {};

// Generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

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

// Send OTP to phone number
export const sendOtp = async (phoneNumber: string) => {
  // Simulate network delay
  await delay(1000);
  
  // Format phone number (remove +91 or 0 prefix if present)
  const formattedPhone = phoneNumber.replace(/^(\+91|0)/, '');
  
  // Generate a 4-digit OTP
  const otp = generateOTP();
  
  // Store OTP with 5 minute expiration
  otpStore[formattedPhone] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  };
  
  console.log(`OTP for ${formattedPhone}: ${otp}`); // For development purposes
  
  return { success: true, message: "OTP sent successfully" };
};

// Verify OTP
export const verifyUserOtp = async (phoneNumber: string, otp: string) => {
  // Simulate network delay
  await delay(800);
  
  // Format phone number
  const formattedPhone = phoneNumber.replace(/^(\+91|0)/, '');
  
  // Check if OTP exists and is valid
  const otpData = otpStore[formattedPhone];
  
  if (!otpData) {
    throw new Error("OTP expired or not found. Please request a new one.");
  }
  
  if (otpData.expiresAt < Date.now()) {
    delete otpStore[formattedPhone];
    throw new Error("OTP has expired. Please request a new one.");
  }
  
  if (otpData.otp !== otp) {
    throw new Error("Invalid OTP. Please try again.");
  }
  
  // OTP is valid, clean up
  delete otpStore[formattedPhone];
  
  // Find or create user
  let user = mockDataStore.users.find(u => u.phoneNumber === phoneNumber);
  
  if (!user) {
    // Create a new user if not found
    user = {
      id: uuidv4(),
      name: `User_${formattedPhone.substr(-4)}`, // Generate a name based on last 4 digits
      phoneNumber,
      trustScore: 50,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    mockDataStore.users.push(user);
    mockDataStore.persistData();
  }
  
  // Store current user in session storage
  sessionStorage.setItem('currentUserId', user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
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

// Process referral
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
