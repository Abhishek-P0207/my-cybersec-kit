"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Terminal, 
  Info
} from "lucide-react";

import { getJsonFromFile } from "@/lib/getJsonFromFile";
import { useEffect, useState } from "react";
import { report } from "process";

// --- Types based on Wapiti JSON ---
interface Classification {
  desc: string;
  sol: string;
  ref: Record<string, string>;
  wstg: string[];
}

interface VulnerabilityInstance {
  method: string;
  path: string;
  info: string;
  level: number;
  curl_command?: string;
}

interface WapitiData {
  classifications: Record<string, Classification>;
  vulnerabilities: Record<string, VulnerabilityInstance[]>;
  infos: {
    target: string;
    date: string;
    version: string;
  };
}

// --- Helper Components ---
function SummaryCard({ title, count, text, icon, className = "" }: any) {
  return (
    <div className={`px-4 py-3 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="text-xl font-bold">
          {count !== undefined ? count : <span className="text-sm">{text}</span>}
        </div>
      </div>
    </div>
  );
}

export function WapitiReport() {
  const [reportData, setReportData] = useState<WapitiData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getJsonFromFile();
      if(data){
        setReportData(data);
      }
      else {
        console.error("Failed to fetch report data:");
        return null
      }
    }
    fetchData()
  }, [])

  if(reportData === null) return <div className="flex items-center justify-center h-full"><div className="text-center"><Terminal className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Loading report...</p></div></div>

  // 1. Filter out empty categories to find actual issues
  const activeIssues = Object.entries(reportData.vulnerabilities).filter(
    ([_, instances]) => instances.length > 0
  );

  // 2. Calculate Total Count
  const totalCount = activeIssues.reduce((acc, [_, instances]) => acc + instances.length, 0);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* --- Top Summary Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-none">
        <SummaryCard 
          title="Target" 
          text={reportData.infos.target} 
          icon={<Globe className="h-4 w-4 text-primary" />} 
        />
        <SummaryCard 
          title="Total Issues" 
          count={totalCount} 
          icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} 
          className={totalCount > 0 ? "border-orange-200 bg-orange-50 dark:bg-orange-950/20" : ""}
        />
        <SummaryCard 
          title="Scanner" 
          text={reportData.infos.version} 
          icon={<Terminal className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      {/* --- Main Findings List --- */}
      <Card className="flex-1 flex flex-col overflow-hidden border-t-4 border-t-primary/20">
        <CardHeader className="flex-none pb-4">
          <CardTitle>Security Findings</CardTitle>
          <CardDescription>Detailed analysis from Wapiti scan</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <ScrollArea className="h-full w-full px-6">
            {activeIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mb-4 text-green-500" />
                <p>No vulnerabilities found.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full pb-6">
                {activeIssues.map(([categoryName, instances], index) => {
                  const details = reportData.classifications[categoryName];
                  
                  return (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold text-left">{categoryName}</span>
                          <Badge variant="outline" className="ml-2 bg-muted">
                            {instances.length} Found
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="text-sm space-y-6 pt-2">
                        {/* 1. Description & Solution (Context) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4" /> Description
                            </h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {details?.desc}
                            </p>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
                            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" /> How to Fix
                            </h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {details?.sol}
                            </p>
                          </div>
                        </div>

                        {/* 2. Specific Instances */}
                        <div className="space-y-3">
                          <h4 className="font-medium">Affected Endpoints</h4>
                          {instances.map((vuln, vIndex) => (
                            <div key={vIndex} className="p-3 border rounded-md bg-card shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="uppercase">{vuln.method}</Badge>
                                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                                  {vuln.path}
                                </code>
                              </div>
                              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                                {vuln.info}
                              </p>
                              {vuln.curl_command && (
                                <div className="mt-2 bg-slate-950 text-slate-50 p-2 rounded text-xs font-mono overflow-x-auto whitespace-nowrap">
                                  {vuln.curl_command}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}