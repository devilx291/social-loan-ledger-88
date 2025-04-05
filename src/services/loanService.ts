
import { mockDataStore, Loan } from "@/lib/mockData";
import { v4 as uuidv4 } from 'uuid';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a new loan request
export const createLoanRequest = async (borrowerId: string, amount: number, purpose: string) => {
  await delay(800);
  
  const borrower = mockDataStore.users.find(u => u.id === borrowerId);
  
  if (!borrower) {
    throw new Error("Borrower not found");
  }
  
  const newLoan: Loan = {
    id: uuidv4(),
    amount,
    purpose,
    status: 'pending',
    borrowerId,
    borrowerName: borrower.name,
    borrowerTrustScore: borrower.trustScore,
    createdAt: new Date().toISOString()
  };
  
  mockDataStore.loans.push(newLoan);
  mockDataStore.persistData();
  
  return newLoan;
};

// Get all pending loan requests
export const getPendingLoans = async () => {
  await delay(500);
  
  return mockDataStore.loans.filter(loan => loan.status === 'pending');
};

// Get loans by user ID and status
export const getUserLoans = async (userId: string, status: 'all' | 'pending' | 'approved' | 'repaid' | 'overdue') => {
  await delay(500);
  
  let userLoans = mockDataStore.loans.filter(loan => 
    loan.borrowerId === userId || loan.lenderId === userId
  );
  
  if (status !== 'all') {
    userLoans = userLoans.filter(loan => loan.status === status);
  }
  
  return userLoans;
};

// Approve a loan
export const approveLoan = async (loanId: string, lenderId: string, dueDate: string) => {
  await delay(800);
  
  const loanIndex = mockDataStore.loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1) {
    throw new Error("Loan not found");
  }
  
  const lender = mockDataStore.users.find(u => u.id === lenderId);
  
  if (!lender) {
    throw new Error("Lender not found");
  }
  
  mockDataStore.loans[loanIndex] = {
    ...mockDataStore.loans[loanIndex],
    status: 'approved',
    lenderId,
    lenderName: lender.name,
    approvedAt: new Date().toISOString(),
    dueDate,
    transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`  // Mock transaction hash
  };
  
  mockDataStore.persistData();
  
  return mockDataStore.loans[loanIndex];
};

// Repay a loan
export const repayLoan = async (loanId: string) => {
  await delay(800);
  
  const loanIndex = mockDataStore.loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1) {
    throw new Error("Loan not found");
  }
  
  mockDataStore.loans[loanIndex] = {
    ...mockDataStore.loans[loanIndex],
    status: 'repaid',
    repaidAt: new Date().toISOString(),
    transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`  // Mock transaction hash
  };
  
  // Increase borrower's trust score
  const borrowerId = mockDataStore.loans[loanIndex].borrowerId;
  const borrowerIndex = mockDataStore.users.findIndex(u => u.id === borrowerId);
  
  if (borrowerIndex !== -1 && mockDataStore.users[borrowerIndex].trustScore < 100) {
    mockDataStore.users[borrowerIndex].trustScore += 5;
    if (mockDataStore.users[borrowerIndex].trustScore > 100) {
      mockDataStore.users[borrowerIndex].trustScore = 100;
    }
  }
  
  mockDataStore.persistData();
  
  return mockDataStore.loans[loanIndex];
};

// Get a specific loan by ID
export const getLoanById = async (loanId: string) => {
  await delay(300);
  
  const loan = mockDataStore.loans.find(loan => loan.id === loanId);
  
  if (!loan) {
    throw new Error("Loan not found");
  }
  
  return loan;
};

// Get ledger entries (all loans with transaction hashes)
export const getLedgerEntries = async () => {
  await delay(500);
  
  return mockDataStore.loans
    .filter(loan => loan.transactionHash)
    .sort((a, b) => {
      const dateA = a.repaidAt ? new Date(a.repaidAt) : 
                    a.approvedAt ? new Date(a.approvedAt) : 
                    new Date(a.createdAt);
      
      const dateB = b.repaidAt ? new Date(b.repaidAt) : 
                    b.approvedAt ? new Date(b.approvedAt) : 
                    new Date(b.createdAt);
      
      return dateB.getTime() - dateA.getTime();
    });
};
