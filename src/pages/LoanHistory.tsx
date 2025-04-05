
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getMockUserLoans, getMockLoanTransactions, validateBlockchain, Loan, Transaction, repayLoan } from "@/services/mockData";
import { CheckCircle, Clock, AlertTriangle, Search, ChevronRight, Lock, PiggyBank, Download, ArrowRight } from "lucide-react";

const LoanHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isChainValid, setIsChainValid] = useState<boolean | null>(null);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [loansData, transactionsData] = await Promise.all([
            getMockUserLoans(user.id),
            getMockLoanTransactions(user.id)
          ]);
          setLoans(loansData);
          setTransactions(transactionsData);
        } catch (error) {
          console.error("Failed to fetch data", error);
          toast({
            title: "Error loading data",
            description: "Could not load your loan history. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user, toast]);

  const handleValidateChain = async () => {
    setIsValidating(true);
    setIsChainValid(null);
    
    try {
      const isValid = await validateBlockchain();
      setIsChainValid(isValid);
      
      toast({
        title: isValid ? "Blockchain is valid" : "Blockchain validation failed",
        description: isValid 
          ? "All transactions in the ledger are valid and have not been tampered with."
          : "There may be inconsistencies in the blockchain. Please contact support.",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Failed to validate blockchain", error);
      setIsChainValid(false);
      toast({
        title: "Validation error",
        description: "Could not validate the blockchain. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRepayLoan = async (loanId: string) => {
    if (!user) return;
    
    setProcessingLoanId(loanId);
    
    try {
      const updatedLoan = await repayLoan(loanId);
      
      // Update local state
      setLoans(loans.map(loan => 
        loan.id === loanId ? updatedLoan : loan
      ));
      
      toast({
        title: "Loan repaid",
        description: "You have successfully repaid your loan. Your trust score will update shortly.",
      });
    } catch (error) {
      console.error("Failed to repay loan", error);
      toast({
        title: "Repayment failed",
        description: "There was an error processing your repayment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingLoanId(null);
    }
  };

  // Filter loans for different tabs
  const myBorrowedLoans = loans.filter(loan => loan.borrowerId === user?.id);
  const myLentLoans = loans.filter(loan => loan.lenderId === user?.id);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case "request": return "Loan Requested";
      case "approve": return "Loan Approved";
      case "repay": return "Loan Repaid";
      case "reject": return "Loan Rejected";
      default: return type;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Loan History</h1>
          <p className="text-muted-foreground">
            View your loans and transaction ledger
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="borrowed" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="borrowed">My Borrowed Loans</TabsTrigger>
              <TabsTrigger value="lent">My Lent Loans</TabsTrigger>
              <TabsTrigger value="ledger">Blockchain Ledger</TabsTrigger>
            </TabsList>
            
            <TabsContent value="borrowed">
              <Card>
                <CardHeader>
                  <CardTitle>Loans You've Borrowed</CardTitle>
                  <CardDescription>View your borrowing history and manage active loans</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : myBorrowedLoans.length > 0 ? (
                    <div className="space-y-4">
                      {myBorrowedLoans.map(loan => (
                        <Card key={loan.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4 border-b bg-muted/30">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  {loan.status === "pending" && <Clock className="h-5 w-5 text-amber-500" />}
                                  {loan.status === "approved" && <Clock className="h-5 w-5 text-blue-500" />}
                                  {loan.status === "repaid" && <CheckCircle className="h-5 w-5 text-trust-high" />}
                                  {loan.status === "overdue" && <AlertTriangle className="h-5 w-5 text-trust-low" />}
                                  <span className="font-medium">${loan.amount} - {loan.purpose}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  loan.status === "pending" ? "bg-amber-100 text-amber-800" :
                                  loan.status === "approved" ? "bg-blue-100 text-blue-800" :
                                  loan.status === "repaid" ? "bg-green-100 text-green-800" :
                                  loan.status === "overdue" ? "bg-red-100 text-red-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Requested on</p>
                                  <p>{new Date(loan.requestedDate).toLocaleDateString()}</p>
                                </div>
                                
                                {loan.approvedDate && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Approved on</p>
                                    <p>{new Date(loan.approvedDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                                
                                {loan.dueDate && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Due date</p>
                                    <p>{new Date(loan.dueDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                                
                                {loan.repaidDate && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Repaid on</p>
                                    <p>{new Date(loan.repaidDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm text-muted-foreground">Lender:</p>
                                  <p>{loan.lenderName || "Pending approval"}</p>
                                </div>
                                
                                {loan.status === "approved" && (
                                  <Button 
                                    onClick={() => handleRepayLoan(loan.id)}
                                    disabled={processingLoanId === loan.id}
                                  >
                                    {processingLoanId === loan.id ? (
                                      <>Processing...</>
                                    ) : (
                                      <>Repay Loan</>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No borrowed loans yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't borrowed any loans yet.
                      </p>
                      <Button onClick={() => window.location.href = "/request-loan"}>
                        Request a Loan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lent">
              <Card>
                <CardHeader>
                  <CardTitle>Loans You've Lent</CardTitle>
                  <CardDescription>View the details of loans you've funded</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : myLentLoans.length > 0 ? (
                    <div className="space-y-4">
                      {myLentLoans.map(loan => (
                        <Card key={loan.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4 border-b bg-muted/30">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  {loan.status === "approved" && <Clock className="h-5 w-5 text-blue-500" />}
                                  {loan.status === "repaid" && <CheckCircle className="h-5 w-5 text-trust-high" />}
                                  {loan.status === "overdue" && <AlertTriangle className="h-5 w-5 text-trust-low" />}
                                  <span className="font-medium">${loan.amount} - {loan.purpose}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  loan.status === "approved" ? "bg-blue-100 text-blue-800" :
                                  loan.status === "repaid" ? "bg-green-100 text-green-800" :
                                  loan.status === "overdue" ? "bg-red-100 text-red-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Requested on</p>
                                  <p>{new Date(loan.requestedDate).toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground">You approved on</p>
                                  <p>{new Date(loan.approvedDate || "").toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground">Due date</p>
                                  <p>{new Date(loan.dueDate || "").toLocaleDateString()}</p>
                                </div>
                                
                                {loan.repaidDate && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Repaid on</p>
                                    <p>{new Date(loan.repaidDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm text-muted-foreground">Borrower:</p>
                                  <p>{loan.borrowerName}</p>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm">
                                  <p className="text-muted-foreground">Trust Score:</p>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    loan.borrowerTrustScore < 40 ? "bg-red-100 text-red-800" :
                                    loan.borrowerTrustScore < 70 ? "bg-amber-100 text-amber-800" :
                                    "bg-green-100 text-green-800"
                                  }`}>
                                    {loan.borrowerTrustScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No lent loans yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't lent any loans yet. Help someone in need!
                      </p>
                      <Button onClick={() => window.location.href = "/approve-loans"}>
                        Fund a Loan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ledger">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Blockchain Ledger</CardTitle>
                    <CardDescription>All transactions are secured and verified in our blockchain</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                    <Button 
                      onClick={handleValidateChain}
                      disabled={isValidating}
                      className="flex items-center space-x-2"
                    >
                      {isValidating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                          <span>Validating...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Validate Chain</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isChainValid !== null && (
                    <div className={`p-3 mb-4 rounded-md ${
                      isChainValid ? "bg-green-50 text-green-700 border border-green-200" : 
                                    "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      <div className="flex items-center">
                        {isChainValid ? (
                          <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 mr-2" />
                        )}
                        <p>
                          {isChainValid 
                            ? "Blockchain validation successful! All records are secure and unaltered." 
                            : "Blockchain validation failed. Some records may have been tampered with."}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((tx, index) => (
                        <div key={tx.id} className="relative">
                          {index > 0 && (
                            <div className="absolute top-0 left-6 -mt-4 h-4 w-0.5 bg-gray-200"></div>
                          )}
                          <Card className="border-l-4 border-l-brand-primary">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                  <p className="text-sm font-medium mb-1">{formatTransactionType(tx.type)}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                                  <p className="font-medium">${tx.amount}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                                  <p className="text-xs truncate">{tx.id}</p>
                                </div>
                                
                                <div className="flex items-center">
                                  <Button variant="ghost" size="sm" className="ml-auto flex items-center">
                                    <Search className="h-4 w-4 mr-1" />
                                    <span>Details</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-dashed">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Previous Hash</p>
                                    <p className="text-xs font-mono bg-muted p-1 rounded overflow-hidden truncate">
                                      {tx.prevHash}
                                    </p>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <p className="text-xs text-muted-foreground mb-1">Current Hash</p>
                                    <div className="flex items-center">
                                      <ArrowRight className="h-4 w-4 text-brand-primary hidden md:block mr-2" />
                                      <p className="text-xs font-mono bg-muted p-1 rounded overflow-hidden truncate">
                                        {tx.currHash}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                      <p className="text-muted-foreground">
                        When loans are requested, approved, or repaid, they'll appear here in the blockchain ledger.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoanHistory;
