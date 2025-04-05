
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle, XCircle, Upload, FileCheck } from "lucide-react";
import { verifyDocument } from "@/services/documentService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Document upload states
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [taxReturnFile, setTaxReturnFile] = useState<File | null>(null);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingTaxReturn, setUploadingTaxReturn] = useState(false);
  const [aadharStatus, setAadharStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [taxReturnStatus, setTaxReturnStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await updateUser({
        name,
        phoneNumber,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </header>

        <div className="max-w-3xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Upload Documents</TabsTrigger>
              <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how we can contact you
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your full name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="Your phone number" 
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload and verify your identity and financial documents to improve your trust score
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {verificationMessage && (
                    <Alert className={aadharStatus === "verified" || taxReturnStatus === "verified" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <AlertTitle>
                        {aadharStatus === "verified" || taxReturnStatus === "verified" ? "Verification successful" : "Verification failed"}
                      </AlertTitle>
                      <AlertDescription>{verificationMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Aadhar Card</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your Aadhar card to verify your identity. This helps strengthen your trust score.
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="aadhar-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">
                              {aadharFile ? aadharFile.name : "Click to upload Aadhar card"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PDF or image file, max 5MB
                            </span>
                          </div>
                          <Input 
                            id="aadhar-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*, application/pdf" 
                            onChange={handleAadharUpload} 
                          />
                        </Label>
                      </div>
                      
                      <Button 
                        onClick={handleVerifyAadhar} 
                        disabled={!aadharFile || uploadingAadhar}
                        className="min-w-[120px]"
                      >
                        {uploadingAadhar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : aadharStatus === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : aadharStatus === "rejected" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Income Tax Return</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your latest Income Tax Return (ITR) to verify your financial status. This helps increase your borrowing capacity.
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="tax-return-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                            <FileCheck className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">
                              {taxReturnFile ? taxReturnFile.name : "Click to upload Income Tax Return"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PDF or image file, max 5MB
                            </span>
                          </div>
                          <Input 
                            id="tax-return-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*, application/pdf" 
                            onChange={handleTaxReturnUpload} 
                          />
                        </Label>
                      </div>
                      
                      <Button 
                        onClick={handleVerifyTaxReturn} 
                        disabled={!taxReturnFile || uploadingTaxReturn}
                        className="min-w-[120px]"
                      >
                        {uploadingTaxReturn ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : taxReturnStatus === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : taxReturnStatus === "rejected" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Why upload your documents?</h4>
                    <ul className="text-sm space-y-1 text-blue-600">
                      <li>• Verified documents can increase your trust score by up to 30 points</li>
                      <li>• Higher trust scores allow you to borrow larger amounts</li>
                      <li>• Documents are securely verified with blockchain technology</li>
                      <li>• Forged or false documents will reset your trust score to zero</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your security settings and authentication preferences
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Security settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notification settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
