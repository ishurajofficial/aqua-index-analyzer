"use client";
import { Beaker, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  summary: string;
  loading?: boolean;
}

export function SummaryCard({ summary, loading = false }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="p-2 bg-primary/10 rounded-lg">
            <Beaker className="w-6 h-6 text-primary" />
          </span>
          <span className="font-headline text-2xl">AI-Powered Insights</span>
          {loading && <Loader className="w-6 h-6 text-primary animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        {loading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        ) : (
            <p
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: summary }}
            />
        )}
      </CardContent>
    </Card>
  );
}
