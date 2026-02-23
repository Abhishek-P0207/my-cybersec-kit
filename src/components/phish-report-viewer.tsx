"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  ShieldCheck,
  ShieldQuestion,
  Database, 
  Calendar, 
  ExternalLink,
  Globe
} from "lucide-react";

// --- Types based on your PhishTank JSON ---
interface PhishTankData {
  success: boolean;
  url: string;
  result: {
    meta: {
      timestamp: string;
      serverid: string;
      status: string;
      requestid: string;
    };
    results: {
      url: string;
      in_database: boolean;
      phish_id?: number;
      phish_detail_page?: string;
      verified?: boolean;
      verified_at?: string;
      valid?: boolean;
    };
  };
}

export function Report({ data }: { data: PhishTankData }) {
  const { results, meta } = data.result;
  const isKnown = results.in_database;
  const isVerified = results.verified;
  
  // In PhishTank: 'valid' means it is currently an active phishing site.
  // If in_database is true but valid is false, it's an offline/inactive threat.
  const isActiveThreat = isKnown && results.valid;
  const isPastThreat = isKnown && !results.valid;

  // Determine the primary status UI
  let statusColor = "text-green-500";
  let statusBg = "bg-green-50 border-green-200 dark:bg-green-950/20";
  let StatusIcon = ShieldCheck;
  let statusText = "Clean / Unknown";

  if (isActiveThreat) {
    statusColor = "text-red-600";
    statusBg = "bg-red-50 border-red-200 dark:bg-red-950/20";
    StatusIcon = ShieldAlert;
    statusText = "Active Phishing Threat";
  } else if (isPastThreat) {
    statusColor = "text-orange-500";
    statusBg = "bg-orange-50 border-orange-200 dark:bg-orange-950/20";
    StatusIcon = ShieldQuestion;
    statusText = "Inactive / Past Threat";
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard 
          title="Threat Status" 
          text={statusText} 
          icon={<StatusIcon className={`h-4 w-4 ${statusColor}`} />} 
          className={statusBg}
        />
        <SummaryCard 
          title="In Database" 
          text={isKnown ? "Yes" : "No"} 
          icon={<Database className="h-4 w-4 text-blue-500" />} 
        />
        <SummaryCard 
          title="Verified Status" 
          text={isVerified ? "Community Verified" : "Unverified"} 
          icon={<ShieldCheck className="h-4 w-4 text-purple-500" />} 
        />
        <SummaryCard 
          title="Checked On" 
          text={new Date(meta.timestamp).toLocaleDateString()} 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      {/* 2. Detailed URL Report */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            URL Analysis Details
          </CardTitle>
          <CardDescription>
            Deep dive into the requested domain: <span className="font-mono text-primary break-all">{data.url}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Contextual Alert based on status */}
            <div className={`p-4 border rounded-lg flex items-start gap-3 ${statusBg}`}>
              <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor}`} />
              <div>
                <h4 className={`font-semibold ${statusColor}`}>
                  {isActiveThreat ? "Warning: Malicious Site Detected" : isPastThreat ? "Notice: Historical Threat Record" : "No Threat Detected"}
                </h4>
                <p className="text-sm mt-1 text-muted-foreground">
                  {isActiveThreat 
                    ? "This URL is actively confirmed as a phishing website by the community. Do not interact with it."
                    : isPastThreat 
                    ? "This URL was previously flagged as a phishing site but is currently marked as invalid/offline. Proceed with caution."
                    : "This URL does not currently exist in the PhishTank database of known malicious sites."}
                </p>
              </div>
            </div>

            {/* PhishTank Specific Details (Only shows if it exists in the database) */}
            {isKnown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                    PhishTank ID
                  </span>
                  <div className="font-mono text-base font-medium">
                    #{results.phish_id}
                  </div>
                </div>
                
                {results.verified_at && (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                      Verification Date
                    </span>
                    <div className="text-base font-medium">
                      {new Date(results.verified_at).toLocaleString()}
                    </div>
                  </div>
                )}

                {results.phish_detail_page && (
                  <div className="md:col-span-2 pt-2 border-t">
                    <a 
                      href={results.phish_detail_page} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Full Community Report on PhishTank 
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Small sub-component for the top stats
function SummaryCard({ title, text, icon, className = "" }: any) {
  return (
    <div className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="text-lg font-bold tracking-tight">
        {text}
      </div>
    </div>
  );
}