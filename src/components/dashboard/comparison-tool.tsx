"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GitCompare, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";
import type { PollutionData } from "@/lib/data";

interface ComparisonToolProps {
  data: PollutionData[];
}

export function ComparisonTool({ data }: ComparisonToolProps) {
  const [selectedSamples, setSelectedSamples] = useState<PollutionData[]>([]);
  const [comparisonType, setComparisonType] = useState<'indices' | 'metals' | 'risk'>('indices');

  const addSample = (sample: PollutionData) => {
    if (selectedSamples.length < 4 && !selectedSamples.find(s => s.id === sample.id)) {
      setSelectedSamples(prev => [...prev, sample]);
    }
  };

  const removeSample = (sampleId: number) => {
    setSelectedSamples(prev => prev.filter(s => s.id !== sampleId));
  };

  const clearAll = () => {
    setSelectedSamples([]);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Moderate': return <TrendingUp className="h-4 w-4" />;
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Sample Comparison Tool
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare up to 4 samples side by side
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Select Samples to Compare</label>
            {selectedSamples.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <Select onValueChange={(value) => {
            const sample = data.find(d => d.id.toString() === value);
            if (sample) addSample(sample);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a sample to add..." />
            </SelectTrigger>
            <SelectContent>
              {data
                .filter(d => !selectedSamples.find(s => s.id === d.id))
                .map((sample) => (
                  <SelectItem key={sample.id} value={sample.id.toString()}>
                    {sample.location} (ID: {sample.id})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Selected Samples */}
          {selectedSamples.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSamples.map((sample) => (
                <Badge
                  key={sample.id}
                  variant="secondary"
                  className="flex items-center gap-2 pr-1"
                >
                  {sample.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSample(sample.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Tabs */}
        {selectedSamples.length > 0 && (
          <Tabs value={comparisonType} onValueChange={(value: any) => setComparisonType(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="indices">Indices</TabsTrigger>
              <TabsTrigger value="metals">Metals</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
            </TabsList>

            <TabsContent value="indices" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Sample</th>
                      <th className="text-center p-2">HPI</th>
                      <th className="text-center p-2">HEI</th>
                      <th className="text-center p-2">PLI</th>
                      <th className="text-center p-2">Avg CF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSamples.map((sample) => (
                      <tr key={sample.id} className="border-b">
                        <td className="p-2 font-medium">{sample.location}</td>
                        <td className="text-center p-2">
                          <Badge variant={sample.hpi > 100 ? 'destructive' : sample.hpi > 50 ? 'secondary' : 'default'}>
                            {sample.hpi.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant={(() => {
                            const avgCf = (sample.cf.As + sample.cf.Cd + sample.cf.Cr + sample.cf.Pb + sample.cf.Zn) / 5;
                            return avgCf > 3 ? 'destructive' : avgCf > 1 ? 'secondary' : 'default';
                          })()}>
                            {((sample.cf.As + sample.cf.Cd + sample.cf.Cr + sample.cf.Pb + sample.cf.Zn) / 5).toFixed(2)}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant={sample.hei > 10 ? 'destructive' : sample.hei > 5 ? 'secondary' : 'default'}>
                            {sample.hei.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant={sample.pli > 1 ? 'destructive' : sample.pli > 0.5 ? 'secondary' : 'default'}>
                            {sample.pli.toFixed(2)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="metals" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Sample</th>
                      <th className="text-center p-2">As (mg/L)</th>
                      <th className="text-center p-2">Cd (mg/L)</th>
                      <th className="text-center p-2">Cr (mg/L)</th>
                      <th className="text-center p-2">Pb (mg/L)</th>
                      <th className="text-center p-2">Zn (mg/L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSamples.map((sample) => (
                      <tr key={sample.id} className="border-b">
                        <td className="p-2 font-medium">{sample.location}</td>
                        <td className="text-center p-2">{sample.As.toFixed(3)}</td>
                        <td className="text-center p-2">{sample.Cd.toFixed(3)}</td>
                        <td className="text-center p-2">{sample.Cr.toFixed(3)}</td>
                        <td className="text-center p-2">{sample.Pb.toFixed(3)}</td>
                        <td className="text-center p-2">{sample.Zn.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSamples.map((sample) => (
                  <div key={sample.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{sample.location}</h4>
                      <Badge className={getRiskColor(sample.risk)}>
                        <div className="flex items-center gap-1">
                          {getRiskIcon(sample.risk)}
                          {sample.risk} Risk
                        </div>
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>HPI: {sample.hpi.toFixed(2)}</div>
                      <div>HEI: {sample.hei.toFixed(2)}</div>
                      <div>PLI: {sample.pli.toFixed(2)}</div>
                      <div>Avg CF: {((sample.cf.As + sample.cf.Cd + sample.cf.Cr + sample.cf.Pb + sample.cf.Zn) / 5).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {selectedSamples.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select samples from the dropdown to start comparing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
