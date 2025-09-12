"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  MapPin,
  Clock,
  Users
} from "lucide-react";
import type { PollutionData } from "@/lib/data";

interface DashboardStatsProps {
  data: PollutionData[];
  loading: boolean;
}

export function DashboardStats({ data, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalSamples = data.length;
  const highRiskSamples = data.filter(d => d.risk === 'High').length;
  const moderateRiskSamples = data.filter(d => d.risk === 'Moderate').length;
  const safeSamples = data.filter(d => d.risk === 'Low').length;
  
  const highRiskPercentage = totalSamples > 0 ? (highRiskSamples / totalSamples) * 100 : 0;
  const moderateRiskPercentage = totalSamples > 0 ? (moderateRiskSamples / totalSamples) * 100 : 0;
  const safePercentage = totalSamples > 0 ? (safeSamples / totalSamples) * 100 : 0;

  const avgHPI = totalSamples > 0 ? data.reduce((sum, d) => sum + d.hpi, 0) / totalSamples : 0;
  const avgHEI = totalSamples > 0 ? data.reduce((sum, d) => sum + d.hei, 0) / totalSamples : 0;
  const avgPLI = totalSamples > 0 ? data.reduce((sum, d) => sum + d.pli, 0) / totalSamples : 0;

  const stats = [
    {
      title: "Total Samples",
      value: totalSamples,
      icon: <Droplets className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Water quality samples analyzed"
    },
    {
      title: "High Risk",
      value: highRiskSamples,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: `${highRiskPercentage.toFixed(1)}% of samples`,
      progress: highRiskPercentage
    },
    {
      title: "Moderate Risk",
      value: moderateRiskSamples,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: `${moderateRiskPercentage.toFixed(1)}% of samples`,
      progress: moderateRiskPercentage
    },
    {
      title: "Safe Samples",
      value: safeSamples,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${safePercentage.toFixed(1)}% of samples`,
      progress: safePercentage
    }
  ];

  const metrics = [
    {
      title: "Average HPI",
      value: avgHPI.toFixed(2),
      description: "Heavy Metal Pollution Index",
      trend: avgHPI > 100 ? "High" : avgHPI > 50 ? "Moderate" : "Low"
    },
    {
      title: "Average HEI",
      value: avgHEI.toFixed(2),
      description: "Heavy Metal Evaluation Index",
      trend: avgHEI > 10 ? "High" : avgHEI > 5 ? "Moderate" : "Low"
    },
    {
      title: "Average PLI",
      value: avgPLI.toFixed(2),
      description: "Pollution Load Index",
      trend: avgPLI > 1 ? "High" : avgPLI > 0.5 ? "Moderate" : "Low"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Analysis Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                  <Badge 
                    variant={metric.trend === 'High' ? 'destructive' : 
                            metric.trend === 'Moderate' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
