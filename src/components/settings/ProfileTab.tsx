
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, CheckCircle, UserCheck } from "lucide-react";
import { useProfileManagement } from "@/hooks/useProfileManagement";

export const ProfileTab = () => {
  const { user } = useAuth();
  const { name, setName, phoneNumber, setPhoneNumber, isLoading, handleUpdateProfile } = useProfileManagement();
  const selfieImage = user?.selfieImage || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and how we can contact you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            {user?.isVerified ? (
              <div className="relative">
                <AvatarImage src={selfieImage || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <>
                <AvatarImage src={selfieImage || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.phoneNumber}</p>
            {user?.isVerified && (
              <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                <UserCheck className="h-3 w-3" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your full name" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input 
            id="phoneNumber" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Your phone number" 
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
