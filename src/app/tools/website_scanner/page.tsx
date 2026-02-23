// components/tool-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportForm } from "@/components/tool-form";
import axios from "axios";
import { WapitiReport } from "@/components/wapitiReport";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null); // Store report data here
  const [loading, setLoading] = useState(false);

  // This function runs when the user clicks "Scan" in the child component
  const handleScan = async (url: string) => {
    setLoading(true);
    setResults(null);

    axios.post("/api/audit/vuln", { url })
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
        <CardTitle>Website Vulnerability Scanner</CardTitle>
        <CardDescription>Enter a URL to generate a security report.</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 border-b">
        <ReportForm onScan={handleScan} isLoading={loading} />
      </div>

      <CardContent className="overflow-hidden">
        {results ? (
            <WapitiReport />
        ) : (
            <p>Please scan a website to see results.</p>
        )}
      </CardContent>
    </Card>
  );
}