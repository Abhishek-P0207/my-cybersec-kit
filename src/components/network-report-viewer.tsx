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
  Activity, 
  Network, 
  Server, 
  Plug,
  ShieldCheck
} from "lucide-react";

// --- Types based on your Nmap JSON ---
interface Port {
  portNumber: string;
  protocol: string;
  service: string;
}

interface NmapData {
  target: string;
  status: string;
  ports: Port[];
}

export function Report({ data }: { data: NmapData }) {
  const ports = data.ports || [];
  const isUp = data.status.toLowerCase() === "up";

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Target Host" 
          text={data.target} 
          icon={<Server className="h-4 w-4 text-primary" />} 
        />
        <SummaryCard 
          title="Host Status" 
          text={data.status.toUpperCase()} 
          icon={<Activity className={`h-4 w-4 ${isUp ? "text-green-500" : "text-red-500"}`} />} 
          className={isUp ? "border-green-200 bg-green-50 dark:bg-green-950/20" : "border-red-200 bg-red-50 dark:bg-red-950/20"}
        />
        <SummaryCard 
          title="Open Ports" 
          count={ports.length} 
          icon={<Network className="h-4 w-4 text-blue-500" />} 
        />
      </div>

      {/* 2. Port List */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Network Findings</CardTitle>
          <CardDescription>
            Discovered {ports.length} open ports on <span className="font-mono text-primary">{data.target}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full w-full px-6">
            {ports.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-500" />
                No open ports detected.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full pb-6">
                {ports.map((port, index) => (
                  <AccordionItem key={`${port.portNumber}-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left w-full pr-4">
                        <Badge variant="outline" className="w-16 justify-center uppercase font-mono">
                          {port.protocol}
                        </Badge>
                        <div className="flex flex-col">
                          <span className="font-mono text-lg font-semibold text-primary">
                            Port {port.portNumber}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <div className="space-y-4 pt-2 border-t mt-2">
                        {/* Service Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Plug className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase block">Service Name</span>
                              <div className="font-medium text-base">{port.service || "unknown"}</div>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase block">State</span>
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 mt-1">
                              Open
                            </Badge>
                          </div>
                        </div>
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
        {count !== undefined ? count : <span className="text-lg">{text}</span>}
      </div>
    </div>
  );
}