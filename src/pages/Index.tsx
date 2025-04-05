
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PiggyBank, Shield, Users, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-brand-primary" />
            <span className="font-bold text-lg">Social Loan Ledger</span>
          </div>
          
          <div className="space-x-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-accent text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community-Powered Emergency Loans
            </h1>
            <p className="text-lg mb-6">
              Access small, emergency loans based on social trust rather than credit scores. 
              Our platform connects those in need with community lenders through a transparent, 
              blockchain-secured system.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
                className="bg-white text-brand-primary hover:bg-gray-100"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center text-center">
                  <Shield className="h-10 w-10 mb-2" />
                  <h3 className="font-semibold text-lg">Trust-Based</h3>
                  <p className="text-sm">Social reputation replaces traditional credit checks</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center text-center">
                  <Users className="h-10 w-10 mb-2" />
                  <h3 className="font-semibold text-lg">Community-Driven</h3>
                  <p className="text-sm">Local communities supporting each other</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center text-center">
                  <TrendingUp className="h-10 w-10 mb-2" />
                  <h3 className="font-semibold text-lg">Build Credit</h3>
                  <p className="text-sm">Improve your trust score with each repayment</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center text-center">
                  <PiggyBank className="h-10 w-10 mb-2" />
                  <h3 className="font-semibold text-lg">Quick Access</h3>
                  <p className="text-sm">Get funds quickly for urgent needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Request a Loan</h3>
              <p className="text-gray-600">
                Create an account, specify your loan amount and purpose. 
                Your social trust score determines your borrowing capacity.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Funded</h3>
              <p className="text-gray-600">
                Community lenders review and fund loan requests. 
                All transactions are recorded on our ledger for transparency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Repay & Build Trust</h3>
              <p className="text-gray-600">
                Repay your loan on time to build your trust score, 
                increasing your future borrowing capacity and terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5" />
                <span className="font-bold">Social Loan Ledger</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Empowering communities through trust-based lending
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-brand-primary">About</a>
              <a href="#" className="hover:text-brand-primary">FAQ</a>
              <a href="#" className="hover:text-brand-primary">Privacy</a>
              <a href="#" className="hover:text-brand-primary">Terms</a>
              <a href="#" className="hover:text-brand-primary">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Social Loan Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
