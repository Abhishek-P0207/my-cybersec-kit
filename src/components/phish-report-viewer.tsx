"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldAlert, 
  ShieldCheck,
  ShieldQuestion,
  Database, 
  Calendar, 
  ExternalLink,
  Globe
} from "lucide-react";

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
  const isActiveThreat = isKnown && results.valid;
  const isPastThreat = isKnown && !results.valid;

  let statusColor = "text-green-600 dark:text-green-400";
  let statusBg = "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50";
  let StatusIcon = ShieldCheck;
  let statusText = "Clean / Unknown";
  let statusBadge = "secondary";

  if (isActiveThreat) {
    statusColor = "text-red-600 dark:text-red-400";
    statusBg = "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50";
    StatusIcon = ShieldAlert;
    statusText = "Active Phishing Threat";
    statusBadge = "destructive";
  } else if (isPastThreat) {
    statusColor = "text-orange-600 dark:text-orange-400";
    statusBg = "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50";
    StatusIcon = ShieldQuestion;
    statusText = "Inactive / Past Threat";
    statusBadge = "outline";
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={statusBg}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${statusColor}`} />
              <CardTitle className="text-sm font-medium">Threat Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={statusBadge as any} className="text-xs">{statusText}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm font-medium">In Database</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={isKnown ? "default" : "secondary"} className="text-xs">
              {isKnown ? "Yes" : "No"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-sm font-medium">Verified Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={isVerified ? "default" : "outline"} className="text-xs">
              {isVerified ? "Verified" : "Unverified"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Checked On</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {new Date(meta.timestamp).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>URL Analysis Details</CardTitle>
          </div>
          <CardDescription className="break-all">
            <span className="font-mono text-xs">{data.url}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Box */}
          <div className={`p-4 border rounded-lg flex items-start gap-3 ${statusBg}`}>
            <StatusIcon className={`h-5 w-5 mt-0.5 shrink-0 ${statusColor}`} />
            <div className="flex-1">
              <h4 className={`font-semibold ${statusColor}`}>
                {isActiveThreat 
                  ? "Warning: Malicious Site Detected" 
                  : isPastThreat 
                  ? "Notice: Historical Threat Record" 
                  : "No Threat Detected"}
              </h4>
              <p className="text-sm mt-1 text-muted-foreground">
                {isActiveThreat 
                  ? "This URL is actively confirmed as a phishing website. Do not interact with it."
                  : isPastThreat 
                  ? "This URL was previously flagged but is currently marked as invalid/offline. Proceed with caution."
                  : "This URL does not exist in the PhishTank database of known malicious sites."}
              </p>
            </div>
          </div>

          {/* PhishTank Details */}
          {isKnown && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    PhishTank ID
                  </p>
                  <p className="font-mono text-base font-medium">
                    #{results.phish_id}
                  </p>
                </div>
                
                {results.verified_at && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Verification Date
                    </p>
                    <p className="text-base font-medium">
                      {new Date(results.verified_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {results.phish_detail_page && (
                <>
                  <Separator />
                  <a 
                    href={results.phish_detail_page} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    View Full Report on PhishTank 
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </a>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}