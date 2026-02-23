// components/tool-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NetworkReportForm } from "@/components/network-tool-form";
import { Report } from "@/components/network-report-viewer";
import axios from "axios";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null); // Store report data here
  const [loading, setLoading] = useState(false);

  // This function runs when the user clicks "Scan" in the child component
  const handleScan = async (target: string) => {
    setLoading(true);
    setResults(null);


    axios.post("/api/scan", { target })
      .then((response) => {
        console.log("Scan results:", response.data);
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
        <CardTitle>Network Scanner</CardTitle>
        <CardDescription>Enter a IP address in the network to scan.</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 border-b">
        <NetworkReportForm onScan={handleScan} isLoading={loading} />
      </div>

      <CardContent className="overflow-hidden">
        {results ? (
            <Report data={results} />
        ) : (
            <p>Please scan an IP to see results.</p>
        )}
      </CardContent>
    </Card>
  );
}