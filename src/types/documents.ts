
export interface UploadedDocument {
  userId: string;
  type: string;
  documentUrl: string;
  verified: boolean;
  verificationScore?: number;
}

export interface VerifyDocumentResult {
  verified: boolean;
  score?: number;
  message?: string;
}
