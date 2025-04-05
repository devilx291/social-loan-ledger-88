
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingLoans, approveLoan } from "@/services/loanService";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Calendar, User } from "lucide-react";
import { format, addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ApproveLoan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState(() => {
    // Default due date is 30 days from now
    return format(addDays(new Date(), 30), 'yyyy-MM-dd');
  });
  const [isApproving, setIsApproving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: pendingLoans, isLoading, refetch } = useQuery({
    queryKey: ['pendingLoans'],
    queryFn: getPendingLoans,
  });

  const handleApproveClick = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsDialogOpen(true);
  };

  const handleApproveLoan = async () => {
    if (!selectedLoanId || !user) return;
    
    setIsApproving(true);
    
    try {
      await approveLoan(selectedLoanId, user.id, dueDate);
      
      toast({
        title: "Loan approved",
        description: "You have successfully funded this loan",
      });
      
      refetch();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to approve loan", error);
      toast({
        title: "Approval failed",
        description: error.message || "There was an error approving this loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Filter out user's own loan requests
  const filteredLoans = pendingLoans?.filter(loan => loan.borrowerId !== user?.id) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Approve Loans</h1>
          <p className="text-muted-foreground">
            Help community members by funding their emergency loan requests
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredLoans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLoans.map((loan) => (
              <Card key={loan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    ₹{loan.amount}
                    {loan.borrowerTrustScore !== undefined && (
                      <TrustScoreBadge score={loan.borrowerTrustScore} />
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {loan.purpose}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Borrower</p>
                        <p>{loan.borrowerName || 'Anonymous'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Requested On</p>
                        <p>{format(new Date(loan.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <div className="w-full space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleApproveClick(loan.id)}
                    >
                      Fund This Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Pending Requests</h2>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                There are currently no pending loan requests from other users. Check back later or explore other sections.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approval Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Approval</DialogTitle>
            <DialogDescription>
              You are about to fund this emergency loan request. Please review the details and confirm.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 60), 'yyyy-MM-dd')}
              />
              <p className="text-sm text-muted-foreground">
                Set a reasonable due date between 7 and 60 days from today.
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-2">By approving this loan:</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>You agree to fund this emergency loan</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>This transaction will be recorded on the blockchain ledger</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Borrower's trust score will increase upon repayment</span>
                </li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveLoan}
              disabled={isApproving}
            >
              {isApproving ? "Processing..." : "Confirm & Fund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApproveLoan;
