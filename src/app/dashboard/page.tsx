import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ScanSearch, 
  Binary, 
  ArrowRight, 
  History,
  Activity,
  Image,
  Network,
  Fish
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive security analysis tools at your fingertips
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200/50 dark:border-green-900/50 bg-linear-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">Secure</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200/50 dark:border-blue-900/50 bg-linear-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ScanSearch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">+14%</Badge> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200/50 dark:border-orange-900/50 bg-linear-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Security Tools</h2>
          <Badge variant="outline" className="text-xs">5 Available</Badge>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Vulnerability Scanner */}
          <Link href="/tools/website_scanner" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-3 h-12 w-12 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ScanSearch className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Vulnerability Scanner</CardTitle>
                <CardDescription>
                  Scan websites for CVEs and security flaws
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Git Scanner */}
          <Link href="/tools/git_scanner" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-500/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-3 h-12 w-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Binary className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Git Repository Scanner</CardTitle>
                <CardDescription>
                  Analyze Git repositories for security issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-purple-600 group-hover:text-white transition-all">
                  Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Image Metadata */}
          <Link href="/tools/image_meta" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-3 h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Image Metadata</CardTitle>
                <CardDescription>
                  Extract metadata and EXIF data from images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Network Scanner */}
          <Link href="/tools/network_scanner" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-500/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-3 h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Network Scanner</CardTitle>
                <CardDescription>
                  Scan network ports and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Phishing Detector */}
          <Link href="/tools/phish_detector" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-500/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-3 h-12 w-12 rounded-xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Fish className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Phishing Detector</CardTitle>
                <CardDescription>
                  Check URLs against phishing databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-red-600 group-hover:text-white transition-all">
                  Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Coming Soon */}
          <Card className="h-full bg-muted/30 backdrop-blur-sm border-dashed opacity-60">
            <CardHeader>
              <div className="mb-3 h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-muted-foreground">Audit Logs</CardTitle>
              <CardDescription>
                Review past scan history and reports
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
