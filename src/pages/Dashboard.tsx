
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { PiggyBank, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { getMockUserLoans, type Loan } from "@/services/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (user) {
        try {
          const data = await getMockUserLoans(user.id);
          setLoans(data);
        } catch (error) {
          console.error("Failed to fetch loans", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLoans();
  }, [user]);

  // Calculate loan stats
  const stats = {
    pendingRequests: loans.filter(loan => loan.status === "pending" && loan.borrowerId === user?.id).length,
    activeLoans: loans.filter(loan => loan.status === "approved").length,
    repaidLoans: loans.filter(loan => loan.status === "repaid").length,
    totalBorrowed: loans
      .filter(loan => loan.borrowerId === user?.id && (loan.status === "approved" || loan.status === "repaid" || loan.status === "overdue"))
      .reduce((sum, loan) => sum + loan.amount, 0),
    totalLent: loans
      .filter(loan => loan.lenderId === user?.id && (loan.status === "approved" || loan.status === "repaid" || loan.status === "overdue"))
      .reduce((sum, loan) => sum + loan.amount, 0)
  };

  // Get recent loans
  const recentLoans = [...loans].sort((a, b) => 
    new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()
  ).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </header>

        {/* Trust Score Card */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Your Trust Score</h2>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <TrustScoreBadge score={user?.trustScore || 0} />
                    </div>
                    <p className="text-muted-foreground">
                      Based on your loan history and referrals
                    </p>
                  </div>
                </div>
                <Button onClick={() => navigate("/request-loan")}>Request a Loan</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Borrowed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PiggyBank className="h-5 w-5 text-brand-primary mr-2" />
                <div className="text-2xl font-bold">${stats.totalBorrowed}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Lent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-brand-secondary mr-2" />
                <div className="text-2xl font-bold">${stats.totalLent}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                <div className="text-2xl font-bold">{stats.activeLoans}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Repaid Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-trust-high mr-2" />
                <div className="text-2xl font-bold">{stats.repaidLoans}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Loans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Loans</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/loan-history")}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recentLoans.map(loan => (
                <Card key={loan.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {loan.status === "pending" && <Clock className="h-5 w-5 text-amber-500 mr-2" />}
                        {loan.status === "approved" && <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />}
                        {loan.status === "repaid" && <CheckCircle className="h-5 w-5 text-trust-high mr-2" />}
                        {loan.status === "overdue" && <AlertTriangle className="h-5 w-5 text-trust-low mr-2" />}
                        
                        <div>
                          <p className="font-medium">
                            {loan.borrowerId === user?.id 
                              ? `Borrowed $${loan.amount}`
                              : `Lent $${loan.amount} to ${loan.borrowerName}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(loan.requestedDate).toLocaleDateString()} - {loan.purpose}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No loan history yet</p>
                <Button className="mt-4" onClick={() => navigate("/request-loan")}>
                  Request Your First Loan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Requests Alert */}
        {stats.pendingRequests > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                <p>
                  You have <strong>{stats.pendingRequests}</strong> pending loan {stats.pendingRequests === 1 ? 'request' : 'requests'}
                </p>
                <Button variant="link" onClick={() => navigate("/loan-history")} className="ml-auto">
                  View Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
