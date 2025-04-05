import { supabase } from "@/integrations/supabase/client";

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

export const getTransactionsByLoanId = async (loanId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:user_id(name)
    `)
    .eq('loan_id', loanId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  
  if (!data) return [];

  return data.map(tx => ({
    id: tx.id,
    loanId: tx.loan_id,
    userId: tx.user_id,
    amount: tx.amount,
    transactionType: tx.transaction_type as TransactionType, // Properly cast the type
    prevHash: tx.prev_hash,
    currHash: tx.curr_hash,
    createdAt: tx.created_at,
    userName: tx.user?.name
  }));
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:user_id(name)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];

  return data.map(tx => ({
    id: tx.id,
    loanId: tx.loan_id,
    userId: tx.user_id,
    amount: tx.amount,
    transactionType: tx.transaction_type as TransactionType, // Properly cast the type
    prevHash: tx.prev_hash,
    currHash: tx.curr_hash,
    createdAt: tx.created_at,
    userName: tx.user?.name
  }));
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
  const { data: lastTransaction, error: lastTransactionError } = await supabase
    .from('transactions')
    .select('curr_hash')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (lastTransactionError && lastTransactionError.code !== '404') {
    throw lastTransactionError;
  }

  const prevHash = lastTransaction ? lastTransaction.curr_hash : null;

  const newTransaction = {
    loan_id: loanId,
    user_id: userId,
    amount,
    transaction_type: transactionType,
    prev_hash: prevHash,
  };

  const currHash = calculateHash(newTransaction, prevHash);

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        loan_id: loanId,
        user_id: userId,
        amount,
        transaction_type: transactionType,
        prev_hash: prevHash,
        curr_hash: currHash,
      },
    ])
    .select(`
      *,
      user:user_id(name)
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    loanId: data.loan_id,
    userId: data.user_id,
    amount: data.amount,
    transactionType: data.transaction_type as TransactionType,
    prevHash: data.prev_hash,
    currHash: data.curr_hash,
    createdAt: data.created_at,
    userName: data.user?.name
  };
};
