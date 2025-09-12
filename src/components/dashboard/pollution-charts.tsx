"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PollutionData } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface PollutionChartsProps {
  data: PollutionData[];
  selectedLocation?: PollutionData;
}

const chartConfig = {
  hpi: {
    label: "HPI",
    color: "hsl(var(--primary))",
  },
  hei: {
    label: "HEI",
    color: "hsl(var(--chart-2))",
  },
  pli: {
    label: "PLI",
    color: "hsl(var(--chart-3))",
  },
  As: { label: "Arsenic (As)", color: "hsl(var(--chart-1))" },
  Cd: { label: "Cadmium (Cd)", color: "hsl(var(--chart-2))" },
  Cr: { label: "Chromium (Cr)", color: "hsl(var(--chart-3))" },
  Pb: { label: "Lead (Pb)", color: "hsl(var(--chart-4))" },
  Zn: { label: "Zinc (Zn)", color: "hsl(var(--chart-5))" },
};

const indexKeys = ["hpi", "hei", "pli"] as const;
const metalKeys = ["As", "Cd", "Cr", "Pb", "Zn"] as const;
type IndexKey = typeof indexKeys[number];
type MetalKey = typeof metalKeys[number];

export function PollutionCharts({ data, selectedLocation }: PollutionChartsProps) {
  // State for selected indices and metals
  const [selectedIndices, setSelectedIndices] = useState<IndexKey[]>([...indexKeys]);
  const [selectedMetals, setSelectedMetals] = useState<MetalKey[]>([...metalKeys]);

  // Handlers
  const handleIndexChange = (key: IndexKey) => {
    setSelectedIndices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const handleMetalChange = (key: MetalKey) => {
    setSelectedMetals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Data for charts
  const radarChartData = selectedLocation
    ? selectedIndices.map((key) => ({
        index: chartConfig[key].label,
        value: selectedLocation[key],
        fullMark:
          key === "hpi"
            ? 250
            : key === "hei"
            ? 60
            : key === "pli"
            ? 5
            : 100,
      }))
    : [];

  const lineChartData = selectedLocation
    ? selectedMetals.map((metal) => ({
        metal,
        concentration: selectedLocation[metal],
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Visualizations</CardTitle>
        <CardDescription>
          Visual analysis of pollution indices and metal concentrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Parameter selection controls */}
        <div className="flex flex-wrap gap-6 mb-4">
          <div>
            <p className="font-semibold mb-1">Indices</p>
            <div className="flex gap-3">
              {indexKeys.map((key) => (
                <Label key={key} className="flex items-center gap-1 cursor-pointer">
                  <Checkbox
                    checked={selectedIndices.includes(key)}
                    onCheckedChange={() => handleIndexChange(key)}
                    id={`index-${key}`}
                  />
                  {chartConfig[key].label}
                </Label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Metals</p>
            <div className="flex gap-3">
              {metalKeys.map((key) => (
                <Label key={key} className="flex items-center gap-1 cursor-pointer">
                  <Checkbox
                    checked={selectedMetals.includes(key)}
                    onCheckedChange={() => handleMetalChange(key)}
                    id={`metal-${key}`}
                  />
                  {chartConfig[key].label}
                </Label>
              ))}
            </div>
          </div>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">HPI Overview</TabsTrigger>
            <TabsTrigger value="location" disabled={!selectedLocation}>Location Profile</TabsTrigger>
            <TabsTrigger value="metals" disabled={!selectedLocation}>Concentrations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="h-[300px] w-full pt-4">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={data} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="location"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <Tooltip cursor={false} content={<ChartTooltipContent />} />
                  <Legend />
                  {/* Show selected indices as bars */}
                  {selectedIndices.map((key) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={chartConfig[key].color}
                      radius={4}
                      name={chartConfig[key].label}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="location">
            <div className="h-[300px] w-full flex flex-col items-center justify-center pt-4">
                <p className="text-sm font-medium text-center mb-2">{selectedLocation?.location} - Index Profile</p>
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="index" />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 50']} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Radar name={selectedLocation?.location} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </RadarChart>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="metals">
            <div className="h-[300px] w-full pt-4">
               <p className="text-sm font-medium text-center mb-2">{selectedLocation?.location} - Metal Concentrations (mg/L)</p>
               <ChartContainer config={chartConfig} className="w-full h-full">
                 <LineChart
                    data={lineChartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                    >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="metal" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    {/* Show selected metals as lines */}
                    {selectedMetals.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey="concentration"
                        stroke={chartConfig[key].color}
                        strokeWidth={2}
                        name={chartConfig[key].label}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const CartesianGrid = ({ vertical = true, ...props }) => (
    <RechartsPrimitive.CartesianGrid
      strokeDasharray="3 3"
      stroke="hsl(var(--muted-foreground))"
      strokeOpacity={0.2}
      vertical={vertical}
      {...props}
    />
);

// We need to re-export this from recharts due to how it's used internally
import * as RechartsPrimitive from "recharts";
