
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent text-transparent bg-clip-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Trust Score Card */}
          <Card className="border-none shadow-card overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white">
              <CardTitle className="text-lg">Trust Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{user?.trustScore}</p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
                <TrustScoreBadge score={user?.trustScore || 0} />
              </div>
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" 
                    style={{ width: `${user?.trustScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-muted-foreground">
              <p>Your trust score increases as you repay loans on time.</p>
            </CardFooter>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-none shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-between bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity" 
                onClick={() => navigate('/request-loan')}
              >
                Request a Loan
                <PiggyBank className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between border-brand-primary text-brand-primary hover:bg-brand-primary/5"
                onClick={() => navigate('/approve-loans')}
              >
                Fund a Loan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-between bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20"
                onClick={() => navigate('/credit-assessment')}
              >
                Take Credit Assessment
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="border-none shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <span className="text-gray-700 font-medium">Pending Requests</span>
                <span className="font-bold text-brand-primary">{pendingLoans.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <span className="text-gray-700 font-medium">Active Loans</span>
                <span className="font-bold text-brand-primary">{approvedLoans.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <span className="text-gray-700 font-medium">Loans You've Funded</span>
                <span className="font-bold text-brand-primary">{lentLoans.length}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="ghost" 
                className="w-full text-brand-primary hover:bg-brand-primary/5" 
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
            <h2 className="text-xl font-bold text-gray-800">Your Active Loans</h2>
            {approvedLoans.length > 0 && (
              <Button variant="ghost" onClick={() => navigate('/loan-history')} className="text-brand-primary hover:bg-brand-primary/5">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p>Loading loan data...</p>
            </div>
          ) : approvedLoans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedLoans.slice(0, 3).map((loan) => (
                <Card key={loan.id} className="border-none shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.purpose}
                        </CardDescription>
                      </div>
                      <div className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">
                        Active
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <div className="bg-brand-primary/10 p-2 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-4 w-4 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium text-gray-800">
                            {loan.dueDate ? format(new Date(loan.dueDate), 'MMM d, yyyy') : 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-brand-accent/10 p-2 rounded-full mr-3 mt-0.5">
                          <TrendingUp className="h-4 w-4 text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lender</p>
                          <p className="font-medium text-gray-800">{loan.lenderName || 'Anonymous'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary/5" 
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-none shadow-sm">
              <CardContent className="py-10">
                <div className="text-center">
                  <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <PiggyBank className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">No Active Loans</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    You don't have any active loans at the moment. Need some financial support?
                  </p>
                  <Button onClick={() => navigate('/request-loan')} className="bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity">
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Pending Requests</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingLoans.map((loan) => (
                <Card key={loan.id} className="border-none shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.purpose}
                        </CardDescription>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
                        Pending
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-4 w-4 text-yellow-700" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Requested On</p>
                          <p className="font-medium text-gray-800">
                            {format(new Date(loan.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary/5" 
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Loans You've Funded</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lentLoans.slice(0, 3).map((loan) => (
                <Card key={loan.id} className="border-none shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">₹{loan.amount}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {loan.borrowerName || 'Anonymous'}
                        </CardDescription>
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full font-medium ${
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
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 mt-0.5 ${
                          loan.status === 'approved' 
                            ? 'bg-brand-primary/10' 
                            : loan.status === 'paid' 
                            ? 'bg-brand-success/10'
                            : 'bg-red-100'
                        }`}>
                          <Calendar className={`h-4 w-4 ${
                            loan.status === 'approved' 
                              ? 'text-brand-primary' 
                              : loan.status === 'paid' 
                              ? 'text-brand-success'
                              : 'text-red-500'
                          }`} />
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {loan.status === 'paid' ? 'Repaid On' : 'Due Date'}
                          </p>
                          <p className="font-medium text-gray-800">
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
                          ? <div className="bg-brand-success/10 p-2 rounded-full mr-3 mt-0.5">
                              <CheckCircle2 className="h-4 w-4 text-brand-success" />
                            </div>
                          : <div className={`p-2 rounded-full mr-3 mt-0.5 ${loan.status === 'approved' ? 'bg-brand-accent/10' : 'bg-red-100'}`}>
                              <AlertCircle className={`h-4 w-4 ${loan.status === 'approved' ? 'text-brand-accent' : 'text-red-500'}`} />
                            </div>}
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium text-gray-800 capitalize">{loan.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary/5" 
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
