"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PollutionData } from "@/lib/data";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortKey = keyof Pick<PollutionData, "location" | "hpi" | "risk">;

interface ResultsTableProps {
  data: PollutionData[];
  onRowClick: (row: PollutionData) => void;
  selectedRowId?: number;
}

export function ResultsTable({ data, onRowClick, selectedRowId }: ResultsTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "hpi", direction: "descending" });

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-2 opacity-30" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUpDown className="w-4 h-4 ml-2" />; // Or a specific up arrow
    }
    return <ArrowUpDown className="w-4 h-4 ml-2" />; // Or a specific down arrow
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Analysis Results</CardTitle>
        <CardDescription>
          Detailed heavy metal pollution indices for each sample location. Click a row to view details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort("location")}>
                    Location
                    {getSortIcon("location")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort("hpi")}>
                    HPI
                    {getSortIcon("hpi")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">HEI</TableHead>
                <TableHead className="text-right">PLI</TableHead>
                <TableHead className="text-center">
                   <Button variant="ghost" onClick={() => requestSort("risk")}>
                    Risk Level
                    {getSortIcon("risk")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow 
                    key={item.id} 
                    onClick={() => onRowClick(item)} 
                    className={cn("cursor-pointer", selectedRowId === item.id && "bg-primary/10")}
                >
                  <TableCell className="font-medium">{item.location}</TableCell>
                  <TableCell>{item.hpi.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    {item.hei.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.pli.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        item.risk === "High Risk"
                          ? "destructive"
                          : item.risk === "Moderate"
                          ? "warning"
                          : "success"
                      }
                    >
                      {item.risk}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
