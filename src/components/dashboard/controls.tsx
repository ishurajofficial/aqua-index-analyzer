"use client";

import * as React from "react";
import Papa from "papaparse";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileUp, Loader, Settings, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { RawPollutionData } from "@/lib/data";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChatbotAssistant } from "./chatbot-assistant";

interface DashboardControlsProps {
    selectedStandard: string;
    onStandardChange: (value: string) => void;
    onFileUpload: (data: RawPollutionData[]) => void;
    onExport: (options: any) => void;
    isExporting: boolean;
}

export function DashboardControls({
  selectedStandard,
  onStandardChange,
  onFileUpload,
  onExport,
  isExporting,
}: DashboardControlsProps) {
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const downloadSampleDataset = (filename: string) => {
        const link = document.createElement('a');
        link.href = `/sample-water-quality-data.csv`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "Sample Dataset Downloaded",
            description: `${filename} has been downloaded to your device.`,
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: async (results) => {
                        try {
                            // Validate required columns
                            const requiredMetals = ["As", "Cd", "Cr", "Pb", "Zn"];
                            const missingColumns = requiredMetals.filter(
                                (col) => !results.meta.fields?.includes(col)
                            );
                            if (missingColumns.length > 0) {
                                toast({
                                    title: "Missing Columns",
                                    description: `The following required columns are missing in your CSV: ${missingColumns.join(", ")}`,
                                    variant: "destructive",
                                });
                                return;
                            }

                            const parsedData = results.data.map((row: any, index: number) => {
                                // Check for missing or invalid values
                                const errors: string[] = [];
                                const entry: any = {
                                    id: row.id ? Number(row.id) : index + 1,
                                    location: row.location || `Location ${index + 1}`,
                                    lat: Number(row.lat) || 0,
                                    lon: Number(row.lon) || 0,
                                };
                                requiredMetals.forEach((metal) => {
                                    const value = Number(row[metal]);
                                    if (isNaN(value)) {
                                        errors.push(`${metal} is missing or not a number at row ${index + 1}`);
                                        entry[metal] = 0;
                                    } else {
                                        entry[metal] = value;
                                    }
                                });
                                if (errors.length > 0) {
                                    entry.__errors = errors;
                                }
                                return entry;
                            });

                            // Check for any row errors
                            const errorRows = parsedData.filter((row: any) => row.__errors);
                            if (errorRows.length > 0) {
                                toast({
                                    title: "Invalid Data",
                                    description: errorRows.map((row: any) => row.__errors.join(", ")).join("; "),
                                    variant: "destructive",
                                });
                                return;
                            }

                            onFileUpload(parsedData as RawPollutionData[]);
                            // Save dataset metadata (non-blocking for UI); omit raw file to avoid Storage billing
                            try {
                                await addDoc(collection(db(), "datasets"), {
                                    name: file.name,
                                    rows: parsedData.length,
                                    // Optionally store sample preview only to stay under 1MB limits
                                    preview: parsedData.slice(0, 20),
                                    createdAt: serverTimestamp(),
                                });
                            } catch {}

                            toast({
                                title: "File Uploaded",
                                description: `${file.name} has been processed successfully.`,
                            });
                        } catch (error) {
                            toast({
                                title: "Error Parsing File",
                                description: error instanceof Error ? error.message : String(error),
                                variant: "destructive",
                            });
                            console.error("Error parsing CSV data:", error);
                        }
                    },
                    error: (error: any) => {
                        toast({
                            title: "Error Uploading File",
                            description: error.message,
                            variant: "destructive",
                        });
                    },
                });
            } catch (e: any) {
                toast({
                    title: "Upload failed",
                    description: e?.message ?? "Could not upload file",
                    variant: "destructive",
                });
            }
        }
    };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-semibold font-headline tracking-tight">
            Aqua Index Analyzer
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 flex flex-col h-full min-h-screen">
        <div className="flex-1 overflow-y-auto">
          <Card className="shadow-none border-dashed">
              <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center gap-2">
                      <FileUp className="w-5 h-5" />
                      Upload Dataset
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">Upload CSV files with water quality data.</p>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".csv"
                  />
                  <Button className="w-full" onClick={handleFileButtonClick}>
                      Upload File
                  </Button>
              </CardContent>
          </Card>
          <Separator className="my-4" />
          <div className="px-2">
          <Label className="font-semibold text-base">Standards</Label>
          <p className="text-sm text-muted-foreground mt-1 mb-3">Select the permissible limits standard to apply.</p>
          <RadioGroup value={selectedStandard} onValueChange={onStandardChange} className="gap-3">
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="who" id="who"/>
                  <Label htmlFor="who" className="font-normal text-sm">WHO (World Health Org.)</Label>
              </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bis" id="bis" />
                  <Label htmlFor="bis" className="font-normal text-sm">BIS (Bureau of Indian Stds.)</Label>
              </div>
          </RadioGroup>
          </div>
          
          {/* Sample Datasets Section */}
          <Card className="shadow-none border-dashed">
              <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Sample Datasets
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">Download sample CSV files for testing.</p>
                  <div className="space-y-2">
                      <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => downloadSampleDataset('sample-water-quality-data.csv')}
                      >
                          <Download className="w-4 h-4 mr-2" />
                          Basic Sample (20 locations)
                      </Button>
                      <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => downloadSampleDataset('comprehensive-water-quality-data.csv')}
                      >
                          <Download className="w-4 h-4 mr-2" />
                          Comprehensive (20 cities)
                      </Button>
                      <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => downloadSampleDataset('extreme-water-quality-data.csv')}
                      >
                          <Download className="w-4 h-4 mr-2" />
                          Extreme Values (10 sites)
                      </Button>
                  </div>
              </CardContent>
          </Card>

        </div>
        {/* Chatbot Assistant at the bottom of the sidebar */}
        <div className="mt-4">
          <ChatbotAssistant />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" className="w-full justify-start gap-2" onClick={onExport} disabled={isExporting}>
            {isExporting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          Export Report
        </Button>
      </SidebarFooter>
    </>
  );
}
