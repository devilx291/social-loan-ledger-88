
import React from "react";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  inputId: string;
  isUploading: boolean;
  verificationStatus: "idle" | "loading" | "success" | "error";
  verificationMessage: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploadCard = ({
  title,
  description,
  inputId,
  isUploading,
  verificationStatus,
  verificationMessage,
  onFileChange,
}: DocumentUploadCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                onClick={() => document.getElementById(inputId)?.click()}
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
                id={inputId}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onFileChange}
              />
            </div>
          </div>
          
          {verificationStatus === "success" && verificationMessage && (
            <Alert variant="default" className="bg-green-50 border-green-200">
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
  );
};

export default DocumentUploadCard;
