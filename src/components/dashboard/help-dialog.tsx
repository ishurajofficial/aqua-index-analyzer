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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  Play,
  FileText,
  Video,
  Download,
  Github,
  Mail as MailIcon,
  Phone,
  MapPin
} from "lucide-react";

interface HelpDialogProps {
  children: React.ReactNode;
}

export function HelpDialog({ children }: HelpDialogProps) {
  const [open, setOpen] = useState(false);

  const quickStartSteps = [
    {
      step: 1,
      title: "Upload Your Data",
      description: "Upload a CSV file with water quality data containing heavy metal concentrations.",
      icon: <FileText className="h-4 w-4" />
    },
    {
      step: 2,
      title: "Select Analysis Standard",
      description: "Choose between WHO or BIS standards for pollution assessment.",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      step: 3,
      title: "Process Data",
      description: "Click 'Process Data' to calculate HPI, HEI, CF, and PLI indices.",
      icon: <Play className="h-4 w-4" />
    },
    {
      step: 4,
      title: "View Results",
      description: "Analyze charts, tables, and risk assessments in the dashboard.",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      step: 5,
      title: "Export Report",
      description: "Generate and download comprehensive reports in multiple formats.",
      icon: <Download className="h-4 w-4" />
    }
  ];

  const faqItems = [
    {
      question: "What file formats are supported?",
      answer: "Currently, we support CSV files. The file should contain columns for location, heavy metal concentrations (As, Cd, Cr, Pb, Zn), and coordinates."
    },
    {
      question: "What are HPI, HEI, CF, and PLI indices?",
      answer: "These are standardized indices for assessing heavy metal pollution: HPI (Heavy Metal Pollution Index), HEI (Heavy Metal Evaluation Index), CF (Contamination Factor), and PLI (Pollution Load Index)."
    },
    {
      question: "How accurate are the calculations?",
      answer: "Our calculations follow internationally recognized methodologies and use standard reference limits from WHO and BIS guidelines."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export your analysis results in multiple formats including Markdown, CSV, JSON, and PDF."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use Firebase for secure data storage and all data is encrypted. We don't share your data with third parties."
    },
    {
      question: "What if I encounter an error?",
      answer: "Check the browser console for detailed error messages. If the issue persists, contact our support team."
    }
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: <MailIcon className="h-5 w-5" />,
      contact: "support@aquaindex.com",
      action: "Send Email"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API docs",
      icon: <BookOpen className="h-5 w-5" />,
      contact: "docs.aquaindex.com",
      action: "View Docs"
    },
    {
      title: "GitHub Issues",
      description: "Report bugs and request features",
      icon: <Github className="h-5 w-5" />,
      contact: "github.com/aquaindex",
      action: "Open Issue"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <Video className="h-5 w-5" />,
      contact: "youtube.com/aquaindex",
      action: "Watch Videos"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Get help with using Aqua Index Analyzer
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Follow these steps to start analyzing your water quality data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        {step.icon}
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions and answers about Aqua Index Analyzer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {method.icon}
                      {method.title}
                    </CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-2">{method.contact}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {method.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
                <CardDescription>
                  For urgent issues or critical data processing problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Mon-Fri, 9AM-6PM EST</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Comprehensive guides and references</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    User Manual
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Sample Data Files
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>Step-by-step video guides</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Getting Started
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Advanced Features
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Troubleshooting
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                  <CardDescription>Connect with other users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Discussion Forum
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Community
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Updates</CardTitle>
                  <CardDescription>Stay informed about new features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Newsletter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Release Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
