"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"

/**
 * Reusable hook for workspace rename and delete operations.
 * Eliminates duplication between WorkspaceCard and WorkspaceListItem.
 */
export function useWorkspaceActions(workspaceId: string) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const { showToast } = useToast()
    const router = useRouter()

    const handleRename = async (newName: string) => {
        setIsRenaming(true)
        try {
            const res = await fetch(`/api/workspaces/${workspaceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data?.error || "Failed to rename workspace")
            }

            showToast("Workspace renamed successfully!", "success", "top-right")
            router.refresh()
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : "Failed to rename workspace",
                "error",
                "top-right"
            )
        } finally {
            setIsRenaming(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/workspaces/${workspaceId}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                throw new Error("Failed to delete workspace")
            }

            showToast("Workspace deleted successfully!", "success", "top-right")
            router.refresh()
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : "Failed to delete workspace",
                "error",
                "top-right"
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return { handleRename, handleDelete, isRenaming, isDeleting }
}
