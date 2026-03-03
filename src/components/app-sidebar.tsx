import * as React from "react"

import {
  Sidebar,
  SidebarContent,
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
  Home
} from "lucide-react";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        },
      ],
    },
    {
      title: "Scanners",
      url: "#",
      items: [
        {
          title: "Git Repository Scanner",
          url: "/tools/git_scanner",
        },
        {
          title: "Website Scanner",
          url: "/tools/website_scanner",
        },
        {
          title: "Network Scanner",
          url: "/tools/network_scanner",
        },
      ],
    },
    {
      title: "Miscellaneous",
      url: "#",
      items: [
        {
          title: "Image Metadata Extractor",
          url: "/tools/image_meta",
        },
        {
          title: "Phishing Detection",
          url: "/tools/phishing_lookup",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 pt-5 px-2">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">Cybersec Kit</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Security Toolkit</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
