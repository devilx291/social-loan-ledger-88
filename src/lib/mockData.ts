
// This file contains mock data for the application
// It will be replaced with actual database implementation later

import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from '@/services/authService';
import { Loan } from '@/services/loanService';

// Mock Document Data
export interface Document {
  id: string;
  userId: string;
  type: string;
  documentUrl: string;
  verified: boolean;
  verificationScore?: number;
  createdAt: string;
}

// Initial data
let users: AuthUser[] = [
  {
    id: "1",
    name: "John Doe",
    phoneNumber: "9876543210",
    email: "john@example.com",
    password: "password123",
    trustScore: 75,
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Jane Smith",
    phoneNumber: "8765432109",
    email: "jane@example.com",
    password: "password123",
    trustScore: 65,
    isVerified: false,
    createdAt: new Date().toISOString()
  }
];

let loans: Loan[] = [
  {
    id: "1",
    amount: 5000,
    purpose: "Medical emergency",
    status: "pending",
    borrowerId: "1",
    borrowerName: "John Doe",
    borrowerTrustScore: 75,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    amount: 10000,
    purpose: "Education fees",
    status: "approved",
    borrowerId: "1",
    borrowerName: "John Doe",
    borrowerTrustScore: 75,
    lenderId: "2",
    lenderName: "Jane Smith",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    amount: 7500,
    purpose: "Home repairs",
    status: "approved",
    borrowerId: "2",
    borrowerName: "Jane Smith",
    borrowerTrustScore: 65,
    lenderId: "1",
    lenderName: "John Doe",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let documents: Document[] = [
  {
    id: "1",
    userId: "1",
    type: "aadhaar",
    documentUrl: "mock-document-url-1",
    verified: true,
    verificationScore: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    userId: "2",
    type: "taxReturn",
    documentUrl: "mock-document-url-2",
    verified: true,
    verificationScore: 15,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to persist mock data to localStorage
const persistData = () => {
  try {
    localStorage.setItem('mock_users', JSON.stringify(users));
    localStorage.setItem('mock_loans', JSON.stringify(loans));
    localStorage.setItem('mock_documents', JSON.stringify(documents));
  } catch (error) {
    console.error("Error persisting mock data:", error);
  }
};

// Helper to load mock data from localStorage
const loadPersistedData = () => {
  try {
    const persistedUsers = localStorage.getItem('mock_users');
    const persistedLoans = localStorage.getItem('mock_loans');
    const persistedDocuments = localStorage.getItem('mock_documents');
    
    if (persistedUsers) users = JSON.parse(persistedUsers);
    if (persistedLoans) loans = JSON.parse(persistedLoans);
    if (persistedDocuments) documents = JSON.parse(persistedDocuments);
  } catch (error) {
    console.error("Error loading persisted mock data:", error);
  }
};

// Load any persisted data when this module initializes
loadPersistedData();

export const mockDataStore = {
  users,
  loans,
  documents,
  persistData
};
