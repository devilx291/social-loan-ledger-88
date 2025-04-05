import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle, XCircle, Upload, FileCheck, Camera, UserCheck } from "lucide-react";
import { verifyDocument } from "@/services/documentService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  
  // Selfie KYC states
  const [showCamera, setShowCamera] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [selfieStatus, setSelfieStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [capturingSelfie, setCapturingSelfie] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
      // Check if user is already verified
      if (user.isVerified) {
        setSelfieStatus("verified");
      }
    }
  }, [user]);

  // Clean up camera stream when component unmounts or camera is hidden
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Stop camera when showCamera changes to false
  useEffect(() => {
    if (!showCamera && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [showCamera]);

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

  const navigateToDocumentVerification = () => {
    navigate("/document-verification");
  };

  // Start camera for selfie KYC
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setShowCamera(true);
        }
      } else {
        toast({
          title: "Camera access failed",
          description: "Your browser doesn't support camera access or permission was denied.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to complete KYC verification.",
        variant: "destructive",
      });
    }
  };

  // Capture selfie from camera
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        
        const imageData = canvasRef.current.toDataURL('image/png');
        setSelfieImage(imageData);
        
        // Stop the camera after capturing
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setShowCamera(false);
      }
    }
  };

  // Verify selfie for KYC
  const handleVerifySelfie = async () => {
    if (!selfieImage || !user) return;
    
    setCapturingSelfie(true);
    
    try {
      // Convert base64 to blob for FormData
      const response = await fetch(selfieImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('document', blob, 'selfie.png');
      formData.append('type', 'selfie');
      formData.append('userId', user.id);
      
      const result = await verifyDocument(formData);
      
      if (result.verified) {
        setSelfieStatus("verified");
        setVerificationMessage("Selfie verification successful. Your account is now verified.");
        
        // Update user trust score and verification status
        await updateUser({
          ...user,
          trustScore: Math.min(user.trustScore + 20, 100),
          isVerified: true
        });
        
        toast({
          title: "KYC completed",
          description: "Your identity has been verified successfully.",
          duration: 5000,
        });
      } else {
        setSelfieStatus("rejected");
        setVerificationMessage("Selfie verification failed. Please try again with better lighting and a clear face image.");
        
        toast({
          title: "Verification failed",
          description: result.message || "We couldn't verify your identity. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying selfie:", error);
      toast({
        title: "Verification error",
        description: error.message || "There was an error verifying your identity.",
        variant: "destructive",
      });
    } finally {
      setCapturingSelfie(false);
    }
  };

  // Reset selfie and restart camera
  const retakeSelfie = () => {
    setSelfieImage(null);
    setSelfieStatus("idle");
    startCamera();
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
              <TabsTrigger value="kyc" className="flex-1">KYC Verification</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
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
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      {user?.isVerified ? (
                        <div className="relative">
                          <AvatarImage src={selfieImage || "/placeholder.svg"} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <AvatarImage src={selfieImage || "/placeholder.svg"} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.phoneNumber}</p>
                      {user?.isVerified && (
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                          <UserCheck className="h-3 w-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
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
            
            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification</CardTitle>
                  <CardDescription>
                    Complete your identity verification to increase your trust score and access more features
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {verificationMessage && (
                    <Alert className={selfieStatus === "verified" ? "bg-green-50 border-green-200" : selfieStatus === "rejected" ? "bg-red-50 border-red-200" : ""}>
                      <AlertTitle>
                        {selfieStatus === "verified" ? "Verification successful" : "Verification failed"}
                      </AlertTitle>
                      <AlertDescription>{verificationMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Selfie Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Take a clear selfie to verify your identity. Make sure you're in a well-lit environment and your face is clearly visible.
                    </p>
                    
                    <div className="border rounded-lg p-4">
                      {showCamera ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-full max-w-md mb-4">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              className="w-full h-auto rounded-lg border border-gray-200"
                            />
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
                              <div className="border-2 border-dashed border-white w-64 h-64 rounded-full opacity-50"></div>
                            </div>
                          </div>
                          <Button onClick={captureSelfie}>
                            <Camera className="h-4 w-4 mr-2" />
                            Capture Selfie
                          </Button>
                        </div>
                      ) : selfieImage ? (
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-md mb-4">
                            <img 
                              src={selfieImage} 
                              alt="Your selfie" 
                              className="w-full h-auto rounded-lg border border-gray-200" 
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button onClick={retakeSelfie} variant="outline">
                              <Camera className="h-4 w-4 mr-2" />
                              Retake
                            </Button>
                            <Button 
                              onClick={handleVerifySelfie} 
                              disabled={capturingSelfie || selfieStatus === "verified"}
                            >
                              {capturingSelfie ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : selfieStatus === "verified" ? (
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              ) : (
                                <UserCheck className="h-4 w-4 mr-2" />
                              )}
                              {selfieStatus === "verified" ? "Verified" : "Verify Identity"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-8">
                          <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <Camera className="h-10 w-10 text-gray-500" />
                          </div>
                          <h4 className="text-lg font-medium mb-2">Take a selfie</h4>
                          <p className="text-sm text-center text-muted-foreground mb-4 max-w-md">
                            Your selfie will be securely stored and used only for identity verification purposes
                          </p>
                          <Button onClick={startCamera}>
                            <Camera className="h-4 w-4 mr-2" />
                            Start Camera
                          </Button>
                        </div>
                      )}
                      <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Why complete KYC verification?</h4>
                    <ul className="text-sm space-y-1 text-blue-600">
                      <li>• Increases your trust score by 20 points</li>
                      <li>• Adds a verified badge to your profile</li>
                      <li>• Unlock higher borrowing limits</li>
                      <li>• Faster loan approvals</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Document Verification</CardTitle>
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
                  
                  <div className="mt-6">
                    <Button onClick={navigateToDocumentVerification} variant="outline" className="w-full">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Go to Document Verification Page
                    </Button>
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
