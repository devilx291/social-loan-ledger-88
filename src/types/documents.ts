
export interface UploadedDocument {
  userId: string;
  type: string;
  documentUrl: string;
  verified: boolean;
  verificationScore?: number;
  timestamp?: string;
}

export interface VerifyDocumentResult {
  verified: boolean;
  score?: number;
  message?: string;
}

export type DocumentType = 'aadhar' | 'taxReturn' | 'selfie';

export interface KycStatus {
  selfieVerified: boolean;
  aadharVerified: boolean;
  taxReturnVerified: boolean;
  lastUpdated?: string;
}
