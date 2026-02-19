"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Folder, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { Workspace } from "./workspace-grid-client"
import { formatRelativeTime } from "@/app/lib/date-utils"
import { WorkspaceRenameDialog } from "./workspace-rename-dialog"
import { useRouter } from "next/navigation"
import { useWorkspaceActions } from "@/hooks/useWorkspaceActions"

interface WorkspaceCardProps {
  workspace: Workspace
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const displayTime = formatRelativeTime(workspace.updated)
  const href = `/dashboard/workspace/${workspace.id}/pages`
  const { handleRename, handleDelete, isRenaming, isDeleting } = useWorkspaceActions(workspace.id)

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
            transition-all duration-300 ease-out
            p-6 group cursor-pointer rounded-xl
            hover:scale-[1.02]
          "
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          </div>

          <div className="relative flex items-start justify-between mb-4">
            <div
              className="
                p-2.5
                bg-gradient-to-br from-neutral-700 to-neutral-750
                group-hover:from-indigo-600/40 group-hover:to-indigo-500/20
                rounded-lg transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20
              "
            >
              <Folder className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-neutral-500 hover:text-white p-1 transition-colors duration-200 rounded-md hover:bg-neutral-700/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={() => setIsRenameDialogOpen(true)}
                    className="text-neutral-200 focus:bg-neutral-700 focus:text-white"
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete()}
                    className="text-red-400 focus:bg-neutral-700 focus:text-red-300"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-100 transition-colors duration-300 truncate mb-1">
              {workspace.title}
            </h3>
            {workspace.description && (
              <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                {workspace.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-neutral-500 mt-auto">
              <span className="flex items-center gap-1">
                <Folder className="h-3 w-3" /> {workspace.pages} pages
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {displayTime}
              </span>
            </div>
          </div>
        </Card>
      </Link>
      <WorkspaceRenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentName={workspace.title}
        onRename={async (newName: string) => {
          await handleRename(newName)
          setIsRenameDialogOpen(false)
        }}
      />
    </>
  )
}


interface WorkspaceListItemProps {
  workspace: Workspace
}

export function WorkspaceListItem({ workspace }: WorkspaceListItemProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const displayTime = formatRelativeTime(workspace.updated)
  const href = `/dashboard/workspace/${workspace.id}/pages`
  const router = useRouter()
  const { handleRename, handleDelete, isRenaming, isDeleting } = useWorkspaceActions(workspace.id)

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
          transition-all duration-300 ease-out
          cursor-pointer
          hover:scale-[1.01]
          hover:translate-x-1
        "
        onClick={() => router.push(href)}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
        </div>

        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          <div
            className="
              p-2
              bg-gradient-to-br from-neutral-700 to-neutral-750
              group-hover:from-indigo-600/40 group-hover:to-indigo-500/20
              rounded-lg transition-all duration-300 ease-out
              group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20
              flex-shrink-0
            "
          >
            <Folder className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-100 transition-colors duration-300 truncate">
              {workspace.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
              <span>{workspace.pages} pages</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {displayTime}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-500 hover:text-white p-1 transition-colors duration-200 rounded-md hover:bg-neutral-700/50">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl"
            >
              <DropdownMenuItem
                onClick={() => setIsRenameDialogOpen(true)}
                className="text-neutral-200 focus:bg-neutral-700 focus:text-white"
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete()}
                className="text-red-400 focus:bg-neutral-700 focus:text-red-300"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <WorkspaceRenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentName={workspace.title}
        onRename={async (newName: string) => {
          await handleRename(newName)
          setIsRenameDialogOpen(false)
        }}
      />
    </>
  )
}
