'use client'
import * as React from 'react'
import {
  IconCash,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconLogout,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Users',
      url: '/users',
      icon: IconUsers,
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: IconCash,
    },
    {
      title: 'Artists',
      url: '/artists',
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: 'Contact Support',
      url: 'https://www.thescenezone.com/contact',
      icon: IconSettings,
    },
    {
      title: 'Privary Policy',
      url: 'https://www.thescenezone.com/privacy',
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const formattedNavMain = data.navMain.map((item) => ({
    ...item,
    // Item is active if pathname matches exactly OR if pathname starts with item.url (e.g. /users/123)
    // We add a check to ensure "/" doesn't match everything if you had a root route.
    isActive:
      pathname === item.url ||
      (item.url !== '/dashboard' && pathname.startsWith(item.url)),
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image
                  src="/footerlogo.png"
                  alt="SceneZone"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={formattedNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Link href="/logout">
          <Button variant="outline" className="w-full">
            <IconLogout />
            Log out
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
