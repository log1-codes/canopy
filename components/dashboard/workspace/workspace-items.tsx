"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Folder, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { Workspace } from "./workspace-grid-client"
import { formatRelativeTime } from "@/app/lib/date-utils"
import { WorkspaceRenameDialog } from "./workspace-rename-dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"

interface WorkspaceCardProps {
  workspace: Workspace
  onRename?: (id: string, newName: string) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const displayTime = formatRelativeTime(workspace.updated)
  const href = `/dashboard/workspace/${workspace.id}/pages`

  const { showToast } = useToast()
  const router = useRouter()

  const handleRename = async (id: string, newName: string) => {
    setIsRenaming(true)
    try {
      const res = await fetch(`/api/workspaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || "Failed to rename workspace", "error", "top-right")
        return
      }

      showToast("Workspace renamed successfully", "success", "top-right")
      router.refresh?.()
    } catch (error) {
      console.error(error)
      showToast("Something went wrong while renaming", "error", "top-right")
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || "Failed to delete workspace", "error", "top-right")
        return
      }

      showToast("Workspace deleted successfully", "success", "top-right")
      router.refresh?.()
    } catch (error) {
      console.error(error)
      showToast("Something went wrong while deleting", "error", "top-right")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Link href={href}>
        <Card
          className="
            relative overflow-hidden
            bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900
            border border-neutral-700/50
            hover:border-indigo-500/50
            hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]
            transition-all duration-500 ease-out
            p-6 group cursor-pointer rounded-xl
            hover:scale-[1.02]
          "
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          </div>

          <div className="relative flex items-start justify-between mb-4">
            <div
              className="
                p-3
                bg-gradient-to-br from-neutral-700 to-neutral-750
                group-hover:from-indigo-600/40 group-hover:to-indigo-500/20
                rounded-lg transition-all duration-500 ease-out
                group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20
              "
            >
              <Folder className="w-6 h-6 text-neutral-300 group-hover:text-indigo-300 transition-colors duration-500" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    p-2 rounded-full
                    opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
                    hover:bg-neutral-700/80 active:scale-95
                    cursor-pointer
                    hover:shadow-lg hover:shadow-indigo-500/20
                  "
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors duration-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="
                  w-40 bg-neutral-900 border border-neutral-800 text-white
                  animate-in fade-in-0 zoom-in-95 duration-500
                  shadow-lg shadow-neutral-900/50
                "
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isRenaming) setIsRenameDialogOpen(true)
                  }}
                  className="
                    cursor-pointer transition-all duration-300
                    hover:bg-indigo-600/30 hover:text-indigo-200
                    data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                  "
                  disabled={isRenaming}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => !isDeleting && handleDelete(workspace.id)}
                  className="
                    cursor-pointer transition-all duration-300
                    text-red-400 hover:bg-red-600/30 hover:text-red-300
                    data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                  "
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors duration-500 truncate">
            {workspace.title}
          </h3>
          <p className="text-neutral-400 text-sm mb-4 line-clamp-2 min-h-[40px] transition-colors duration-500 group-hover:text-neutral-300">
            {workspace.description}
          </p>

          <div className="flex items-center justify-between text-xs text-neutral-500 transition-colors duration-500 group-hover:text-neutral-400">
            <span>{workspace.pages} Pages</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{displayTime}</span>
            </div>
          </div>
        </Card>
      </Link>

      <WorkspaceRenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentName={workspace.title}
        onRename={(newName) => handleRename(workspace.id, newName)}
      />
    </>
  )
}

interface WorkspaceListItemProps {
  workspace: Workspace
  onRename?: (id: string, newName: string) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
}

export function WorkspaceListItem({ workspace, onRename, onDelete }: WorkspaceListItemProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const displayTime = formatRelativeTime(workspace.updated)
  const href = `/dashboard/workspace/${workspace.id}/pages`

  const { showToast } = useToast()
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Delete workspace "${workspace.title}"?`)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, { method: "DELETE" })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || "Failed to delete workspace", "error", "top-right")
        return
      }

      showToast("Workspace deleted successfully", "success", "top-right")
      router.refresh?.()
    } catch (error) {
      console.error(error)
      showToast("Something went wrong while deleting", "error", "top-right")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRename = async (newName: string) => {
    setIsRenaming(true)
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || "Failed to rename workspace", "error", "top-right")
        return
      }

      showToast("Workspace renamed successfully", "success", "top-right")
      router.refresh?.()
    } catch (error) {
      console.error(error)
      showToast("Something went wrong while renaming", "error", "top-right")
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <>
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900
          border border-neutral-700/50
          hover:border-indigo-500/50
          rounded-lg
          p-4 flex items-center justify-between
          group
          hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]
          transition-all duration-500 ease-out
          cursor-pointer
          hover:scale-[1.01]
          hover:translate-x-1
        "
        onClick={() => (window.location.href = href)}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
        </div>

        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          <div
            className="
              p-2
              bg-gradient-to-br from-neutral-700 to-neutral-750
              group-hover:from-indigo-600/40 group-hover:to-indigo-500/20
              rounded-lg transition-all duration-500 ease-out
              group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20
              flex-shrink-0
            "
          >
            <Folder className="w-5 h-5 text-neutral-300 group-hover:text-indigo-300 transition-colors duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors duration-500 truncate">
              {workspace.title}
            </h3>
            <p className="text-neutral-400 text-sm truncate transition-colors duration-500 group-hover:text-neutral-300">
              {workspace.description}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 ml-4 text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500">
          <span className="text-sm whitespace-nowrap">{workspace.pages} Pages</span>
          <span className="text-sm whitespace-nowrap">{displayTime}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                relative p-2 rounded-full
                opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
                hover:bg-neutral-700/80 active:scale-95
                cursor-pointer
                hover:shadow-lg hover:shadow-indigo-500/20
                ml-2 flex-shrink-0
              "
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors duration-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-40 bg-neutral-900 border border-neutral-800 text-white
              animate-in fade-in-0 zoom-in-95 duration-500
              shadow-lg shadow-neutral-900/50
            "
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isRenaming) setIsRenameDialogOpen(true)
              }}
              className="
                cursor-pointer transition-all duration-300
                hover:bg-indigo-600/30 hover:text-indigo-200
                data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
              "
              disabled={isRenaming}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="
                cursor-pointer transition-all duration-300
                text-red-400 hover:bg-red-600/30 hover:text-red-300
                data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
              "
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <WorkspaceRenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentName={workspace.title}
        onRename={handleRename}
      />
    </>
  )
}
