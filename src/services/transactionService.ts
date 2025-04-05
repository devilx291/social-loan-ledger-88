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

export const getTransactionHistory = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:profiles!user_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(tx => ({
    id: tx.id,
    loanId: tx.loan_id,
    userId: tx.user_id,
    amount: tx.amount,
    transactionType: tx.transaction_type as TransactionType,
    prevHash: tx.prev_hash,
    currHash: tx.curr_hash,
    createdAt: tx.created_at,
    userName: tx.user?.name,
  }));
};

export const getLoanTransactions = async (loanId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:profiles!user_id(name)
    `)
    .eq('loan_id', loanId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map(tx => ({
    id: tx.id,
    loanId: tx.loan_id,
    userId: tx.user_id,
    amount: tx.amount,
    transactionType: tx.transaction_type as TransactionType,
    prevHash: tx.prev_hash,
    currHash: tx.curr_hash,
    createdAt: tx.created_at,
    userName: tx.user?.name,
  }));
};

export const verifyBlockchain = async (): Promise<{valid: boolean, invalidBlocks: string[]}> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  const invalidBlocks: string[] = [];
  let prevHash: string | null = null;

  for (let i = 0; i < data.length; i++) {
    const tx = data[i];
    
    // Verify that prevHash in this block matches the currHash of the previous block
    if (i > 0 && tx.prev_hash !== data[i-1].curr_hash) {
      invalidBlocks.push(tx.id);
      continue;
    }
    
    // Verify that this block's prevHash field is correct
    if (i === 0 && tx.prev_hash !== null) {
      invalidBlocks.push(tx.id);
      continue;
    }
    
    // Calculate hash to verify
    const { data: calcHash } = await supabase.rpc('calculate_transaction_hash', {
      p_prev_hash: tx.prev_hash,
      p_loan_id: tx.loan_id,
      p_user_id: tx.user_id,
      p_amount: tx.amount,
      p_transaction_type: tx.transaction_type,
      p_timestamp: tx.created_at,
    });
    
    // Verify the block's hash is correct
    if (calcHash !== tx.curr_hash) {
      invalidBlocks.push(tx.id);
    }
    
    prevHash = tx.curr_hash;
  }

  return {
    valid: invalidBlocks.length === 0,
    invalidBlocks,
  };
};
