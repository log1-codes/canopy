"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"

/**
 * Reusable hook for signing the user out with consistent toast feedback.
 */
export function useSignOut() {
    const router = useRouter()
    const { showToast } = useToast()

    const handleSignOut = async () => {
        try {
            showToast("Signing out...", "info", "top-right")
            await signOut({ redirect: false })
            showToast("Signed out successfully!", "success", "top-right")
            router.push("/login")
            router.refresh()
        } catch {
            showToast("Error signing out. Please try again.", "error", "top-right")
        }
    }

    return handleSignOut
}
