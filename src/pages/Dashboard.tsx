
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { getUserLoans, Loan } from "@/services/loanService";
import { PiggyBank, ArrowRight, Calendar, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: loans, isLoading } = useQuery({
    queryKey: ['userLoans', user?.id],
    queryFn: () => (user ? getUserLoans(user.id, 'all') : Promise.resolve([])),
    enabled: !!user,
  });
  
  const pendingLoans = loans?.filter(loan => loan.status === 'pending' && loan.borrowerId === user?.id) || [];
  const approvedLoans = loans?.filter(loan => loan.status === 'approved' && loan.borrowerId === user?.id) || [];
  const lentLoans = loans?.filter(loan => loan.lenderId === user?.id) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Trust Score Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trust Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">{user?.trustScore}</p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
                <TrustScoreBadge score={user?.trustScore || 0} />
              </div>
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary rounded-full" 
                    style={{ width: `${user?.trustScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <p className="text-xs text-muted-foreground">
                Your trust score increases as you repay loans on time.
              </p>
            </CardFooter>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-between" 
                onClick={() => navigate('/request-loan')}
              >
                Request a Loan
                <PiggyBank className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/approve-loans')}
              >
                Fund a Loan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Requests</span>
                <span className="font-medium">{pendingLoans.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Loans</span>
                <span className="font-medium">{approvedLoans.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Loans You've Funded</span>
                <span className="font-medium">{lentLoans.length}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate('/loan-history')}
              >
                View Loan History
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Active Loans Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Active Loans</h2>
            {approvedLoans.length > 0 && (
              <Button variant="ghost" onClick={() => navigate('/loan-history')}>
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading loan data...</p>
            </div>
          ) : approvedLoans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedLoans.slice(0, 3).map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.purpose}
                        </CardDescription>
                      </div>
                      <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">
                        Active
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">
                            {loan.dueDate ? format(new Date(loan.dueDate), 'MMM d, yyyy') : 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Lender</p>
                          <p className="font-medium">{loan.lenderName || 'Anonymous'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="bg-muted-foreground/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PiggyBank className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No Active Loans</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    You don't have any active loans at the moment.
                  </p>
                  <Button onClick={() => navigate('/request-loan')}>
                    Request a Loan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Loan Requests */}
        {pendingLoans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Pending Requests</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingLoans.map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.purpose}
                        </CardDescription>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                        Pending
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Requested On</p>
                          <p className="font-medium">
                            {format(new Date(loan.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Loans You've Funded */}
        {lentLoans.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Loans You've Funded</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lentLoans.slice(0, 3).map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.borrowerName || 'Anonymous'}
                        </CardDescription>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        loan.status === 'approved' 
                          ? 'bg-amber-100 text-amber-700' 
                          : loan.status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {loan.status === 'approved' ? 'Active' : 
                         loan.status === 'paid' ? 'Repaid' : 'Overdue'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">
                            {loan.status === 'paid' ? 'Repaid On' : 'Due Date'}
                          </p>
                          <p className="font-medium">
                            {loan.status === 'paid' && loan.paidAt 
                              ? format(new Date(loan.paidAt), 'MMM d, yyyy')
                              : loan.dueDate 
                              ? format(new Date(loan.dueDate), 'MMM d, yyyy') 
                              : 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        {loan.status === 'paid' 
                          ? <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                          : <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />}
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium capitalize">{loan.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
