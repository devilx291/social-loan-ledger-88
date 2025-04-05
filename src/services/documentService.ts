
import { mockDataStore, Document } from "@/lib/mockData";
import { v4 as uuidv4 } from 'uuid';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Verify a document
export const verifyDocument = async (formData: FormData) => {
  await delay(1500);  // Longer delay to simulate verification process
  
  const userId = formData.get('userId') as string;
  const type = formData.get('type') as string;
  const document = formData.get('document');
  
  if (!userId || !type || !document) {
    throw new Error("Missing required document information");
  }
  
  // Simulate verification process with 90% success rate
  const isVerified = Math.random() > 0.1;
  
  // Create a verification score based on document type
  let verificationScore = 0;
  if (isVerified) {
    if (type === 'aadhaar' || type === 'taxReturn') {
      verificationScore = 15;
    } else if (type === 'selfie') {
      verificationScore = 20;
    }
  }
  
  // Create a new document record
  if (isVerified) {
    const newDocument: Document = {
      id: uuidv4(),
      userId,
      type,
      documentUrl: `mock-document-url-${Date.now()}`,
      verified: true,
      verificationScore,
      createdAt: new Date().toISOString()
    };
    
    mockDataStore.documents.push(newDocument);
    
    // Update user's trust score
    const userIndex = mockDataStore.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (type === 'selfie') {
        mockDataStore.users[userIndex].isVerified = true;
        mockDataStore.users[userIndex].selfieImage = 'data:image/png;base64,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';
      }
      
      mockDataStore.users[userIndex].trustScore += verificationScore;
      if (mockDataStore.users[userIndex].trustScore > 100) {
        mockDataStore.users[userIndex].trustScore = 100;
      }
    }
    
    mockDataStore.persistData();
    
    return {
      verified: true,
      score: verificationScore,
      message: `Your ${type} has been successfully verified!`
    };
  }
  
  return {
    verified: false,
    score: 0,
    message: `We couldn't verify your ${type}. Please check that it's clear and try again.`
  };
};

// Get documents by user ID
export const getUserDocuments = async (userId: string) => {
  await delay(500);
  
  return mockDataStore.documents.filter(doc => doc.userId === userId);
};
