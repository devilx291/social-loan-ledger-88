
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PiggyBank, ShieldCheck, Users, ArrowRight, TrendingUp, Star, Check, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-2 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-800">TrustFund</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-gray-600">
              <a href="#features" className="font-medium hover:text-brand-primary transition-colors">Features</a>
              <a href="#how-it-works" className="font-medium hover:text-brand-primary transition-colors">How It Works</a>
              <a href="#impact" className="font-medium hover:text-brand-primary transition-colors">Impact</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login" className="font-medium text-gray-600 hover:text-brand-primary transition-colors">Login</Link>
              <Button asChild className="bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-accent text-transparent bg-clip-text">
                Community Trust, Financial Freedom
              </h1>
              <p className="text-xl mb-8 text-gray-600 max-w-lg">
                Access small emergency funds quickly through a trusted social network.
                No credit checks, just community trust and blockchain verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity shadow-lg text-lg px-8 py-6"
                >
                  <Link to="/register">Join Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 text-lg px-8 py-6"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-accent/10 rounded-full filter blur-3xl animate-pulse-gentle"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-primary/10 rounded-full filter blur-3xl animate-pulse-gentle"></div>
                <div className="relative bg-white rounded-2xl shadow-lg p-8 max-w-md z-10 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-3 rounded-xl">
                      <PiggyBank className="h-10 w-10 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-2xl text-gray-800">Trust-Based Lending</h3>
                      <p className="text-gray-600">No credit scores, just community trust</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-brand-success/10 p-2 rounded-full mr-3 mt-0.5">
                        <ShieldCheck className="h-5 w-5 text-brand-success" />
                      </div>
                      <p className="text-gray-700">Transparent blockchain-verified transactions</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-accent/10 p-2 rounded-full mr-3 mt-0.5">
                        <Users className="h-5 w-5 text-brand-accent" />
                      </div>
                      <p className="text-gray-700">Build trust through community participation</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-primary/10 p-2 rounded-full mr-3 mt-0.5">
                        <TrendingUp className="h-5 w-5 text-brand-primary" />
                      </div>
                      <p className="text-gray-700">Fast emergency funds when you need them most</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Score Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900">Your Financial Trust Score</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build your reputation in the community through responsible borrowing and lending
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="w-full h-full rounded-full border-8 border-gray-100 flex items-center justify-center">
                <div className="w-5/6 h-5/6 rounded-full border-8 border-brand-primary flex items-center justify-center">
                  <div className="text-5xl font-bold text-brand-primary">85</div>
                </div>
              </div>
              <div className="absolute top-0 -right-4 bg-brand-success text-white rounded-full p-3">
                <Star className="h-6 w-6" />
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2 text-gray-800">How Your Trust Score Works</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-brand-primary/10 p-1 rounded-full mr-3">
                      <Check className="h-4 w-4 text-brand-primary" />
                    </div>
                    <span className="text-gray-700">Repay loans on time to increase your score</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-brand-primary/10 p-1 rounded-full mr-3">
                      <Check className="h-4 w-4 text-brand-primary" />
                    </div>
                    <span className="text-gray-700">Higher scores unlock larger loan amounts</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-brand-primary/10 p-1 rounded-full mr-3">
                      <Check className="h-4 w-4 text-brand-primary" />
                    </div>
                    <span className="text-gray-700">Community-verified reputation through blockchain</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-brand-primary/10 p-1 rounded-full mr-3">
                      <Check className="h-4 w-4 text-brand-primary" />
                    </div>
                    <span className="text-gray-700">Helping others by lending improves your score</span>
                  </li>
                </ul>
              </div>
              
              <Button asChild className="bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity w-full">
                <Link to="/credit-assessment">Take Your Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to access community-supported emergency funds
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-gradient-to-br from-brand-primary to-brand-primary/70 text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">1. Join the Network</h3>
              <p className="text-gray-600">
                Sign up with your phone number and build your trust score through our comprehensive assessment system.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-gradient-to-br from-brand-accent to-brand-accent/70 text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <PiggyBank className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">2. Request or Provide</h3>
              <p className="text-gray-600">
                Request emergency funds or support others in your community by approving their loan requests.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-gradient-to-br from-brand-secondary to-brand-secondary/70 text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">3. Build Your Trust Score</h3>
              <p className="text-gray-600">
                Repay loans on time to increase your trust score and access larger loans in the future.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity shadow-lg">
              <Link to="/register">Get Started Today <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-900">Making A Global Impact</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Our platform creates a sustainable cycle of support within communities. 
                By relying on social trust rather than traditional credit scores, 
                we're making emergency funding accessible to everyone.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <div className="bg-brand-success/10 p-2 rounded-full mr-4 mt-0.5">
                    <Globe className="h-5 w-5 text-brand-success" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Financial Inclusion</h4>
                    <p className="text-gray-600">Serving underbanked communities with accessible financial solutions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-primary/10 p-2 rounded-full mr-4 mt-0.5">
                    <Users className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Community-Driven</h4>
                    <p className="text-gray-600">Zero interest, community-supported emergency funds</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-accent/10 p-2 rounded-full mr-4 mt-0.5">
                    <ShieldCheck className="h-5 w-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Transparent & Secure</h4>
                    <p className="text-gray-600">Blockchain-verified transparent lending history</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg max-w-md">
                <div className="text-center mb-6">
                  <div className="inline-block bg-white p-4 rounded-xl shadow-md mb-4">
                    <Globe className="h-10 w-10 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">Join Our Movement</h3>
                  <p className="text-gray-600 mb-6">
                    Become part of a growing community supporting each other through financial emergencies.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-brand-primary border border-brand-primary/20">
                      1,200+ Communities
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-brand-accent border border-brand-accent/20">
                      ₹5.2M+ Disbursed
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-brand-secondary border border-brand-secondary/20">
                      94% Repayment Rate
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity">
                    <Link to="/register">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from people who've experienced the power of community-based financial support
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-card p-8 relative">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-brand-primary to-brand-accent p-2 rounded-full">
                <div className="bg-white rounded-full p-1">
                  <Star className="h-5 w-5 text-brand-primary" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "When my mother needed emergency medical care, TrustFund helped me access funds within hours. The community support changed our lives."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-brand-primary">RP</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Rahul P.</h4>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-card p-8 relative">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-brand-secondary to-brand-accent p-2 rounded-full">
                <div className="bg-white rounded-full p-1">
                  <Star className="h-5 w-5 text-brand-secondary" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I love being able to help others in my community. Knowing my funds are going directly to verified emergency needs makes all the difference."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-brand-secondary">AK</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Ananya K.</h4>
                  <p className="text-sm text-gray-500">Bangalore</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-card p-8 relative">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-brand-accent to-brand-secondary p-2 rounded-full">
                <div className="bg-white rounded-full p-1">
                  <Star className="h-5 w-5 text-brand-accent" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As a small business owner, I needed quick capital for inventory. Traditional banks took too long, but TrustFund's community had my back."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-brand-accent">DS</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-800">Deepak S.</h4>
                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-primary to-brand-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Ready to Join the Community?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Access emergency funds, help others, and build your financial future based on trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-primary hover:bg-white/90 transition-colors text-lg px-8 py-6">
              <Link to="/register">Create Account <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 transition-colors text-lg px-8 py-6">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-2 rounded-lg">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">TrustFund</span>
              </div>
              <p className="text-gray-400 mb-6">
                A community-based platform providing access to emergency loans through social trust.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/request-loan" className="text-gray-400 hover:text-white transition-colors">Request Loan</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} TrustFund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
