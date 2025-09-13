"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  X, 
  Search,
  MapPin,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import type { PollutionData } from "@/lib/data";

interface DataFiltersProps {
  data: PollutionData[];
  onFilteredData: (filteredData: PollutionData[]) => void;
}

export function DataFilters({ data, onFilteredData }: DataFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    riskLevel: "all",
    hpiRange: [0, 200],
    heiRange: [0, 50],
    pliRange: [0, 10],
    location: ""
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = () => {
    let filtered = [...data];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.id.toString().includes(filters.search)
      );
    }

    // Risk level filter
    if (filters.riskLevel !== "all") {
      filtered = filtered.filter(item => item.risk === filters.riskLevel);
    }

    // HPI range filter
    filtered = filtered.filter(item => 
      item.hpi >= filters.hpiRange[0] && item.hpi <= filters.hpiRange[1]
    );

    // HEI range filter
    filtered = filtered.filter(item => 
      item.hei >= filters.heiRange[0] && item.hei <= filters.heiRange[1]
    );

    // PLI range filter
    filtered = filtered.filter(item => 
      item.pli >= filters.pliRange[0] && item.pli <= filters.pliRange[1]
    );

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    onFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      riskLevel: "all",
      hpiRange: [0, 200],
      heiRange: [0, 50],
      pliRange: [0, 10],
      location: ""
    });
    onFilteredData(data);
  };

  const getRiskCounts = () => {
    const counts = {
      all: data.length,
      "High Risk": data.filter(d => d.risk === 'High Risk').length,
      Moderate: data.filter(d => d.risk === 'Moderate').length,
      Safe: data.filter(d => d.risk === 'Safe').length
    };
    return counts;
  };

  const riskCounts = getRiskCounts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by location or ID..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select
              value={filters.riskLevel}
              onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">
                  All ({riskCounts.all})
                </SelectItem>
                <SelectItem value="High Risk">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    High Risk ({riskCounts["High Risk"]})
                  </div>
                </SelectItem>
                <SelectItem value="Moderate">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                    Moderate Risk ({riskCounts.Moderate})
                  </div>
                </SelectItem>
                <SelectItem value="Safe">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Safe ({riskCounts.Safe})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* HPI Range */}
              <div className="space-y-3">
                <Label>HPI Range: {filters.hpiRange[0]} - {filters.hpiRange[1]}</Label>
                <Slider
                  value={filters.hpiRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, hpiRange: value }))}
                  max={200}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 (Safe)</span>
                  <span>200 (Critical)</span>
                </div>
              </div>

              {/* HEI Range */}
              <div className="space-y-3">
                <Label>HEI Range: {filters.heiRange[0]} - {filters.heiRange[1]}</Label>
                <Slider
                  value={filters.heiRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, heiRange: value }))}
                  max={50}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 (Safe)</span>
                  <span>50 (Critical)</span>
                </div>
              </div>

              {/* PLI Range */}
              <div className="space-y-3">
                <Label>PLI Range: {filters.pliRange[0]} - {filters.pliRange[1]}</Label>
                <Slider
                  value={filters.pliRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, pliRange: value }))}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 (Safe)</span>
                  <span>10 (Critical)</span>
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label htmlFor="location">Location Filter</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Filter by specific location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={applyFilters} className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
