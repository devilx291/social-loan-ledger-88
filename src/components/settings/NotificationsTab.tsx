
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Notification settings will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};
