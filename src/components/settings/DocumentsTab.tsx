
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Upload, FileCheck, Loader2 } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

export const DocumentsTab = () => {
  const navigate = useNavigate();
  const {
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
  } = useDocumentUpload();

  const navigateToDocumentVerification = () => {
    navigate("/document-verification");
  };

  return (
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
  );
};
