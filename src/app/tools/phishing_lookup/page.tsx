// components/tool-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportForm } from "@/components/tool-form";
import { Report } from "@/components/phish-report-viewer";
import axios from "axios";

export default function ToolCard() {
  const [results, setResults] = useState<any>(null); // Store report data here
  const [loading, setLoading] = useState(false);

  // This function runs when the user clicks "Scan" in the child component
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
    <Card className="mx-auto w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Phishing Site Detection</CardTitle>
        <CardDescription>Enter a URL to generate a check.</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 border-b">
        <ReportForm onScan={handleScan} isLoading={loading} />
      </div>

      <CardContent className="overflow-hidden">
        {results ? (
            <Report data={results} />
        ) : (
            <p>Please enter website URL to see results.</p>
        )}
      </CardContent>
    </Card>
  );
}