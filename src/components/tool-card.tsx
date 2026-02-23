// components/tool-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportForm } from "./tool-form";
import { ScrollArea } from "@/components/ui/scroll-area"; // Optional: for scrolling results
import { ReportViewer } from "@/components/gitReportViewer";
import axios from "axios";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null); // Store report data here
  const [loading, setLoading] = useState(false);

  // This function runs when the user clicks "Scan" in the child component
  const handleScan = async (url: string) => {
    setLoading(true);
    setResults(null);

    axios.post("/api/audit/git", { url })
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
    <Card className="mx-auto w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Vulnerability Scanner</CardTitle>
        <CardDescription>Enter a URL to generate a security report.</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 border-b">
        <ReportForm onScan={handleScan} isLoading={loading} />
      </div>

      <CardContent className="overflow-hidden">
        {results ? (
            <ReportViewer data={results} />
        ) : (
            <p>Please scan a repository to see results.</p>
        )}
      </CardContent>
    </Card>
  );
}