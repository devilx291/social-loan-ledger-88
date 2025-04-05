
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your security settings and authentication preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Security settings will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};
