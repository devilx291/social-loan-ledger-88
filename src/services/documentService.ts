
import { VerifyDocumentResult, UploadedDocument } from "@/types/documents";

// This is a mock implementation for document verification
// In a real application, this would call a backend service for verification
export const verifyDocument = async (formData: FormData): Promise<VerifyDocumentResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const documentType = formData.get('type') as string;
  const file = formData.get('document') as File;
  const userId = formData.get('userId') as string;
  
  console.log(`Verifying ${documentType} document for user ${userId}`);
  
  // In a real implementation, this would upload the file to storage
  // and then call a verification service to check for forgery
  
  // For demo purposes, we'll randomly verify or reject based on file size
  // This is just for demonstration - in a real app you'd use actual verification
  const randomSuccess = Math.random() > 0.3; // 70% chance of success for demo
  
  if (randomSuccess) {
    return {
      verified: true,
      score: 15,
      message: `${documentType} verification successful`
    };
  } else {
    return {
      verified: false,
      message: `${documentType} verification failed. Document appears to be invalid or forged.`
    };
  }
};

export const getUserDocuments = async (userId: string): Promise<UploadedDocument[]> => {
  // This would fetch from the database in a real implementation
  // Simulating an empty response for now
  return [];
};
