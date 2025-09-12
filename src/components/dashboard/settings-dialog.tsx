"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Palette, 
  Bell, 
  Download, 
  Eye, 
  BarChart3,
  Database,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SettingsDialogProps {
  children: React.ReactNode;
}

  const { user, role } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  // Settings state (except theme)
  const [settings, setSettings] = useState({
    chartType: 'bar' as 'bar' | 'line' | 'radar',
    showGridLines: true,
    showDataLabels: true,
    animationSpeed: 0.5,
    emailNotifications: true,
    pushNotifications: false,
    reportReadyAlerts: true,
    dataProcessingAlerts: true,
    defaultFormat: 'markdown' as 'markdown' | 'csv' | 'json' | 'pdf',
    autoDownload: false,
    includeMetadata: true,
    compressionLevel: 5,
    autoSave: true,
    dataRetention: 30, // days
    maxFileSize: 10, // MB
    batchSize: 100,
    sessionTimeout: 60, // minutes
    requireAuth: true,
    dataEncryption: true,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setTheme('system');
    setSettings({
      chartType: 'bar',
      showGridLines: true,
      showDataLabels: true,
      animationSpeed: 0.5,
      emailNotifications: true,
      pushNotifications: false,
      reportReadyAlerts: true,
      dataProcessingAlerts: true,
      defaultFormat: 'markdown',
      autoDownload: false,
      includeMetadata: true,
      compressionLevel: 5,
      autoSave: true,
      dataRetention: 30,
      maxFileSize: 10,
      batchSize: 100,
      sessionTimeout: 60,
      requireAuth: true,
      dataEncryption: true,
    });
  };

  const saveSettings = () => {
    // Save to localStorage or backend
    localStorage.setItem('aqua-index-settings', JSON.stringify(settings));
    localStorage.setItem('aqua-index-theme', theme);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your Aqua Index Analyzer experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Theme & Appearance
              </CardTitle>
              <CardDescription>Customize the visual appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chart Type</Label>
                <Select value={settings.chartType} onValueChange={(value) => updateSetting('chartType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Grid Lines</Label>
                <Switch
                  checked={settings.showGridLines}
                  onCheckedChange={(checked) => updateSetting('showGridLines', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Data Labels</Label>
                <Switch
                  checked={settings.showDataLabels}
                  onCheckedChange={(checked) => updateSetting('showDataLabels', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Animation Speed: {Math.round(settings.animationSpeed * 100)}%</Label>
                <Slider
                  value={[settings.animationSpeed]}
                  onValueChange={([value]) => updateSetting('animationSpeed', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Report Ready Alerts</Label>
                <Switch
                  checked={settings.reportReadyAlerts}
                  onCheckedChange={(checked) => updateSetting('reportReadyAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Data Processing Alerts</Label>
                <Switch
                  checked={settings.dataProcessingAlerts}
                  onCheckedChange={(checked) => updateSetting('dataProcessingAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="h-4 w-4" />
                Export Settings
              </CardTitle>
              <CardDescription>Configure default export options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Format</Label>
                <Select value={settings.defaultFormat} onValueChange={(value) => updateSetting('defaultFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Download</Label>
                <Switch
                  checked={settings.autoDownload}
                  onCheckedChange={(checked) => updateSetting('autoDownload', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Include Metadata</Label>
                <Switch
                  checked={settings.includeMetadata}
                  onCheckedChange={(checked) => updateSetting('includeMetadata', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Compression Level: {settings.compressionLevel}</Label>
                <Slider
                  value={[settings.compressionLevel]}
                  onValueChange={([value]) => updateSetting('compressionLevel', value)}
                  max={9}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data handling and storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auto Save</Label>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Retention: {settings.dataRetention} days</Label>
                <Slider
                  value={[settings.dataRetention]}
                  onValueChange={([value]) => updateSetting('dataRetention', value)}
                  max={365}
                  min={7}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Max File Size: {settings.maxFileSize} MB</Label>
                <Slider
                  value={[settings.maxFileSize]}
                  onValueChange={([value]) => updateSetting('maxFileSize', value)}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Batch Size: {settings.batchSize}</Label>
                <Slider
                  value={[settings.batchSize]}
                  onValueChange={([value]) => updateSetting('batchSize', value)}
                  max={1000}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          {role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Security Settings
                </CardTitle>
                <CardDescription>Advanced security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout: {settings.sessionTimeout} minutes</Label>
                  <Slider
                    value={[settings.sessionTimeout]}
                    onValueChange={([value]) => updateSetting('sessionTimeout', value)}
                    max={480}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Authentication</Label>
                  <Switch
                    checked={settings.requireAuth}
                    onCheckedChange={(checked) => updateSetting('requireAuth', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Data Encryption</Label>
                  <Switch
                    checked={settings.dataEncryption}
                    onCheckedChange={(checked) => updateSetting('dataEncryption', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User Role</Label>
                <Badge variant={role === 'admin' ? 'default' : role === 'researcher' ? 'secondary' : 'outline'}>
                  {role?.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not signed in'}</p>
              </div>

              <div className="space-y-2">
                <Label>Display Name</Label>
                <p className="text-sm text-muted-foreground">{user?.displayName || 'Guest User'}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Account Actions</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Privacy Policy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Terms of Service
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
