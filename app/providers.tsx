"use client"

import { ToastProvider } from "@/components/ui/toast-provider"
import { Analytics } from "@vercel/analytics/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Analytics />
    </ToastProvider>
  )
}