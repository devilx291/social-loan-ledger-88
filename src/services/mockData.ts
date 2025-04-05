
export type LoanStatus = "pending" | "approved" | "rejected" | "repaid" | "overdue";

export type Loan = {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerTrustScore: number;
  lenderId: string | null;
  lenderName: string | null;
  amount: number;
  purpose: string;
  status: LoanStatus;
  requestedDate: string;
  approvedDate: string | null;
  dueDate: string | null;
  repaidDate: string | null;
  blockHash: string;
};

export type Transaction = {
  id: string;
  loanId: string;
  type: "request" | "approve" | "repay" | "reject";
  timestamp: string;
  userId: string;
  amount: number;
  prevHash: string;
  currHash: string;
};

// Mock loans data
const generateMockLoans = (userId: string): Loan[] => {
  const statuses: LoanStatus[] = ["pending", "approved", "rejected", "repaid", "overdue"];
  const purposes = [
    "Medical emergency",
    "School fees",
    "Home repair",
    "Business investment",
    "Family emergency"
  ];
  
  return Array.from({ length: 10 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isUserBorrower = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 900) + 100;
    const requestedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      id: `loan-${i}`,
      borrowerId: isUserBorrower ? userId : `user-${Math.floor(Math.random() * 1000)}`,
      borrowerName: isUserBorrower ? "You" : `User ${Math.floor(Math.random() * 1000)}`,
      borrowerTrustScore: Math.floor(Math.random() * 100),
      lenderId: status === "pending" ? null : (isUserBorrower ? `user-${Math.floor(Math.random() * 1000)}` : userId),
      lenderName: status === "pending" ? null : (isUserBorrower ? `User ${Math.floor(Math.random() * 1000)}` : "You"),
      amount,
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      status,
      requestedDate,
      approvedDate: status !== "pending" && status !== "rejected" 
        ? new Date(new Date(requestedDate).getTime() + 24 * 60 * 60 * 1000).toISOString() 
        : null,
      dueDate: status !== "pending" && status !== "rejected"
        ? new Date(new Date(requestedDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
      repaidDate: status === "repaid" 
        ? new Date(new Date(requestedDate).getTime() + 20 * 24 * 60 * 60 * 1000).toISOString() 
        : null,
      blockHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
  });
};

// Generate hash for transactions (simplified blockchain simulation)
const generateHash = (prevHash: string, data: string): string => {
  // In a real implementation, you would use a proper hashing function
  const hash = Array.from(prevHash + data)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16);
  
  return `0x${hash.padStart(64, '0')}`;
};

// Generate mock transactions based on loans
const generateMockTransactions = (loans: Loan[]): Transaction[] => {
  let transactions: Transaction[] = [];
  let prevHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
  
  loans.forEach(loan => {
    // Request transaction
    const requestData = `${loan.id}:${loan.borrowerId}:${loan.amount}:request`;
    const requestHash = generateHash(prevHash, requestData);
    
    transactions.push({
      id: `tx-request-${loan.id}`,
      loanId: loan.id,
      type: "request",
      timestamp: loan.requestedDate,
      userId: loan.borrowerId,
      amount: loan.amount,
      prevHash,
      currHash: requestHash
    });
    
    prevHash = requestHash;
    
    // Only add approve/reject transaction if loan is not pending
    if (loan.status !== "pending") {
      const actionType = loan.status === "rejected" ? "reject" : "approve";
      const actionData = `${loan.id}:${loan.lenderId}:${loan.amount}:${actionType}`;
      const actionHash = generateHash(prevHash, actionData);
      
      transactions.push({
        id: `tx-${actionType}-${loan.id}`,
        loanId: loan.id,
        type: actionType as any,
        timestamp: loan.approvedDate || new Date().toISOString(),
        userId: loan.lenderId || "",
        amount: loan.amount,
        prevHash,
        currHash: actionHash
      });
      
      prevHash = actionHash;
    }
    
    // Add repay transaction if loan is repaid
    if (loan.status === "repaid") {
      const repayData = `${loan.id}:${loan.borrowerId}:${loan.amount}:repay`;
      const repayHash = generateHash(prevHash, repayData);
      
      transactions.push({
        id: `tx-repay-${loan.id}`,
        loanId: loan.id,
        type: "repay",
        timestamp: loan.repaidDate || new Date().toISOString(),
        userId: loan.borrowerId,
        amount: loan.amount,
        prevHash,
        currHash: repayHash
      });
    }
  });
  
  return transactions;
};

// Mock API calls
export const getMockUserLoans = async (userId: string): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const loans = generateMockLoans(userId);
  return loans;
};

export const getMockPendingLoans = async (userId: string): Promise<Loan[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const loans = generateMockLoans(userId);
  // Filter only pending loans where the user is not the borrower
  return loans.filter(loan => 
    loan.status === "pending" && loan.borrowerId !== userId
  );
};

export const getMockLoanTransactions = async (userId: string): Promise<Transaction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const loans = generateMockLoans(userId);
  return generateMockTransactions(loans);
};

export const requestLoan = async (
  userId: string, 
  amount: number, 
  purpose: string
): Promise<Loan> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newLoan: Loan = {
    id: `loan-${Date.now()}`,
    borrowerId: userId,
    borrowerName: "You",
    borrowerTrustScore: 70,
    lenderId: null,
    lenderName: null,
    amount,
    purpose,
    status: "pending",
    requestedDate: new Date().toISOString(),
    approvedDate: null,
    dueDate: null,
    repaidDate: null,
    blockHash: `0x${Math.random().toString(16).substr(2, 64)}`
  };
  
  return newLoan;
};

export const approveLoan = async (loanId: string, userId: string): Promise<Loan> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would fetch the loan from the backend and update it
  return {
    id: loanId,
    borrowerId: `user-${Math.floor(Math.random() * 1000)}`,
    borrowerName: `User ${Math.floor(Math.random() * 1000)}`,
    borrowerTrustScore: Math.floor(Math.random() * 100),
    lenderId: userId,
    lenderName: "You",
    amount: Math.floor(Math.random() * 900) + 100,
    purpose: "Emergency funds",
    status: "approved",
    requestedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approvedDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    repaidDate: null,
    blockHash: `0x${Math.random().toString(16).substr(2, 64)}`
  };
};

export const repayLoan = async (loanId: string): Promise<Loan> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would fetch the loan from the backend and update it
  return {
    id: loanId,
    borrowerId: `user-${Math.floor(Math.random() * 1000)}`,
    borrowerName: "You",
    borrowerTrustScore: Math.floor(Math.random() * 100),
    lenderId: `user-${Math.floor(Math.random() * 1000)}`,
    lenderName: `User ${Math.floor(Math.random() * 1000)}`,
    amount: Math.floor(Math.random() * 900) + 100,
    purpose: "Emergency funds",
    status: "repaid",
    requestedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    approvedDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    repaidDate: new Date().toISOString(),
    blockHash: `0x${Math.random().toString(16).substr(2, 64)}`
  };
};

export const validateBlockchain = async (): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, you would validate the blockchain
  return true;
};
