"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  Settings,
  Loader
} from "lucide-react";
import type { PollutionData } from "@/lib/data";

interface ExportOptionsProps {
  data: PollutionData[];
  summary: string;
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
}

interface ExportOptions {
  format: 'markdown' | 'csv' | 'json' | 'pdf';
  includeCharts: boolean;
  includeSummary: boolean;
  includeRawData: boolean;
  includeFormulas: boolean;
  customTitle: string;
  customDescription: string;
}

export function ExportOptions({ data, summary, onExport, isExporting }: ExportOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'markdown',
    includeCharts: true,
    includeSummary: true,
    includeRawData: true,
    includeFormulas: true,
    customTitle: '',
    customDescription: ''
  });

  const formatOptions = [
    {
      value: 'markdown',
      label: 'Markdown Report',
      description: 'Comprehensive report with formatting',
      icon: <FileText className="h-4 w-4" />
    },
    {
      value: 'csv',
      label: 'CSV Data',
      description: 'Raw data for spreadsheet analysis',
      icon: <FileSpreadsheet className="h-4 w-4" />
    },
    {
      value: 'json',
      label: 'JSON Data',
      description: 'Structured data for API integration',
      icon: <FileText className="h-4 w-4" />
    },
    {
      value: 'pdf',
      label: 'PDF Report',
      description: 'Professional PDF document',
      icon: <FileImage className="h-4 w-4" />
    }
  ];

  const handleExport = () => {
    onExport(options);
  };

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Settings className="h-4 w-4 mr-1" />
            {isExpanded ? "Hide Options" : "Show Options"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format Selection */}
        <div className="space-y-3">
          <Label>Export Format</Label>
          <Select
            value={options.format}
            onValueChange={(value) => updateOption('format', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
              {formatOptions.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  <div className="flex items-center gap-2">
                    {format.icon}
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-3">
              <Label>Content Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSummary"
                    checked={options.includeSummary}
                    onCheckedChange={(checked) => updateOption('includeSummary', checked)}
                  />
                  <Label htmlFor="includeSummary" className="text-sm">
                    Include AI Summary
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={options.includeCharts}
                    onCheckedChange={(checked) => updateOption('includeCharts', checked)}
                  />
                  <Label htmlFor="includeCharts" className="text-sm">
                    Include Charts & Visualizations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeRawData"
                    checked={options.includeRawData}
                    onCheckedChange={(checked) => updateOption('includeRawData', checked)}
                  />
                  <Label htmlFor="includeRawData" className="text-sm">
                    Include Raw Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFormulas"
                    checked={options.includeFormulas}
                    onCheckedChange={(checked) => updateOption('includeFormulas', checked)}
                  />
                  <Label htmlFor="includeFormulas" className="text-sm">
                    Include Calculation Formulas
                  </Label>
                </div>
              </div>
            </div>

            {/* Custom Title */}
            <div className="space-y-2">
              <Label htmlFor="customTitle">Custom Title (Optional)</Label>
              <Input
                id="customTitle"
                placeholder="Enter custom report title..."
                value={options.customTitle}
                onChange={(e) => updateOption('customTitle', e.target.value)}
              />
            </div>

            {/* Custom Description */}
            <div className="space-y-2">
              <Label htmlFor="customDescription">Custom Description (Optional)</Label>
              <Textarea
                id="customDescription"
                placeholder="Enter custom report description..."
                value={options.customDescription}
                onChange={(e) => updateOption('customDescription', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleExport} 
            disabled={isExporting || data.length === 0}
            className="w-full md:w-auto"
          >
            {isExporting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
        </div>

        {/* Data Summary */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Samples: {data.length}</span>
            <span>Format: {formatOptions.find(f => f.value === options.format)?.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
