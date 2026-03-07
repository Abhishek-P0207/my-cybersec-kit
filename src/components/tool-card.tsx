"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "./tool-form";
import { ReportViewer } from "@/components/gitReportViewer";
import { AIAssistant } from "@/components/ai-assistant";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, Bot } from "lucide-react";
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

      <CardContent className="flex-1 overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 m-6 border border-destructive/50 rounded-lg bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : results ? (
          <Tabs defaultValue="report" className="h-full flex flex-col">
            <div className="border-b px-6 pt-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Scan Report
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="report" className="flex-1 overflow-auto p-6 m-0">
              <ReportViewer data={results} />
            </TabsContent>
            
            <TabsContent value="ai" className="flex-1 overflow-hidden p-6 m-0">
              <AIAssistant scanData={results} context="Git repository scan" />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground p-6">
            <p>Enter a repository URL above to begin scanning</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}