import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoanById, repayLoan } from "@/services/loanService";
import { getTransactionsByLoanId } from "@/services/transactionService";
import { useToast } from "@/components/ui/use-toast";
import { format, isAfter } from "date-fns";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CircleDollarSign, 
  FileCheck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: loan, isLoading: isLoadingLoan } = useQuery({
    queryKey: ['loan', id],
    queryFn: () => (id ? getLoanById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['loanTransactions', id],
    queryFn: () => (id ? getTransactionsByLoanId(id) : Promise.resolve([])),
    enabled: !!id,
  });
  
  const repayMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Missing required data");
      return repayLoan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan', id] });
      queryClient.invalidateQueries({ queryKey: ['loanTransactions', id] });
      queryClient.invalidateQueries({ queryKey: ['userLoans', user?.id] });
      setIsDialogOpen(false);
      toast({
        title: "Loan repaid successfully",
        description: "Thank you for repaying your loan. Your trust score has been increased.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Repayment failed",
        description: error.message || "There was an error processing your repayment. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const isLoading = isLoadingLoan || isLoadingTransactions;
  const isOverdue = loan?.dueDate && isAfter(new Date(), new Date(loan.dueDate)) && loan.status === 'approved';
  
  const isBorrower = loan?.borrowerId === user?.id;
  const isLender = loan?.lenderId === user?.id;
  
  const canRepay = isBorrower && loan?.status === 'approved';

  const handleRepay = () => {
    setIsDialogOpen(true);
  };
  
  const confirmRepay = () => {
    repayMutation.mutate();
  };

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue && status === 'approved') {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'pending':
        variant = "secondary";
        break;
      case 'approved':
        variant = "default";
        break;
      case 'paid':
        variant = "outline";
        break;
      case 'rejected':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant} className="capitalize">{status}</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-2 -ml-3" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Loan Details</h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : loan ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">₹{loan.amount}</CardTitle>
                      <CardDescription className="mt-1">
                        Loan ID: {loan.id.slice(0, 8)}...
                      </CardDescription>
                    </div>
                    {getStatusBadge(loan.status, !!isOverdue)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Purpose</h3>
                    <p className="text-muted-foreground">{loan.purpose}</p>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Borrower</p>
                        <p className="font-medium">{loan.borrowerName || 'Anonymous'}</p>
                        {isBorrower && <p className="text-xs text-brand-primary">(You)</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lender</p>
                        <p className="font-medium">
                          {loan.lenderName || (loan.status === 'pending' ? 'Pending Approval' : 'Anonymous')}
                        </p>
                        {isLender && <p className="text-xs text-brand-primary">(You)</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created On</p>
                        <p className="font-medium">{format(new Date(loan.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    
                    {loan.status !== 'pending' && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">
                            {loan.dueDate 
                              ? format(new Date(loan.dueDate), 'MMM d, yyyy')
                              : 'Not set'}
                          </p>
                          {isOverdue && (
                            <p className="text-xs text-destructive">Overdue</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {loan.status === 'approved' && (
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Approved On</p>
                          <p className="font-medium">
                            {loan.approvedAt 
                              ? format(new Date(loan.approvedAt), 'MMM d, yyyy')
                              : 'Not available'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {loan.status === 'paid' && (
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Repaid On</p>
                          <p className="font-medium">
                            {loan.paidAt 
                              ? format(new Date(loan.paidAt), 'MMM d, yyyy')
                              : 'Not available'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                {canRepay && (
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleRepay}
                      disabled={repayMutation.isPending}
                    >
                      {repayMutation.isPending ? "Processing..." : "Repay Loan"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Loan Timeline</CardTitle>
                  <CardDescription>
                    Blockchain-verified transaction history for this loan
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {transactions && transactions.length > 0 ? (
                    <div className="relative pl-6 border-l-2 border-muted space-y-6">
                      {transactions.map((tx, index) => (
                        <div key={tx.id} className="relative">
                          <div className="absolute -left-[25px] rounded-full bg-background p-1 border-2 border-muted">
                            {tx.transactionType === 'request' && <CircleDollarSign className="h-4 w-4 text-brand-primary" />}
                            {tx.transactionType === 'approve' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {tx.transactionType === 'reject' && <AlertCircle className="h-4 w-4 text-destructive" />}
                            {tx.transactionType === 'repay' && <FileCheck className="h-4 w-4 text-brand-primary" />}
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium capitalize">
                                {tx.transactionType === 'request' && 'Loan Requested'}
                                {tx.transactionType === 'approve' && 'Loan Approved'}
                                {tx.transactionType === 'reject' && 'Loan Rejected'}
                                {tx.transactionType === 'repay' && 'Loan Repaid'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                            
                            <p className="text-sm mt-1">
                              {tx.userName || 'Anonymous'} {tx.transactionType === 'request' ? 'requested' : tx.transactionType === 'approve' ? 'approved' : tx.transactionType === 'repay' ? 'repaid' : 'rejected'} a loan of ₹{tx.amount}
                            </p>
                            
                            <Accordion type="single" collapsible className="mt-2">
                              <AccordionItem value="hash">
                                <AccordionTrigger className="text-xs py-1">
                                  View Blockchain Details
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-1 text-xs font-mono overflow-x-auto">
                                    <p className="text-muted-foreground">Transaction Hash:</p>
                                    <p className="break-all bg-muted p-1 rounded">{tx.currHash}</p>
                                    {tx.prevHash && (
                                      <>
                                        <p className="text-muted-foreground mt-2">Previous Hash:</p>
                                        <p className="break-all bg-muted p-1 rounded">{tx.prevHash}</p>
                                      </>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No transaction history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Loan Terms</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₹{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Term</span>
                    <span className="font-medium">30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total to Repay</span>
                    <span className="font-medium">₹{loan.amount}</span>
                  </div>
                  
                  <div className="h-px bg-border my-2"></div>
                  
                  <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                    <p className="font-medium">Loan Conditions:</p>
                    <ul className="space-y-1">
                      <li>• No interest charged (community support)</li>
                      <li>• Late repayment will affect trust score</li>
                      <li>• Early repayment available with no penalty</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {loan.borrowerTrustScore !== undefined && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Borrower Trust Score</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{loan.borrowerTrustScore}</span>
                      <TrustScoreBadge score={loan.borrowerTrustScore} />
                    </div>
                    
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${loan.borrowerTrustScore}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Trust scores reflect repayment history and community standing. Higher scores indicate more reliable borrowers.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                The loan you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Repayment</DialogTitle>
            <DialogDescription>
              You are about to repay your loan of ₹{loan?.amount}. This will be recorded on the blockchain ledger.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-medium mb-2">Benefits of Repayment:</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Your trust score will increase</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>You'll be eligible for larger loans in the future</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>The transaction will be verified on the blockchain</span>
              </li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={repayMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRepay}
              disabled={repayMutation.isPending}
            >
              {repayMutation.isPending ? "Processing..." : "Confirm Repayment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanDetails;
