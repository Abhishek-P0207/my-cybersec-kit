"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportForm } from "./tool-form";
import { ReportViewer } from "@/components/gitReportViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import axios from "axios";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (url: string) => {
    setLoading(true);
    setResults(null);
    setError(null);

    axios.post("/api/audit/git", { url })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scan results:", error);
        setError(error.response?.data?.message || "Failed to scan repository");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className="mx-auto w-full h-full flex flex-col shadow-lg">
      <CardHeader className="border-b bg-linear-to-r from-card to-muted/20">
        <CardTitle>Vulnerability Scanner</CardTitle>
        <CardDescription>Enter a URL to generate a security report</CardDescription>
      </CardHeader>
      
      <div className="px-6 py-4 border-b bg-muted/30">
        <ReportForm onScan={handleScan} isLoading={loading} />
      </div>

      <CardContent className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : results ? (
          <ReportViewer data={results} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Enter a repository URL above to begin scanning</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}