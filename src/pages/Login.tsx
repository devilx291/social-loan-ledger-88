
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, requestOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await requestOtp(phoneNumber);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp || otp.length < 6) {
      setError("Please enter a valid OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(phoneNumber, otp);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your OTP and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <PiggyBank className="h-8 w-8 text-brand-primary" />
            <span className="font-bold text-2xl">Social Loan Ledger</span>
          </div>
          <p className="text-gray-600">
            Login to access your account
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Enter your phone number to receive a one-time password" 
                : "Enter the OTP sent to your phone"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: +1XXXXXXXXXX (include country code)
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="text-sm">
                    <button 
                      type="button" 
                      className="text-brand-primary hover:underline"
                      onClick={() => setStep(1)}
                    >
                      Use a different phone number
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter>
            <p className="text-sm text-center w-full">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
