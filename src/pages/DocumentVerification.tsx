
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploadCard from "@/components/documents/DocumentUploadCard";
import DocumentHistoryItem from "@/components/documents/DocumentHistoryItem";
import EmptyDocumentHistory from "@/components/documents/EmptyDocumentHistory";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";

const DocumentVerification = () => {
  const navigate = useNavigate();
  const { 
    isUploading, 
    verificationStatus, 
    verificationMessage, 
    uploadedDocuments, 
    handleDocumentUpload 
  } = useDocumentVerification();
  
  const uploadTabRef = useRef<HTMLButtonElement>(null);
  
  const switchToUploadTab = () => {
    if (uploadTabRef.current instanceof HTMLElement) {
      uploadTabRef.current.click();
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
            <TabsTrigger ref={uploadTabRef} value="upload" className="flex-1">Upload Documents</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Verification History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhaar Card Upload */}
              <DocumentUploadCard
                title="Aadhaar Card"
                description="Upload your Aadhaar card for identity verification"
                inputId="aadhaar-upload"
                isUploading={isUploading}
                verificationStatus={verificationStatus}
                verificationMessage={verificationMessage}
                onFileChange={(e) => handleDocumentUpload(e, "aadhaar")}
              />
              
              {/* Income Tax Return Upload */}
              <DocumentUploadCard
                title="Income Tax Return"
                description="Upload your latest Income Tax Return document"
                inputId="itr-upload"
                isUploading={isUploading}
                verificationStatus={verificationStatus}
                verificationMessage={verificationMessage}
                onFileChange={(e) => handleDocumentUpload(e, "itr")}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {uploadedDocuments.length > 0 ? (
              <div className="space-y-6">
                {uploadedDocuments.map((doc, index) => (
                  <DocumentHistoryItem
                    key={index}
                    type={doc.type}
                    verified={doc.verified}
                    verificationScore={doc.verificationScore}
                  />
                ))}
              </div>
            ) : (
              <EmptyDocumentHistory onUploadClick={switchToUploadTab} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentVerification;
