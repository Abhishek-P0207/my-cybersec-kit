"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { 
  ShieldCheck,
  LayoutDashboard,
  ScanSearch,
  Binary,
  Image,
  Network,
  Fish,
  User,
  Settings,
  LogOut
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

const tools = [
  {
    title: "Website Scanner",
    url: "/tools/website_scanner",
    icon: ScanSearch,
  },
  {
    title: "Git Scanner",
    url: "/tools/git_scanner",
    icon: Binary,
  },
  {
    title: "Network Scanner",
    url: "/tools/network_scanner",
    icon: Network,
  },
  {
    title: "Image Metadata",
    url: "/tools/image_meta",
    icon: Image,
  },
  {
    title: "Phishing Detector",
    url: "/tools/phishing_lookup",
    icon: Fish,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-4">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Cybersec Kit</h1>
            <p className="text-xs text-muted-foreground">Security Toolkit</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.url}>
                  <SidebarMenuButton asChild isActive={pathname === tool.url}>
                    <Link href={tool.url}>
                      <tool.icon className="h-4 w-4" />
                      <span>{tool.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="mb-2" />
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <Separator className="my-2" />

        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Security Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@cybersec.kit</p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
