
import { v4 as uuidv4 } from 'uuid';

export type TransactionType = 'request' | 'approve' | 'reject' | 'repay';

export type Transaction = {
  id: string;
  loanId: string | null;
  userId: string;
  amount: number;
  transactionType: TransactionType;
  prevHash: string | null;
  currHash: string;
  createdAt: string;
  userName?: string;
};

// Mock transactions storage
let transactions: Transaction[] = [];

// Helper to persist transactions to localStorage
const persistTransactions = () => {
  try {
    localStorage.setItem('mock_transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error("Error persisting transactions:", error);
  }
};

// Helper to load transactions from localStorage
const loadTransactions = () => {
  try {
    const persistedTransactions = localStorage.getItem('mock_transactions');
    if (persistedTransactions) {
      transactions = JSON.parse(persistedTransactions);
    }
  } catch (error) {
    console.error("Error loading persisted transactions:", error);
  }
};

// Load transactions when module initializes
loadTransactions();

export const getTransactionsByLoanId = async (loanId: string): Promise<Transaction[]> => {
  return transactions.filter(tx => tx.loanId === loanId);
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  return [...transactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Implementation of getLoanTransactions (alias for getTransactionsByLoanId)
export const getLoanTransactions = getTransactionsByLoanId;

// Implementation of the missing getTransactionHistory function (alias for getAllTransactions)
export const getTransactionHistory = getAllTransactions;

// Implement a mock verify blockchain function
export type BlockchainVerificationResult = {
  valid: boolean;
  invalidBlocks: string[];
};

export const verifyBlockchain = async (): Promise<BlockchainVerificationResult> => {
  // Simple mock implementation - assumes all transactions are valid
  return {
    valid: true,
    invalidBlocks: [],
  };
};

const calculateHash = (transaction: Omit<Transaction, 'id' | 'currHash' | 'createdAt'>, prevHash: string | null): string => {
  const data = JSON.stringify({ ...transaction, prevHash });
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

export const createTransaction = async (
  loanId: string | null,
  userId: string,
  amount: number,
  transactionType: TransactionType
): Promise<Transaction> => {
  // Get the last transaction to calculate the new hash
  const lastTransaction = transactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const prevHash = lastTransaction ? lastTransaction.currHash : null;

  const newTransactionData = {
    loanId,
    userId,
    amount,
    transactionType,
    prevHash,
  };

  const currHash = calculateHash(newTransactionData, prevHash);

  const newTransaction: Transaction = {
    id: uuidv4(),
    ...newTransactionData,
    currHash,
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  persistTransactions();

  return newTransaction;
};
