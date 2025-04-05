
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PiggyBank, ShieldCheck, Users, ArrowRight, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Community-Based Emergency Loans
              </h1>
              <p className="text-xl mb-8">
                Access small emergency funds quickly through a trusted social network.
                No credit checks, just community trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-brand-primary hover:bg-gray-100"
                >
                  <Link to="/register">Join Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 max-w-md">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <PiggyBank className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Trust-Based Lending</h3>
                    <p className="text-white/80">No credit scores, just community trust</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-white/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p>Transparent blockchain-verified transactions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Users className="h-4 w-4" />
                    </div>
                    <p>Build trust through community participation</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p>Fast emergency funds when you need them most</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Join the Network</h3>
              <p className="text-gray-600">
                Sign up with your phone number and build your trust score through community participation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <PiggyBank className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Request or Provide Loans</h3>
              <p className="text-gray-600">
                Request emergency funds or support others in your community by funding their requests.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Build Your Trust Score</h3>
              <p className="text-gray-600">
                Repay loans on time to increase your trust score and access larger loans in the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform creates a sustainable cycle of support within communities. 
                By relying on social trust rather than traditional credit scores, 
                we're making emergency funding accessible to everyone.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-full mr-3 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-gray-600">Inclusive financial access for underserved communities</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-full mr-3 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-gray-600">Zero interest, community-supported emergency funds</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-full mr-3 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-gray-600">Blockchain-verified transparent lending history</p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gray-100 p-8 rounded-lg w-full max-w-md">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">Join Today</h3>
                  <p className="text-gray-600 mb-6">
                    Become part of a growing community supporting each other through financial emergencies.
                  </p>
                  <Button size="lg" asChild>
                    <Link to="/register">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <PiggyBank className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">Social Loan Ledger</span>
              </div>
              <p className="text-gray-400 max-w-md">
                A community-based platform providing access to emergency loans through social trust.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
                  <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Social Loan Ledger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
