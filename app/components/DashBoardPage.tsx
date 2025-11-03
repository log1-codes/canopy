"use client"
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-provider'

const DashboardPage = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      showToast("Signing out...", "info", "top-right")
      
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      })
      
      showToast("Signed out successfully!", "success", "top-right")
      
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 500)
      
    } catch (error) {
      console.error("Sign out error:", error)
      showToast("Failed to sign out. Please try again.", "error", "top-right")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Welcome back!
            </p>
          </div>
          
          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              loading
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <h2 className="text-xl font-semibold mb-2">Card 1</h2>
            <p className="text-neutral-400">Dashboard content here</p>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <h2 className="text-xl font-semibold mb-2">Card 2</h2>
            <p className="text-neutral-400">Dashboard content here</p>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
            <h2 className="text-xl font-semibold mb-2">Card 3</h2>
            <p className="text-neutral-400">Dashboard content here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage