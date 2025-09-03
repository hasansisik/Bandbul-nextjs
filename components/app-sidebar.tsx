"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hook"
import {
  BookOpen,
  FileText,
  Home,
  LifeBuoy,
  Map,
  Send,
  Settings2,
  SquareTerminal,
  Store,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.user)

  const data = {
    user: {
      name: user?.name || user?.username || "Kullanıcı",
      email: user?.email || "kullanici@example.com",
      avatar: user?.profile?.picture || "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Anasayfa",
        url: "/dashboard",
        icon: Home
      },
      {
        title: "Blog",
        url: "/dashboard/blog",
        icon: BookOpen
      },
      {
        title: "İlanlar",
        url: "/dashboard/listings",
        icon: Store
      },
      {
        title: "İletişim Formları",
        url: "/dashboard/forms",
        icon: Send,
      },
      {
        title: "Kullanıcılar",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Ayarlar",
        url: "/dashboard/ayarlar",
        icon: Settings2,
        
      },
    ],
    navSecondary: [
      {
        title: "Destek",
        url: "/dashboard/destek",
        icon: LifeBuoy,
      },
      {
        title: "Geri Bildirim",
        url: "/dashboard/geri-bildirim",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Blog Yönetimi",
        url: "/dashboard/blog",
        icon: BookOpen,
      },
      {
        name: "İlan Yönetimi",
        url: "/dashboard/listings",
        icon: Store,
      },
      {
        name: "Kullanıcı Yönetimi",
        url: "/dashboard/users",
        icon: Users,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SquareTerminal className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Bandbul</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
