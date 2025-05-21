import Script from 'next/script'

import { AppSidebar } from '@/components/common/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'
import { ReactQueryClientProvider } from '@/components/common/ReactQueryClientProvider/ReactQueryClientProvider'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export const experimental_ppr = true

interface DecodedToken {
  nameid: string
  email: string
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error('No token found in cookies')
  }

  const decoded = jwtDecode<DecodedToken>(token)

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <ReactQueryClientProvider>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar
            user={{
              id: decoded.nameid,
              email: decoded.email,
            }}
          />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </ReactQueryClientProvider>
    </>
  )
}
