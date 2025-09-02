"use client"

import * as React from "react"
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Ana Sayfa",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Genel Bakış",
          url: "/dashboard",
        },
        {
          title: "İstatistikler",
          url: "/dashboard/istatistikler",
        },
      ],
    },
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: BookOpen,
      items: [
        {
          title: "Tüm Yazılar",
          url: "/dashboard/blog",
        },
        {
          title: "Yeni Yazı",
          url: "/dashboard/blog/yeni",
        },
        {
          title: "Kategoriler",
          url: "/dashboard/blog/kategoriler",
        },
        {
          title: "Yorumlar",
          url: "/dashboard/blog/yorumlar",
        },
      ],
    },
    {
      title: "İlanlar",
      url: "/dashboard/listings",
      icon: Store,
      items: [
        {
          title: "Tüm İlanlar",
          url: "/dashboard/listings",
        },
        {
          title: "Yeni İlan",
          url: "/dashboard/listings/form",
        },
        {
          title: "Kategoriler",
          url: "/dashboard/listings",
        },
      ],
    },
    {
      title: "Sayfalar",
      url: "/dashboard/sayfalar",
      icon: FileText,
      items: [
        {
          title: "Tüm Sayfalar",
          url: "/dashboard/sayfalar",
        },
        {
          title: "Yeni Sayfa",
          url: "/dashboard/sayfalar/yeni",
        },
        {
          title: "Menüler",
          url: "/dashboard/sayfalar/menuler",
        },
        {
          title: "Ayarlar",
          url: "/dashboard/sayfalar/ayarlar",
        },
      ],
    },
    {
      title: "Ayarlar",
      url: "/dashboard/ayarlar",
      icon: Settings2,
      items: [
        {
          title: "Genel",
          url: "/dashboard/ayarlar/genel",
        },
        {
          title: "Kullanıcılar",
          url: "/dashboard/ayarlar/kullanicilar",
        },
        {
          title: "Bildirimler",
          url: "/dashboard/ayarlar/bildirimler",
        },
        {
          title: "Güvenlik",
          url: "/dashboard/ayarlar/guvenlik",
        },
      ],
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
      name: "Bandbul",
      url: "/",
      icon: SquareTerminal,
    },
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
