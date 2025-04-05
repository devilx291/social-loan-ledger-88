
import { Home, PiggyBank, History, LogOut, UserCheck, Menu, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { TrustScoreBadge } from "./TrustScoreBadge";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-r-gray-100 shadow-sm">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-2 rounded-lg">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-gray-800">TrustFund</span>
        </div>
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-brand-primary">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent>
        {user && (
          <div className="px-4 py-4 mb-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg mx-3">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-muted-foreground mb-2">{user.phoneNumber}</div>
            <TrustScoreBadge score={user.trustScore} />
          </div>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/dashboard")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/request-loan")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <PiggyBank className="h-5 w-5" />
                    <span className="font-medium">Request Loan</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/approve-loans")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <UserCheck className="h-5 w-5" />
                    <span className="font-medium">Approve Loans</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/loan-history")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <History className="h-5 w-5" />
                    <span className="font-medium">Loan History</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/ledger")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Blockchain Ledger</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/credit-assessment")}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:text-brand-primary transition-colors p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Credit Assessment</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center space-x-2 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
