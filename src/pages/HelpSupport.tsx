
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Define the data structure for chat messages
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Define predefined responses for common finance questions
const predefinedResponses: Record<string, string> = {
  "loan": "Our platform offers peer-to-peer loans with competitive interest rates. You can request a loan by navigating to the 'Request Loan' page and filling out the necessary information.",
  "interest": "Interest rates on our platform range from 3% to 15% depending on your trust score and loan amount. The higher your trust score, the lower your interest rate will be.",
  "repayment": "Loan repayments can be made through our platform. You'll receive notifications when payments are due. We offer flexible repayment options including monthly, bi-weekly, or weekly schedules.",
  "trust score": "Your trust score is calculated based on your repayment history, verification status, and community participation. You can improve your score by verifying your identity, repaying loans on time, and referring friends to the platform.",
  "verification": "We use KYC (Know Your Customer) verification to ensure the security of our community. You can complete verification in your account settings under the 'KYC Verification' tab.",
  "blockchain": "Our platform uses blockchain technology to securely record all loan transactions. This ensures transparency and immutability of all lending activities.",
  "referral": "You can refer friends using the referral link in your Settings page under the 'Referral System' tab. Both you and your referred friends will receive trust score boosts when they sign up.",
  "documents": "You can upload and verify your identity documents like Aadhaar Card and Income Tax Return in the Document Verification section. Verified documents will increase your trust score.",
  "default": "I'm your TrustFund financial assistant. I can help with questions about loans, interest rates, repayments, trust scores, and more. How can I help you today?"
};

const HelpSupport = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your TrustFund financial assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to find the most relevant predefined response
  const findResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowercaseMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Default response if no keywords match
    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot thinking with a small delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: findResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Get assistance with your financial questions and platform usage
          </p>
        </header>

        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="chatbot" className="flex-1">Financial Assistant</TabsTrigger>
            <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>
            <TabsTrigger value="contact" className="flex-1">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot">
            <Card className="border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle>Financial Assistant</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-primary/10">Online</Badge>
                </div>
                <CardDescription>
                  Ask any questions about loans, interest rates, trust scores, or platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {msg.sender === "bot" ? (
                                <Bot className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                              <span className="text-xs font-medium">
                                {msg.sender === "bot" ? "TrustFund Assistant" : "You"}
                              </span>
                            </div>
                            <p>{msg.content}</p>
                            <div className="text-xs opacity-70 mt-1 text-right">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your question here..."
                        className="flex-1"
                        autoFocus
                      />
                      <Button onClick={handleSendMessage} type="submit">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about our platform and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">How are interest rates calculated?</h3>
                  <p className="text-muted-foreground">
                    Interest rates on our platform range from 3% to 15% based on your trust score, 
                    loan amount, and duration. Higher trust scores qualify you for lower rates.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">What is a trust score?</h3>
                  <p className="text-muted-foreground">
                    Your trust score is a numerical representation of your creditworthiness on our platform.
                    It's calculated based on your repayment history, verification status, and community participation.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">How do I improve my trust score?</h3>
                  <p className="text-muted-foreground">
                    You can improve your trust score by verifying your identity (KYC), 
                    repaying loans on time, referring friends to the platform, and maintaining
                    active participation in the community.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">How is the blockchain used?</h3>
                  <p className="text-muted-foreground">
                    We use blockchain technology to create an immutable record of all loan transactions.
                    This ensures transparency and security, allowing all participants to verify the 
                    integrity of the lending system.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">What happens if I can't repay my loan?</h3>
                  <p className="text-muted-foreground">
                    If you're having trouble with repayments, contact support immediately. We offer 
                    restructuring options for hardship cases. Late or missed payments will affect your 
                    trust score and may limit future borrowing capacity.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">What documents do I need to verify my identity?</h3>
                  <p className="text-muted-foreground">
                    We require your Aadhaar Card and Income Tax Return for identity verification. You can upload these
                    documents in the Document Verification section. Our system will check for authenticity,
                    and verified documents will increase your trust score.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">What happens if my document verification fails?</h3>
                  <p className="text-muted-foreground">
                    If our system detects potential forgery in your documents, your trust score will be reset to 0.
                    You can contact support to understand the issue and submit authentic documents for reverification.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get in touch with our support team for personalized assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Email Support</h3>
                      <p className="text-sm mb-4">Send us an email and we'll respond within 24 hours</p>
                      <p className="font-medium">support@trustfund.example</p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Phone Support</h3>
                      <p className="text-sm mb-4">Available Monday to Friday, 9 AM - 5 PM</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Community Forum</h3>
                    <p className="text-sm mb-4">
                      Join our community forum to connect with other users and get help from the community
                    </p>
                    <Button variant="outline">Visit Forum</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpSupport;
