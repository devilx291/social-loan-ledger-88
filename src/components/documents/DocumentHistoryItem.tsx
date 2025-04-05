
import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentHistoryItemProps {
  type: string;
  verified: boolean;
  verificationScore?: number;
}

const DocumentHistoryItem = ({ type, verified, verificationScore }: DocumentHistoryItemProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{type === "aadhaar" ? "Aadhaar Card" : "Income Tax Return"}</CardTitle>
          <CardDescription>Uploaded document</CardDescription>
        </div>
        {verified ? (
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
        {verificationScore && (
          <p className="text-sm text-gray-500">
            Trust score impact: +{verificationScore} points
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentHistoryItem;
