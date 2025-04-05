
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/services/documentService";

export function useSelfieCapture() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [selfieStatus, setSelfieStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [capturingSelfie, setCapturingSelfie] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    // Check if user is already verified
    if (user?.isVerified) {
      setSelfieStatus("verified");
    }
  }, [user]);

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
          trustScore: Math.min(100, user.trustScore + 20),
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

  return {
    showCamera,
    selfieImage,
    selfieStatus,
    capturingSelfie,
    videoRef,
    canvasRef,
    verificationMessage,
    startCamera,
    captureSelfie,
    handleVerifySelfie,
    retakeSelfie
  };
}
