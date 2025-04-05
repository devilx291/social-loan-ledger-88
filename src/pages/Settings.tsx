
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Camera, Link, Share2, UserCheck } from "lucide-react";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { toast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { updateUserTrustScore } from "@/services/authService";

const KYCVerification = () => {
  const { user, updateUser } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAccessDenied, setIsCameraAccessDenied] = useState(false);

  // Check if user is verified
  useEffect(() => {
    if (user?.isVerified) {
      setIsVerified(true);
    }
  }, [user]);

  const startCapture = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraAccessDenied(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraAccessDenied(true);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to complete KYC verification.",
        variant: "destructive",
      });
    }
  };

  const completeVerification = async () => {
    try {
      // Stop media tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      setIsCapturing(false);
      setIsVerified(true);
      
      // Update user verification status
      await updateUser({ ...user, isVerified: true });
      
      // Increase trust score for verification
      if (user) {
        await updateUserTrustScore(user.id, user.trustScore + 5);
      }
      
      toast({
        title: "Verification successful!",
        description: "Your account has been verified.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const cancelCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>KYC Verification</CardTitle>
          {isVerified && (
            <Badge className="bg-green-500 text-white flex gap-1 items-center">
              <UserCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        <CardDescription>
          Complete your identity verification to enhance your trust score and unlock additional features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="text-center py-6">
            <UserCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-medium">KYC Verification Completed</h3>
            <p className="text-muted-foreground mt-2">Your identity has been verified successfully.</p>
          </div>
        ) : isCapturing ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {stream && (
                <video
                  autoPlay
                  playsInline
                  ref={(videoElement) => {
                    if (videoElement && stream) {
                      videoElement.srcObject = stream;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              )}
              {isCameraAccessDenied && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Camera access denied</p>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={cancelCapture}>Cancel</Button>
              <Button onClick={completeVerification}>Capture & Verify</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Camera className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-medium">Start KYC Verification</h3>
            <p className="text-muted-foreground mt-2">We'll need access to your camera to take a photo for verification.</p>
            <Button className="mt-4" onClick={startCapture}>
              <Camera className="mr-2 h-4 w-4" />
              Start Verification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ReferralSystem = () => {
  const { user } = useAuth();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    if (user) {
      // Generate referral link using the user ID
      const link = `${window.location.origin}/register?ref=${user.id}`;
      setReferralLink(link);
    }
  }, [user]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral System</CardTitle>
        <CardDescription>
          Invite friends to join Social Loan Ledger. Both you and your referred friends will receive a trust score boost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Your Referral Link</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyReferralLink}>
              Copy
            </Button>
          </div>
          <div className="mt-2 p-2 bg-background border rounded-md">
            <p className="text-sm break-all">{referralLink}</p>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Referral Benefits
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex">
              <span className="text-muted-foreground mr-2">•</span>
              <span>You get +3 trust score for each successful referral</span>
            </li>
            <li className="flex">
              <span className="text-muted-foreground mr-2">•</span>
              <span>Your friends get +2 trust score when they sign up</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Share your link on social media to reach more people</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-muted-foreground">Trust Score:</p>
              <TrustScoreBadge score={user.trustScore} />
            </div>
          </div>

          <Tabs defaultValue="kyc" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="kyc" className="flex-1">KYC Verification</TabsTrigger>
              <TabsTrigger value="referral" className="flex-1">Referral System</TabsTrigger>
            </TabsList>
            <TabsContent value="kyc">
              <KYCVerification />
            </TabsContent>
            <TabsContent value="referral">
              <ReferralSystem />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
