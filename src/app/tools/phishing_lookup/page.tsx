"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "@/components/tool-form";
import { Report } from "@/components/phish-report-viewer";
import { AIAssistant } from "@/components/ai-assistant";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Bot } from "lucide-react";
import axios from "axios";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (url: string) => {
    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("url", url);

    axios.post("/api/phish", formData)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scan results:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className="mx-auto w-full h-full flex flex-col shadow-lg">
      <CardHeader className="border-b bg-linear-to-r from-card to-muted/20">
        <CardTitle>Phishing Site Detection</CardTitle>
        <CardDescription>Enter a URL to check against phishing databases</CardDescription>
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
        ) : results ? (
          <Tabs defaultValue="report" className="h-full flex flex-col">
            <div className="border-b px-6 pt-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Analysis Report
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="report" className="flex-1 overflow-auto p-6 m-0">
              <Report data={results} />
            </TabsContent>

          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground p-6">
            <p>Enter a website URL above to check for phishing threats</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}