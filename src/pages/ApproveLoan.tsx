
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { useToast } from "@/components/ui/use-toast";
import { getMockPendingLoans, approveLoan, Loan } from "@/services/mockData";
import { User, HandHeart, Clock, AlertTriangle } from "lucide-react";

const ApproveLoan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingLoans = async () => {
      if (user) {
        try {
          const data = await getMockPendingLoans(user.id);
          setPendingLoans(data);
        } catch (error) {
          console.error("Failed to fetch pending loans", error);
          toast({
            title: "Error loading loans",
            description: "Could not load pending loan requests. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPendingLoans();
  }, [user, toast]);

  const handleApprove = async (loanId: string) => {
    if (!user) return;
    
    setProcessingLoanId(loanId);
    
    try {
      await approveLoan(loanId, user.id);
      
      // Update local state
      setPendingLoans(pendingLoans.filter(loan => loan.id !== loanId));
      
      toast({
        title: "Loan approved",
        description: "You have successfully approved the loan request.",
      });
    } catch (error) {
      console.error("Failed to approve loan", error);
      toast({
        title: "Approval failed",
        description: "There was an error approving the loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingLoanId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Approve Loans</h1>
          <p className="text-muted-foreground">
            Review and fund loan requests from community members
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : pendingLoans.length > 0 ? (
            <div className="space-y-6">
              {pendingLoans.map(loan => (
                <Card key={loan.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{loan.borrowerName}</h3>
                            <TrustScoreBadge score={loan.borrowerTrustScore} />
                          </div>
                        </div>
                        
                        <div className="text-center md:text-right">
                          <p className="text-2xl font-bold">${loan.amount}</p>
                          <p className="text-sm text-muted-foreground">Requested on {new Date(loan.requestedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md mb-4">
                        <h4 className="font-medium mb-1">Loan Purpose:</h4>
                        <p>{loan.purpose}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>30 day repayment period</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            disabled={!!processingLoanId}
                            className="flex items-center space-x-2"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span>Decline</span>
                          </Button>
                          
                          <Button
                            onClick={() => handleApprove(loan.id)}
                            disabled={processingLoanId === loan.id}
                            className="flex items-center space-x-2"
                          >
                            {processingLoanId === loan.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <HandHeart className="h-4 w-4" />
                                <span>Approve</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-4 mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No pending loan requests</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  There are currently no pending loan requests. Check back later or visit the dashboard to see your lending activity.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveLoan;
