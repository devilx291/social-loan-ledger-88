import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserLoans, Loan } from "@/services/loanService";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertCircle } from "lucide-react";

const LoanHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'borrowed' | 'lent'>('all');
  
  const { data: loans, isLoading } = useQuery({
    queryKey: ['userLoans', user?.id, filter],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      
      return getUserLoans(user.id, filter === 'all' ? 'all' : 
                           filter === 'borrowed' ? 'borrower' : 'lender');
    },
    enabled: !!user,
  });

  // Status badge styles
  const getStatusBadge = (status: string) => {
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
      case 'overdue':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Loan History</h1>
          <p className="text-muted-foreground">
            View your complete loan history and transaction details
          </p>
        </header>

        <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Loans</TabsTrigger>
            <TabsTrigger value="borrowed">Loans Borrowed</TabsTrigger>
            <TabsTrigger value="lent">Loans Funded</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderLoansTable(loans, isLoading, navigate)}
          </TabsContent>
          
          <TabsContent value="borrowed" className="mt-0">
            {renderLoansTable(loans, isLoading, navigate)}
          </TabsContent>
          
          <TabsContent value="lent" className="mt-0">
            {renderLoansTable(loans, isLoading, navigate)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderLoansTable(loans: Loan[] | undefined, isLoading: boolean, navigate: any) {
    if (isLoading) {
      return (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!loans?.length) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Loan History</h2>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              You don't have any loan records that match the selected filter.
            </p>
            <Button onClick={() => navigate('/request-loan')}>
              Request a Loan
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Borrower</TableHead>
              <TableHead className="hidden md:table-cell">Lender</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">
                  ₹{loan.amount}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">
                  {loan.purpose}
                </TableCell>
                <TableCell>
                  {getStatusBadge(loan.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {loan.borrowerName || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {loan.lenderName || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(loan.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {loan.dueDate ? format(new Date(loan.dueDate), 'MMM d, yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                  >
                    View <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default LoanHistory;
