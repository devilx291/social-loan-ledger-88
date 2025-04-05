
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/services/documentService";

export function useDocumentUpload() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [taxReturnFile, setTaxReturnFile] = useState<File | null>(null);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingTaxReturn, setUploadingTaxReturn] = useState(false);
  const [aadharStatus, setAadharStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [taxReturnStatus, setTaxReturnStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleAadharUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAadharFile(file);
    }
  };

  const handleTaxReturnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTaxReturnFile(file);
    }
  };

  const handleVerifyAadhar = async () => {
    if (!aadharFile || !user) return;
    
    setUploadingAadhar(true);
    
    try {
      const formData = new FormData();
      formData.append('document', aadharFile);
      formData.append('type', 'aadhar');
      formData.append('userId', user.id);
      
      const result = await verifyDocument(formData);
      
      if (result.verified) {
        setAadharStatus("verified");
        setVerificationMessage("Aadhar card successfully verified. Your trust score has been updated.");
        
        // Update user trust score if document was verified
        if (user.trustScore < 100) {
          await updateUser({
            ...user,
            trustScore: Math.min(user.trustScore + 15, 100)
          });
        }
        
        toast({
          title: "Document verified",
          description: "Aadhar card has been successfully verified.",
        });
      } else {
        setAadharStatus("rejected");
        setVerificationMessage("Aadhar card verification failed. This may affect your trust score.");
        
        // Set trust score to zero if forgery is detected
        await updateUser({
          ...user,
          trustScore: 0
        });
        
        toast({
          title: "Verification failed",
          description: "Document appears to be invalid or forged.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying document:", error);
      toast({
        title: "Verification error",
        description: error.message || "There was an error verifying your document.",
        variant: "destructive",
      });
    } finally {
      setUploadingAadhar(false);
    }
  };

  const handleVerifyTaxReturn = async () => {
    if (!taxReturnFile || !user) return;
    
    setUploadingTaxReturn(true);
    
    try {
      const formData = new FormData();
      formData.append('document', taxReturnFile);
      formData.append('type', 'taxReturn');
      formData.append('userId', user.id);
      
      const result = await verifyDocument(formData);
      
      if (result.verified) {
        setTaxReturnStatus("verified");
        setVerificationMessage("Income Tax Return successfully verified. Your trust score has been updated.");
        
        // Update user trust score if document was verified
        if (user.trustScore < 100) {
          await updateUser({
            ...user,
            trustScore: Math.min(user.trustScore + 15, 100)
          });
        }
        
        toast({
          title: "Document verified",
          description: "Income Tax Return has been successfully verified.",
        });
      } else {
        setTaxReturnStatus("rejected");
        setVerificationMessage("Income Tax Return verification failed. This may affect your trust score.");
        
        // Set trust score to zero if forgery is detected
        await updateUser({
          ...user,
          trustScore: 0
        });
        
        toast({
          title: "Verification failed",
          description: "Document appears to be invalid or forged.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying document:", error);
      toast({
        title: "Verification error",
        description: error.message || "There was an error verifying your document.",
        variant: "destructive",
      });
    } finally {
      setUploadingTaxReturn(false);
    }
  };

  return {
    aadharFile,
    taxReturnFile,
    uploadingAadhar,
    uploadingTaxReturn,
    aadharStatus,
    taxReturnStatus,
    verificationMessage,
    handleAadharUpload,
    handleTaxReturnUpload,
    handleVerifyAadhar,
    handleVerifyTaxReturn
  };
}
