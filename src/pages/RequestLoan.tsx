
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { requestLoan } from "@/services/mockData";

const RequestLoan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState(100);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate max allowed amount based on trust score
  const maxAmount = user ? Math.min(500 + (user.trustScore * 5), 1000) : 500;
  
  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purpose.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide the purpose of your loan",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (user) {
        await requestLoan(user.id, amount, purpose);
        
        toast({
          title: "Loan request submitted",
          description: "Your loan request has been successfully submitted and is pending approval.",
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to submit loan request", error);
      toast({
        title: "Request failed",
        description: "There was an error submitting your loan request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Request a Loan</h1>
          <p className="text-muted-foreground">
            Fill out the form below to request emergency funds
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Loan Request Form</CardTitle>
              <CardDescription>
                Your loan application will be reviewed by community lenders
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Trust Score Display */}
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">Your Trust Score</p>
                        <p className="text-sm text-muted-foreground">
                          Based on your repayment history and community standing
                        </p>
                      </div>
                      <TrustScoreBadge score={user?.trustScore || 0} />
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm mb-1">
                        Maximum loan amount: <strong>${maxAmount}</strong>
                      </p>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary rounded-full" 
                          style={{ width: `${(user?.trustScore || 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan Amount Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="amount">Loan Amount</Label>
                      <span className="font-semibold">${amount}</span>
                    </div>
                    <Slider
                      id="amount"
                      defaultValue={[100]}
                      max={maxAmount}
                      min={50}
                      step={10}
                      onValueChange={handleAmountChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$50</span>
                      <span>${maxAmount}</span>
                    </div>
                  </div>
                  
                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Loan Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Briefly describe why you need this loan"
                      rows={4}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about your need for emergency funds. This helps lenders understand your situation.
                    </p>
                  </div>
                  
                  {/* Terms */}
                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <h3 className="font-medium">Loan Terms</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Loan term: 30 days</li>
                      <li>• No interest charged (community support)</li>
                      <li>• Late repayment will affect your trust score</li>
                      <li>• You can repay early with no penalty</li>
                    </ul>
                  </div>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !purpose.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit Loan Request"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestLoan;
