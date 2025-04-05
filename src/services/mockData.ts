
import { supabase } from "@/integrations/supabase/client";
import { createLoanRequest } from "@/services/loanService";

// This file contains mock data and functions for development purposes
// In production, these would be replaced by real API calls

export const requestLoan = async (userId: string, amount: number, purpose: string) => {
  console.log(`Mock loan request: ${userId} requested ${amount} for ${purpose}`);
  // In a real app, this would call the backend API
  // For now, we'll directly use our real service functions
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the actual service function if available, otherwise mock the response
    if (typeof createLoanRequest === 'function') {
      return await createLoanRequest(userId, amount, purpose);
    } else {
      // Mock response
      return {
        id: `loan-${Math.random().toString(36).substring(2, 9)}`,
        borrowerId: userId,
        lenderId: null,
        amount,
        purpose,
        status: 'pending',
        createdAt: new Date().toISOString(),
        approvedAt: null,
        dueDate: null,
        paidAt: null
      };
    }
  } catch (error) {
    console.error("Error in mock requestLoan:", error);
    throw error;
  }
};

// Add other mock functions as needed for development and testing
