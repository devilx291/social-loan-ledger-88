
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionHistory, verifyBlockchain } from "@/services/transactionService";
import { format } from "date-fns";
import { ShieldCheck, AlertTriangle, Search, ArrowRight, FileCheck, CheckCircle, AlertCircle, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Ledger = () => {
  const [searchHash, setSearchHash] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactionHistory,
  });
  
  const { data: verificationResult, isLoading: isVerifying } = useQuery({
    queryKey: ['verifyBlockchain'],
    queryFn: verifyBlockchain,
  });
  
  const handleSearch = () => {
    if (!searchHash.trim() || !transactions) {
      setFilteredTransactions([]);
      setHasSearched(true);
      return;
    }
    
    const results = transactions.filter(tx => 
      tx.currHash.includes(searchHash) || 
      (tx.prevHash && tx.prevHash.includes(searchHash))
    );
    
    setFilteredTransactions(results);
    setHasSearched(true);
  };
  
  const handleClearSearch = () => {
    setSearchHash("");
    setFilteredTransactions([]);
    setHasSearched(false);
  };
  
  const displayedTransactions = hasSearched ? filteredTransactions : transactions;
  const isLoading = isLoadingTransactions || isVerifying;
  
  // Helper function to get icon for transaction type
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <CircleDollarSign className="h-4 w-4" />;
      case 'approve':
        return <CheckCircle className="h-4 w-4" />;
      case 'reject':
        return <AlertCircle className="h-4 w-4" />;
      case 'repay':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <CircleDollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Blockchain Ledger</h1>
          <p className="text-muted-foreground">
            View and verify all transactions on the transparent blockchain ledger
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Blockchain Verification Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-brand-primary" />
                Blockchain Verification
              </CardTitle>
              <CardDescription>
                Verify the integrity of the blockchain ledger
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isVerifying ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
                  <p>Verifying blockchain integrity...</p>
                </div>
              ) : verificationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    {verificationResult.valid ? (
                      <>
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <ShieldCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Blockchain Verified</p>
                          <p className="text-sm text-muted-foreground">
                            All transactions are valid and the chain is secure
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Verification Failed</p>
                          <p className="text-sm text-muted-foreground">
                            {verificationResult.invalidBlocks.length} invalid blocks detected
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {!verificationResult.valid && (
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Invalid Blocks:</h4>
                      <ul className="text-sm space-y-1">
                        {verificationResult.invalidBlocks.map((blockId) => (
                          <li key={blockId} className="font-mono text-xs">
                            {blockId}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">What This Means:</h4>
                    <p className="text-sm text-muted-foreground">
                      Every transaction on our platform is recorded as a block in our blockchain-like ledger. 
                      Each block contains a hash that is created using the previous block's hash and the 
                      current transaction's details, forming an unbreakable chain. This verification process 
                      ensures that transaction records cannot be tampered with.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Verification failed to complete</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Transactions
              </CardTitle>
              <CardDescription>
                Find transactions by hash
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter full or partial hash"
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch}>
                    Search
                  </Button>
                </div>
                
                {hasSearched && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {filteredTransactions.length} results found
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                      Clear
                    </Button>
                  </div>
                )}
                
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Search Tips:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Enter a partial or complete transaction hash</li>
                    <li>• Searches both current and previous hash fields</li>
                    <li>• Case sensitive (use exact capitalization)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2" />
              Transaction Ledger
            </CardTitle>
            <CardDescription>
              Complete blockchain-verified transaction history
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : displayedTransactions && displayedTransactions.length > 0 ? (
              <div className="space-y-6">
                {displayedTransactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          tx.transactionType === 'request' ? 'bg-blue-100 text-blue-600' :
                          tx.transactionType === 'approve' ? 'bg-green-100 text-green-600' :
                          tx.transactionType === 'repay' ? 'bg-purple-100 text-purple-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {getTransactionTypeIcon(tx.transactionType)}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium capitalize">
                              {tx.transactionType === 'request' ? 'Loan Requested' :
                               tx.transactionType === 'approve' ? 'Loan Approved' :
                               tx.transactionType === 'repay' ? 'Loan Repaid' :
                               'Loan Rejected'}
                            </h3>
                            <Badge variant="outline" className="ml-2 capitalize text-xs">
                              {tx.transactionType}
                            </Badge>
                          </div>
                          <div className="flex text-sm text-muted-foreground">
                            <span>₹{tx.amount}</span>
                            <span className="mx-2">•</span>
                            <span>{tx.userName || 'Anonymous'}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/loans/${tx.loanId}`} className="flex items-center text-xs">
                          View Loan <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="hash">
                        <AccordionTrigger className="text-xs py-1">
                          View Blockchain Details
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-xs font-mono">
                            <div>
                              <p className="text-muted-foreground">Transaction Hash:</p>
                              <p className="break-all bg-muted p-2 rounded-md">{tx.currHash}</p>
                            </div>
                            
                            {tx.prevHash && (
                              <div>
                                <p className="text-muted-foreground">Previous Hash:</p>
                                <p className="break-all bg-muted p-2 rounded-md">{tx.prevHash}</p>
                              </div>
                            )}
                            
                            <div>
                              <p className="text-muted-foreground">Block Details:</p>
                              <div className="grid grid-cols-2 gap-2 bg-muted p-2 rounded-md">
                                <div>
                                  <span className="text-muted-foreground">Transaction ID:</span>
                                  <p>{tx.id.slice(0, 8)}...</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Loan ID:</span>
                                  <p>{tx.loanId ? tx.loanId.slice(0, 8) + '...' : 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">User ID:</span>
                                  <p>{tx.userId.slice(0, 8)}...</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Timestamp:</span>
                                  <p>{new Date(tx.createdAt).toISOString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {hasSearched ? "No transactions match your search criteria" : "No transactions found"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ledger;
