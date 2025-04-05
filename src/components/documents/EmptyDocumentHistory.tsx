
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDocumentHistoryProps {
  onUploadClick: () => void;
}

const EmptyDocumentHistory = ({ onUploadClick }: EmptyDocumentHistoryProps) => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
        <Upload className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
      <p className="text-muted-foreground mb-6">
        Upload your identity documents to verify your account and increase your trust score
      </p>
      <Button variant="outline" onClick={onUploadClick}>
        Upload Documents
      </Button>
    </div>
  );
};

export default EmptyDocumentHistory;
