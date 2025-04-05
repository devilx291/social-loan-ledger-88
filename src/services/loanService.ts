
import { supabase } from "@/integrations/supabase/client";

export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue';

export type Loan = {
  id: string;
  borrowerId: string;
  lenderId: string | null;
  amount: number;
  purpose: string;
  status: LoanStatus;
  createdAt: string;
  approvedAt: string | null;
  dueDate: string | null;
  paidAt: string | null;
  borrowerName?: string;
  lenderName?: string;
  borrowerTrustScore?: number;
};

// Helper function to transform database loan to our Loan type
const transformDatabaseLoan = (loan: any): Loan => ({
  id: loan.id,
  borrowerId: loan.borrower_id,
  lenderId: loan.lender_id,
  amount: loan.amount,
  purpose: loan.purpose,
  status: loan.status as LoanStatus,
  createdAt: loan.created_at,
  approvedAt: loan.approved_at,
  dueDate: loan.due_date,
  paidAt: loan.paid_at,
  borrowerName: loan.borrower?.name,
  lenderName: loan.lender?.name,
  borrowerTrustScore: loan.borrower?.trust_score
});

export const createLoanRequest = async (
  borrowerId: string,
  amount: number,
  purpose: string
): Promise<Loan> => {
  const { data, error } = await supabase
    .from('loans')
    .insert([
      {
        borrower_id: borrowerId,
        amount: amount,
        purpose: purpose,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return transformDatabaseLoan(data);
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      borrower:borrower_id(name, trust_score),
      lender:lender_id(name)
    `)
    .eq('id', loanId)
    .single();

  if (error) throw error;

  if (!data) return null;

  return transformDatabaseLoan(data);
};

export const approveLoan = async (
  loanId: string,
  lenderId: string,
  dueDate: string
): Promise<Loan> => {
  const { data, error } = await supabase
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

  if (error) throw error;

  return transformDatabaseLoan(data);
};

export const repayLoan = async (
  loanId: string,
  borrowerId: string
): Promise<Loan> => {
  const { data, error } = await supabase
    .from('loans')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', loanId)
    .eq('borrower_id', borrowerId)
    .select()
    .single();

  if (error) throw error;

  return transformDatabaseLoan(data);
};

// Implementation of the missing getUserLoans function
export const getUserLoans = async (userId: string, type?: 'borrower' | 'lender' | 'all'): Promise<Loan[]> => {
  let query = supabase
    .from('loans')
    .select(`
      *,
      borrower:borrower_id(name, trust_score),
      lender:lender_id(name)
    `);
    
  if (type === 'borrower') {
    query = query.eq('borrower_id', userId);
  } else if (type === 'lender') {
    query = query.eq('lender_id', userId);
  } else {
    // For 'all' or undefined, get both borrowed and lent loans
    query = query.or(`borrower_id.eq.${userId},lender_id.eq.${userId}`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];

  // Transform the data to match our Loan type
  return data.map(loan => transformDatabaseLoan(loan));
};

export const getPendingLoans = async (): Promise<Loan[]> => {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      borrower:borrower_id(name, trust_score),
      lender:lender_id(name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];

  return data.map(loan => transformDatabaseLoan(loan));
};

export const getLoanHistory = async (): Promise<Loan[]> => {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      borrower:borrower_id(name, trust_score),
      lender:lender_id(name)
    `)
    .not('status', 'eq', 'pending')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];

  return data.map(loan => transformDatabaseLoan(loan));
};
