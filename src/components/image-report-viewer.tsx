// components/metadata-viewer.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MetadataViewerProps {
  data: any[];
}

export function ReportViewer({ data }: MetadataViewerProps) {
  const [viewMode, setViewMode] = useState<"table" | "raw">("table");
  
  const metadata = data;

  if (!metadata) return <p className="text-muted-foreground">No metadata found.</p>;

  // Helper to format values securely and cleanly
  const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return (
        <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    if (typeof value === "string" && value.trim().startsWith("{") && value.trim().endsWith("}")) {
      try {
        const parsed = JSON.parse(value);
        return (
          <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      } catch (e) {
        // Fallback to standard string render
      }
    }

    return <span className="text-sm break-all">{String(value)}</span>;
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    // Optional: Add a toast notification here
  };

  return (
    <div className="space-y-4">
      {/* Toggle Controls */}
      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "table" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
          <Button 
            variant={viewMode === "raw" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("raw")}
          >
            Raw JSON
          </Button>
        </div>
        
        {viewMode === "raw" && (
          <Button variant="outline" size="sm" onClick={handleCopyRaw}>
            Copy JSON
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto max-h-[600px] pr-2 rounded-md">
        {viewMode === "raw" ? (
          <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto border">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="space-y-6">
            {Object.entries(metadata).map(([category, properties]) => {
              if (typeof properties !== "object" || properties === null) return null;

              return (
                <Card key={category} className="shadow-sm">
                  <CardHeader className="py-3 bg-muted/50 border-b">
                    <CardTitle className="text-base tracking-wide">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {Object.entries(properties).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 p-3 gap-2 md:gap-4 hover:bg-muted/20 transition-colors">
                          <div className="text-sm font-medium text-muted-foreground md:col-span-1">
                            {key}
                          </div>
                          <div className="md:col-span-2">
                            {renderValue(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}