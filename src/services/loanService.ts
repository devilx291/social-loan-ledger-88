
import { supabase } from "@/integrations/supabase/client";

export type Loan = {
  id: string;
  borrowerId: string;
  lenderId: string | null;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue';
  createdAt: string;
  approvedAt: string | null;
  dueDate: string | null;
  paidAt: string | null;
  borrowerName?: string;
  lenderName?: string;
  borrowerTrustScore?: number; // Added missing property
};

export const createLoanRequest = async (
  borrowerId: string,
  amount: number,
  purpose: string
) => {
  // First create the loan record
  const { data: loan, error: loanError } = await supabase
    .from('loans')
    .insert({
      borrower_id: borrowerId,
      amount,
      purpose,
      status: 'pending',
    })
    .select()
    .single();

  if (loanError) throw loanError;

  // Get the latest transaction hash
  const { data: lastTransaction } = await supabase
    .from('transactions')
    .select('curr_hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const prevHash = lastTransaction?.curr_hash || null;

  // Calculate current timestamp
  const timestamp = new Date().toISOString();

  // Get hash for this transaction
  const { data: hashData } = await supabase.rpc('calculate_transaction_hash', {
    p_prev_hash: prevHash,
    p_loan_id: loan.id,
    p_user_id: borrowerId,
    p_amount: amount,
    p_transaction_type: 'request',
    p_timestamp: timestamp,
  });

  // Create transaction record
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      loan_id: loan.id,
      user_id: borrowerId,
      amount,
      transaction_type: 'request',
      prev_hash: prevHash,
      curr_hash: hashData,
    });

  if (transactionError) throw transactionError;

  return loan;
};

export const approveLoan = async (
  loanId: string,
  lenderId: string,
  dueDate: string
) => {
  // First get the loan details
  const { data: loan, error: loanFetchError } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single();

  if (loanFetchError) throw loanFetchError;

  // Update the loan record
  const { data: updatedLoan, error: loanUpdateError } = await supabase
    .from('loans')
    .update({
      lender_id: lenderId,
      status: 'approved',
      approved_at: new Date().toISOString(),
      due_date: dueDate,
    })
    .eq('id', loanId)
    .select()
    .single();

  if (loanUpdateError) throw loanUpdateError;

  // Get the latest transaction hash
  const { data: lastTransaction } = await supabase
    .from('transactions')
    .select('curr_hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const prevHash = lastTransaction?.curr_hash || null;

  // Calculate current timestamp
  const timestamp = new Date().toISOString();

  // Get hash for this transaction
  const { data: hashData } = await supabase.rpc('calculate_transaction_hash', {
    p_prev_hash: prevHash,
    p_loan_id: loanId,
    p_user_id: lenderId,
    p_amount: loan.amount,
    p_transaction_type: 'approve',
    p_timestamp: timestamp,
  });

  // Create transaction record
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      loan_id: loanId,
      user_id: lenderId,
      amount: loan.amount,
      transaction_type: 'approve',
      prev_hash: prevHash,
      curr_hash: hashData,
    });

  if (transactionError) throw transactionError;

  // Update trust score for borrower (increase by 2 for getting a loan approved)
  await supabase.rpc('update_trust_score', {
    user_id: loan.borrower_id,
    score_change: 2,
  });

  return updatedLoan;
};

export const repayLoan = async (loanId: string, borrowerId: string) => {
  // First get the loan details
  const { data: loan, error: loanFetchError } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single();

  if (loanFetchError) throw loanFetchError;

  // Update the loan record
  const { data: updatedLoan, error: loanUpdateError } = await supabase
    .from('loans')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', loanId)
    .select()
    .single();

  if (loanUpdateError) throw loanUpdateError;

  // Get the latest transaction hash
  const { data: lastTransaction } = await supabase
    .from('transactions')
    .select('curr_hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const prevHash = lastTransaction?.curr_hash || null;

  // Calculate current timestamp
  const timestamp = new Date().toISOString();

  // Get hash for this transaction
  const { data: hashData } = await supabase.rpc('calculate_transaction_hash', {
    p_prev_hash: prevHash,
    p_loan_id: loanId,
    p_user_id: borrowerId,
    p_amount: loan.amount,
    p_transaction_type: 'repay',
    p_timestamp: timestamp,
  });

  // Create transaction record
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      loan_id: loanId,
      user_id: borrowerId,
      amount: loan.amount,
      transaction_type: 'repay',
      prev_hash: prevHash,
      curr_hash: hashData,
    });

  if (transactionError) throw transactionError;

  // Update trust score for borrower (increase by 5 for repaying loan)
  await supabase.rpc('update_trust_score', {
    user_id: borrowerId,
    score_change: 5,
  });

  return updatedLoan;
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      borrower:profiles!borrower_id(name, trust_score),
      lender:profiles!lender_id(name)
    `)
    .eq('id', loanId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    borrowerId: data.borrower_id,
    lenderId: data.lender_id,
    amount: data.amount,
    purpose: data.purpose,
    status: data.status,
    createdAt: data.created_at,
    approvedAt: data.approved_at,
    dueDate: data.due_date,
    paidAt: data.paid_at,
    borrowerName: data.borrower?.name,
    lenderName: data.lender?.name,
    borrowerTrustScore: data.borrower?.trust_score,
  };
};

export const getUserLoans = async (userId: string, type: 'borrower' | 'lender' | 'all' = 'all'): Promise<Loan[]> => {
  let query = supabase
    .from('loans')
    .select(`
      *,
      borrower:profiles!borrower_id(name),
      lender:profiles!lender_id(name)
    `);

  if (type === 'borrower') {
    query = query.eq('borrower_id', userId);
  } else if (type === 'lender') {
    query = query.eq('lender_id', userId);
  } else {
    query = query.or(`borrower_id.eq.${userId},lender_id.eq.${userId}`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(loan => ({
    id: loan.id,
    borrowerId: loan.borrower_id,
    lenderId: loan.lender_id,
    amount: loan.amount,
    purpose: loan.purpose,
    status: loan.status,
    createdAt: loan.created_at,
    approvedAt: loan.approved_at,
    dueDate: loan.due_date,
    paidAt: loan.paid_at,
    borrowerName: loan.borrower?.name,
    lenderName: loan.lender?.name,
  }));
};

export const getPendingLoans = async (): Promise<Loan[]> => {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      borrower:profiles!borrower_id(name, trust_score)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(loan => ({
    id: loan.id,
    borrowerId: loan.borrower_id,
    lenderId: loan.lender_id,
    amount: loan.amount,
    purpose: loan.purpose,
    status: loan.status,
    createdAt: loan.created_at,
    approvedAt: loan.approved_at,
    dueDate: loan.due_date,
    paidAt: loan.paid_at,
    borrowerName: loan.borrower?.name,
    borrowerTrustScore: loan.borrower?.trust_score,
  }));
};
