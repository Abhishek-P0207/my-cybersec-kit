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
  ShieldAlert, 
  Package, 
  ExternalLink 
} from "lucide-react";

// --- Types based on your JSON ---
interface Vulnerability {
  VulnerabilityID: string;
  PkgName: string;
  InstalledVersion: string;
  FixedVersion: string;
  Severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  Title?: string;
  Description?: string;
  PrimaryURL?: string;
}

interface ScanData {
  repository: string;
  scanDate: string;
  results: {
    Results: Array<{
      Vulnerabilities?: Vulnerability[];
    }>;
  };
}

// --- Helper Functions ---
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL": return "bg-red-600 hover:bg-red-700 border-red-600";
    case "HIGH": return "bg-orange-500 hover:bg-orange-600 border-orange-500";
    case "MEDIUM": return "bg-yellow-500 hover:bg-yellow-600 border-yellow-500";
    case "LOW": return "bg-blue-500 hover:bg-blue-600 border-blue-500";
    default: return "bg-gray-500 border-gray-500";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ReportViewer({ data }: { data: ScanData }) {
  // Safe extraction of vulnerabilities
  const vulnerabilities = data.results?.Results?.[0]?.Vulnerabilities || [];
  
  // Calculate Stats
  const stats = {
    critical: vulnerabilities.filter((v) => v.Severity === "CRITICAL").length,
    high: vulnerabilities.filter((v) => v.Severity === "HIGH").length,
    medium: vulnerabilities.filter((v) => v.Severity === "MEDIUM").length,
    low: vulnerabilities.filter((v) => v.Severity === "LOW").length,
    total: vulnerabilities.length,
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Issues" 
          count={stats.total} 
          icon={<ShieldAlert className="h-4 w-4 text-primary" />} 
        />
        <SummaryCard 
          title="Critical" 
          count={stats.critical} 
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />} 
          className="border-red-200 bg-red-50 dark:bg-red-950/20"
        />
        <SummaryCard 
          title="High Severity" 
          count={stats.high} 
          icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} 
          className="border-orange-200 bg-orange-50 dark:bg-orange-950/20"
        />
        <SummaryCard 
          title="Scanned On" 
          text={formatDate(data.scanDate)} 
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />} 
        />
      </div>

      {/* 2. Vulnerability List */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Security Findings</CardTitle>
          <CardDescription>
            Found {stats.total} vulnerabilities in <span className="font-mono text-primary">{data.repository}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full w-full px-6">
            {vulnerabilities.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                No vulnerabilities found! Your repo is clean.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full pb-6">
                {vulnerabilities.map((vuln, index) => (
                  <AccordionItem key={`${vuln.VulnerabilityID}-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left w-full pr-4">
                        <Badge className={`${getSeverityColor(vuln.Severity)} w-20 justify-center`}>
                          {vuln.Severity}
                        </Badge>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{vuln.PkgName}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                             {vuln.VulnerabilityID}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <div className="space-y-4 pt-2 border-t mt-2">
                        {/* Quick Action Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-3 rounded-lg">
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Installed Version</span>
                            <div className="font-mono text-red-600">{vuln.InstalledVersion}</div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Fixed In</span>
                            <div className="font-mono text-green-600 font-bold">{vuln.FixedVersion}</div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold mb-1">Overview</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {vuln.Description || "No description provided."}
                          </p>
                        </div>

                        {/* Links */}
                        {vuln.PrimaryURL && (
                          <div className="pt-2">
                            <a 
                              href={vuln.PrimaryURL} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center text-primary hover:underline"
                            >
                              Read full advisory <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Small sub-component for the top stats
function SummaryCard({ title, count, text, icon, className = "" }: any) {
  return (
    <div className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {count !== undefined ? count : <span className="text-sm">{text}</span>}
      </div>
    </div>
  );
}