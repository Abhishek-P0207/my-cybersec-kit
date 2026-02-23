import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ShieldCheck, 
  ScanSearch, 
  Binary, 
  ArrowRight, 
  History,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-2">
      {/* 1. Hero / Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Select a tool to begin your security analysis.
        </p>
      </div>

      {/* 2. Key Metrics (Mock Data for Visuals) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ScanSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Tool Selection Grid */}
      <h2 className="text-lg font-semibold mt-4">Available Tools</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Tool 1: Scanner */}
        <Link href="/tools/website_scanner" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="mb-2 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ScanSearch className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Vulnerability Scanner</CardTitle>
              <CardDescription>
                Scan websites for CVEs and security flaws.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground">
                Launch Tool <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Tool 2: Converter (Example) */}
        <Link href="/tools/git_scanner" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="mb-2 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Binary className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Image Metadata</CardTitle>
              <CardDescription>
                Extract the metadata from any image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-600 group-hover:text-white">
                Launch Tool <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>


        {/* Tool 3: History / Logs (Placeholder) */}
        <div className="group opacity-60 cursor-not-allowed">
          <Card className="h-full bg-muted/50 border-dashed">
            <CardHeader>
              <div className="mb-2 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Review past scan history and reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}