
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { verifyDocument, getUserDocuments } from "@/services/documentService";

interface UploadedDocument {
  userId: string;
  type: string;
  documentUrl: string;
  verified: boolean;
  verificationScore?: number;
}

export function useDocumentVerification() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    if (user) {
      loadUserDocuments();
    }
  }, [user]);

  const loadUserDocuments = async () => {
    if (!user) return;
    
    try {
      const documents = await getUserDocuments(user.id);
      setUploadedDocuments(documents as UploadedDocument[]);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // Maximum file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB",
      });
      return;
    }
    
    // Only allow PDF, JPG, JPEG, PNG
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, JPEG or PNG file",
      });
      return;
    }
    
    setIsUploading(true);
    setVerificationStatus("loading");
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", documentType);
      formData.append("userId", user.id);
      
      // Verify the document
      const result = await verifyDocument(formData);
      
      setVerificationStatus(result.verified ? "success" : "error");
      setVerificationMessage(result.message || "");
      
      if (result.verified) {
        // Update user trust score
        if (user && updateUser && result.score) {
          const newTrustScore = Math.min(100, user.trustScore + result.score);
          await updateUser({ ...user, trustScore: newTrustScore });
          
          toast({
            title: "Trust score updated",
            description: `Your trust score has increased by ${result.score} points.`,
          });
        }
        
        // Reload user documents
        await loadUserDocuments();
      } else {
        // If document is forged, set trust score to 0
        if (user && updateUser) {
          await updateUser({ ...user, trustScore: 0 });
          
          toast({
            variant: "destructive",
            title: "Document verification failed",
            description: "Your trust score has been reset to 0 due to potential document forgery.",
          });
        }
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      setVerificationStatus("error");
      setVerificationMessage("An error occurred during verification. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An error occurred during document verification.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    verificationStatus,
    verificationMessage,
    uploadedDocuments,
    handleDocumentUpload,
  };
}
