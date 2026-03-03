import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Lock, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl">
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="block bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent">
                Where Emotion
              </span>
              <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Becomes Tangible
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive security analysis tools designed for modern threats. 
              Protect what matters most with enterprise-grade security.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Get Started
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <Lock className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">
                Military-grade encryption and security protocols
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Real-time scanning and instant threat detection
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <ShieldCheck className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Always Protected</h3>
              <p className="text-sm text-muted-foreground">
                24/7 monitoring and automated security updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
