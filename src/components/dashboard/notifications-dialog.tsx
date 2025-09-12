"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Settings,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Clock
} from "lucide-react";

interface NotificationsDialogProps {
  children: React.ReactNode;
}

export function NotificationsDialog({ children }: NotificationsDialogProps) {
  const [open, setOpen] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    browser: true,
    sound: true,
    vibration: false,
  });

  const [notificationTypes, setNotificationTypes] = useState({
    dataProcessing: true,
    reportReady: true,
    errors: true,
    updates: false,
    security: true,
    maintenance: true,
  });

  const recentNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Data Processing Complete',
      message: 'Your water quality analysis has been completed successfully.',
      time: '2 minutes ago',
      read: false,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Risk Detected',
      message: 'Location "Site A" shows high heavy metal contamination.',
      time: '1 hour ago',
      read: false,
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
    },
    {
      id: 3,
      type: 'info',
      title: 'Report Generated',
      message: 'Your PDF report is ready for download.',
      time: '3 hours ago',
      read: true,
      icon: <Info className="h-4 w-4 text-blue-500" />
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'New features available in the latest update.',
      time: '1 day ago',
      read: true,
      icon: <Info className="h-4 w-4 text-blue-500" />
    }
  ];

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationType = (key: string, value: boolean) => {
    setNotificationTypes(prev => ({ ...prev, [key]: value }));
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would update the backend
    console.log('Marking all notifications as read');
  };

  const clearAll = () => {
    // In a real app, this would clear notifications from backend
    console.log('Clearing all notifications');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
          <DialogDescription>
            Manage your notification preferences and view recent alerts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Notifications</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    </div>
                    <Switch
                      id="browser-notifications"
                      checked={notifications.browser}
                      onCheckedChange={(checked) => updateNotificationSetting('browser', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm">Sound & Alert Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {notifications.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <Label htmlFor="sound-notifications">Sound Alerts</Label>
                    </div>
                    <Switch
                      id="sound-notifications"
                      checked={notifications.sound}
                      onCheckedChange={(checked) => updateNotificationSetting('sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="vibration-notifications">Vibration</Label>
                    </div>
                    <Switch
                      id="vibration-notifications"
                      checked={notifications.vibration}
                      onCheckedChange={(checked) => updateNotificationSetting('vibration', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-processing">Data Processing Updates</Label>
                    <Switch
                      id="data-processing"
                      checked={notificationTypes.dataProcessing}
                      onCheckedChange={(checked) => updateNotificationType('dataProcessing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="report-ready">Report Ready Alerts</Label>
                    <Switch
                      id="report-ready"
                      checked={notificationTypes.reportReady}
                      onCheckedChange={(checked) => updateNotificationType('reportReady', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="error-alerts">Error Alerts</Label>
                    <Switch
                      id="error-alerts"
                      checked={notificationTypes.errors}
                      onCheckedChange={(checked) => updateNotificationType('errors', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="update-notifications">System Updates</Label>
                    <Switch
                      id="update-notifications"
                      checked={notificationTypes.updates}
                      onCheckedChange={(checked) => updateNotificationType('updates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <Switch
                      id="security-alerts"
                      checked={notificationTypes.security}
                      onCheckedChange={(checked) => updateNotificationType('security', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-alerts">Maintenance Notices</Label>
                    <Switch
                      id="maintenance-alerts"
                      checked={notificationTypes.maintenance}
                      onCheckedChange={(checked) => updateNotificationType('maintenance', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notification Schedule
              </CardTitle>
              <CardDescription>
                Set when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>• Email notifications: 24/7</p>
                <p>• Push notifications: 9 AM - 6 PM (your timezone)</p>
                <p>• Browser notifications: 9 AM - 6 PM (your timezone)</p>
                <p>• Emergency alerts: Always on</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
