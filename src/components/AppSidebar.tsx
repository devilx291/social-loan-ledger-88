
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
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <PiggyBank className="h-6 w-6 text-brand-primary" />
          <span className="font-bold text-lg">Social Loan Ledger</span>
        </div>
        <SidebarTrigger>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent>
        {user && (
          <div className="px-3 py-4">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.phoneNumber}</div>
            <div className="mt-2">
              <TrustScoreBadge score={user.trustScore} />
            </div>
          </div>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/dashboard")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/request-loan")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <PiggyBank className="h-5 w-5" />
                    <span>Request Loan</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/approve-loans")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <UserCheck className="h-5 w-5" />
                    <span>Approve Loans</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/loan-history")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <History className="h-5 w-5" />
                    <span>Loan History</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/ledger")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <FileText className="h-5 w-5" />
                    <span>Blockchain Ledger</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/credit-assessment")}>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <TrendingUp className="h-5 w-5" />
                    <span>Credit Assessment</span>
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
          className="w-full flex items-center justify-center space-x-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
