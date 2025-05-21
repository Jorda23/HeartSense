'use client'

import { ChevronUp } from 'lucide-react'
import Image from 'next/image'
import type { User } from 'next-auth'
import { useTheme } from 'next-themes'
import { Menu, MenuItem, ListItemText } from '@mui/material'
import { useState } from 'react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar'

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    handleClose()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleOpen}
          className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 flex items-center gap-2"
        >
          <Image
            src={`https://avatar.vercel.sh/${user.email}`}
            alt={user.email}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="truncate">{user?.email}</span>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MenuItem onClick={toggleTheme} data-testid="toggle-theme">
            <ListItemText>
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </ListItemText>
          </MenuItem>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
