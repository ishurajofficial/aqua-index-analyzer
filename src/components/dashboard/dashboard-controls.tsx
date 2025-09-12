"use client";

import * as React from "react";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileUp, Loader, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { RawPollutionData } from "@/lib/data";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const parsedData = results.data.map((row: any, index: number) => ({
                id: row.id ? Number(row.id) : index + 1,
                location: row.location || `Location ${index + 1}`,
                lat: Number(row.lat) || 0,
                lon: Number(row.lon) || 0,
                As: Number(row.As) || 0,
                Cd: Number(row.Cd) || 0,
                Cr: Number(row.Cr) || 0,
                Pb: Number(row.Pb) || 0,
                Zn: Number(row.Zn) || 0,
              }));
              onFileUpload(parsedData as RawPollutionData[]);
              
              // Save dataset metadata to Firestore
              try {
                await addDoc(collection(db(), "datasets"), {
                  name: file.name,
                  rows: parsedData.length,
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
                description: "Please check the file format and try again.",
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileUp className="w-4 h-4" />
            Upload Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            Upload CSV files with water quality data.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          <Button className="w-full" size="sm" onClick={handleFileButtonClick}>
            <FileUp className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Standards
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            Select analysis standard.
          </p>
          <RadioGroup value={selectedStandard} onValueChange={onStandardChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="who" id="who" />
              <Label htmlFor="who" className="font-normal text-sm">WHO</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bis" id="bis" />
              <Label htmlFor="bis" className="font-normal text-sm">BIS</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
