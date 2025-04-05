
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyDocument, getUserDocuments } from "@/services/documentService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UploadedDocument {
  userId: string;
  type: string;
  documentUrl: string;
  verified: boolean;
  verificationScore?: number;
}

const DocumentVerification = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  // Fetch user documents on component mount
  useState(() => {
    if (user) {
      loadUserDocuments();
    }
  });

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
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground mt-2">
            Verify your identity documents to increase your trust score
          </p>
        </header>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="upload" className="flex-1">Upload Documents</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Verification History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhaar Card Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Aadhaar Card</CardTitle>
                  <CardDescription>Upload your Aadhaar card for identity verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 mb-2">PDF, JPG, JPEG or PNG (max. 5MB)</p>
                      <div className="w-full">
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={isUploading}
                          onClick={() => document.getElementById("aadhaar-upload")?.click()}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Select File"
                          )}
                        </Button>
                        <input
                          id="aadhaar-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentUpload(e, "aadhaar")}
                        />
                      </div>
                    </div>
                    
                    {verificationStatus === "success" && verificationMessage && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Success</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {verificationMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {verificationStatus === "error" && verificationMessage && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{verificationMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Income Tax Return Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Income Tax Return</CardTitle>
                  <CardDescription>Upload your latest Income Tax Return document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 mb-2">PDF, JPG, JPEG or PNG (max. 5MB)</p>
                      <div className="w-full">
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={isUploading}
                          onClick={() => document.getElementById("itr-upload")?.click()}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Select File"
                          )}
                        </Button>
                        <input
                          id="itr-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentUpload(e, "itr")}
                        />
                      </div>
                    </div>
                    
                    {verificationStatus === "success" && verificationMessage && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Success</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {verificationMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {verificationStatus === "error" && verificationMessage && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{verificationMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {uploadedDocuments.length > 0 ? (
              <div className="space-y-6">
                {uploadedDocuments.map((doc, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{doc.type === "aadhaar" ? "Aadhaar Card" : "Income Tax Return"}</CardTitle>
                        <CardDescription>Uploaded document</CardDescription>
                      </div>
                      {doc.verified ? (
                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Failed
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {doc.verificationScore && (
                        <p className="text-sm text-gray-500">
                          Trust score impact: +{doc.verificationScore} points
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your identity documents to verify your account and increase your trust score
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
                    if (uploadTab) uploadTab.click();
                  }}
                >
                  Upload Documents
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentVerification;

