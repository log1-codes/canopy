"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Plus, Home, FileText, Heart, Trash2, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import NewWorkspaceModal from "../../NewWorkspaceModal"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"

interface PageItem {
  id: string
  title: string
  parentId: string | null
  icon: string | null
}

interface PageTreeNode extends PageItem {
  children: PageTreeNode[]
  isExpanded: boolean
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  user: { name: string; email: string; avatarInitials: string } | null
  onLogout: () => void
  workspaceId: string
}

const buildPageTree = (pages: PageItem[], parentId: string | null = null): PageTreeNode[] => {
  return pages
    .filter((page) => page.parentId === parentId)
    .map((page) => ({
      ...page,
      children: buildPageTree(pages, page.id),
      isExpanded: true,
    }))
}

const PageTree = ({
  pages,
  workspaceId,
  isOpen,
  depth = 0,
}: { pages: PageTreeNode[]; workspaceId: string; isOpen: boolean; depth?: number }) => {
  const pathname = usePathname()
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleExpand = (pageId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [pageId]: !prev[pageId] }))
  }

  return (
    <ul className="space-y-0.5">
      {pages.map((page, index) => {
        const isActive = pathname.includes(`/page/${page.id}`)
        const isCurrentlyExpanded = expandedNodes[page.id] !== undefined ? expandedNodes[page.id] : page.isExpanded
        const hasChildren = page.children.length > 0

        return (
          <li key={page.id} className="overflow-hidden">
            <div className={`flex items-start ${isOpen ? "justify-start" : "justify-center"} w-full group`}>
              {/* Expansion Button with smooth rotation */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleExpand(page.id)
                }}
                className={`p-1.5 flex-shrink-0 transition-all duration-300 ease-out
                  ${!isOpen ? "hidden" : "text-neutral-500 hover:text-indigo-400"}
                  ${hasChildren ? "" : "invisible"}
                  ${isCurrentlyExpanded ? "rotate-90" : "rotate-0"}
                  hover:bg-neutral-800/50 rounded-md
                  active:scale-90
                `}
                style={{ marginLeft: "-15px" }}
                title={hasChildren ? (isCurrentlyExpanded ? "Collapse" : "Expand") : ""}
              >
                <ChevronRight className="h-4 w-4 transition-all duration-300" />
              </button>

              {/* Page Link with enhanced hover states */}
              <Link
                href={`/dashboard/workspace/${workspaceId}/page/${page.id}`}
                className={`
                  flex items-center gap-2 py-2 rounded-lg transition-all duration-300 ease-out text-sm w-full
                  ${isOpen ? "pl-2 pr-3" : "justify-center w-8 h-8 p-0"}
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/90 to-indigo-600/70 text-white font-medium shadow-lg shadow-indigo-600/20 border border-indigo-500/40"
                      : "text-neutral-300 hover:text-white border border-transparent hover:bg-neutral-800/60 hover:border-indigo-500/30"
                  }
                  hover:shadow-md hover:shadow-indigo-500/10
                  active:scale-95
                  relative overflow-hidden
                `}
                title={page.title}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                )}

                {isOpen && (
                  <span className="flex items-center gap-2 relative z-10">
                    <div
                      className={`flex-shrink-0 transition-all duration-300 ${isActive ? "scale-110" : "scale-100 group-hover:scale-110"}`}
                    >
                      {page.icon || <FileText className="h-4 w-4" />}
                    </div>
                    <span className="truncate">{page.title}</span>
                  </span>
                )}
                {!isOpen && (
                  <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <FileText className="size-5" />
                  </div>
                )}
              </Link>
            </div>

            {hasChildren && isCurrentlyExpanded && isOpen && (
              <div className="pl-4 pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                <PageTree pages={page.children} workspaceId={workspaceId} isOpen={isOpen} depth={depth + 1} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function Sidebar({ isOpen, onToggle, user, onLogout, workspaceId }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PageTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const userName = user?.name
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchPages = useCallback(async () => {
    if (!workspaceId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/pages-hierarchy`)
      if (response.ok) {
        const flatPages: PageItem[] = await response.json()
        const pageTree = buildPageTree(flatPages)
        setPages(pageTree)
      } else {
        console.error("Failed to fetch page hierarchy.")
        setPages([])
      }
    } catch (e) {
      console.error("Network error fetching pages:", e)
      setPages([])
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId])

  useEffect(() => {
    fetchPages()
  }, [fetchPages, pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return null

  return (
    <>
      <div
        className={`
          hidden md:flex flex-col h-screen
          bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950
          border-r border-white/[0.04]
          transition-all duration-700 ease-out
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between h-16 px-4
            border-b border-white/[0.04]
            transition-all duration-700 ease-out
          "
        >
          {isOpen && (
            <h1 className="text-xl font-bold text-white transition-all duration-500 opacity-100 animate-in fade-in-0 slide-in-from-left-2">
              Canopy
            </h1>
          )}
          <button
            onClick={onToggle}
            className="
              p-1.5 rounded-lg
              bg-neutral-800/30 hover:bg-neutral-700/50
              backdrop-blur-md
              border border-white/[0.05] hover:border-indigo-500/30
              transition-all duration-500 ease-out
              hover:shadow-lg hover:shadow-indigo-500/10
              cursor-pointer
              active:scale-90
              group
            "
          >
            <Menu className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400 transition-all duration-500 group-hover:rotate-90" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Hide scrollbar for webkit browsers */}
          <style>{`
            [data-scroll-container]::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Top Level Nav */}
          <nav className="space-y-2 pb-4 border-b border-white/[0.04]">
            <NavLink icon={Home} label="Dashboard" isOpen={isOpen} />
            <NavLink icon={Heart} label="Favorites" isOpen={isOpen} />
            <NavLink icon={Trash2} label="Trash" isOpen={isOpen} />
          </nav>

          {/* WORKSPACE PAGES HIERARCHY */}
          <div className="space-y-2">
            {isOpen && (
              <p className="text-xs font-semibold text-neutral-500 uppercase px-3 pt-1 transition-opacity duration-500">
                Workspace Pages
              </p>
            )}

            {isLoading ? (
              <div className={`${isOpen ? "px-3" : "justify-center"} flex items-center text-neutral-500 text-sm mt-2`}>
                <Loader2 className={`h-4 w-4 animate-spin ${isOpen ? "mr-2" : ""}`} />
                {isOpen && <span>Loading...</span>}
              </div>
            ) : (
              <PageTree pages={pages} workspaceId={workspaceId} isOpen={isOpen} />
            )}
          </div>
        </div>

        {/* NEW WORKSPACE BUTTON */}
        <div className="p-3 border-t border-white/[0.04] transition-all duration-500">
          <Button
            onClick={() => setIsModalOpen(true)}
            className={`
              w-full bg-gradient-to-r from-indigo-600 to-indigo-600
              hover:from-indigo-500 hover:to-indigo-600
              text-white font-semibold rounded-xl
              transition-all duration-500 ease-out
              h-10
              hover:shadow-lg hover:shadow-indigo-600/30
              active:scale-95
              border border-indigo-500/30 hover:border-indigo-400/50
              backdrop-blur-sm
              cursor-pointer
              group
              ${isOpen ? "justify-start gap-3" : "justify-center"}
            `}
          >
            <Plus className="w-5 h-5 transition-all duration-500 group-hover:rotate-90 group-hover:scale-110" />
            {isOpen && <span className="transition-all duration-500">New Workspace</span>}
          </Button>
        </div>

        {/* USER PROFILE DROPDOWN */}
        <div
          ref={dropdownRef}
          className={`
            p-3 border-t border-white/[0.04]
            flex relative transition-all duration-500 ease-out
            ${isOpen ? "gap-3 items-center" : "flex-col items-center gap-2"}
          `}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`
              rounded-full transition-all duration-500 ease-out
              cursor-pointer
              hover:shadow-lg hover:shadow-indigo-500/20
              active:scale-95
              group
              ${isOpen ? "p-0 hover:ring-2 hover:ring-indigo-500/30" : "p-0.5 hover:bg-neutral-800/50 backdrop-blur-sm"}
            `}
          >
            <Avatar className={`${isOpen ? "h-12 w-12" : "h-8 w-8"} transition-all duration-500 group-hover:scale-105`}>
              <AvatarFallback
                className="
                  text-white font-medium
                  bg-gradient-to-br from-indigo-600 to-indigo-800
                  transition-all duration-500 ease-out
                  group-hover:shadow-lg group-hover:shadow-indigo-600/30
                "
              >
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
          </button>

          {isOpen && (
            <div className="flex-1 min-w-0 text-left transition-all duration-500 animate-in fade-in-0 slide-in-from-left-2">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          )}

          {/* Dropdown Menu with enhanced animations */}
          {dropdownOpen && (
            <div
              className={`
                absolute z-30 w-48 rounded-lg
                border border-neutral-700/50
                bg-neutral-900/95 backdrop-blur-lg
                py-1
                shadow-lg shadow-neutral-900/70
                animate-in fade-in-0 zoom-in-95 duration-300
                transition-all ease-out
                ${isOpen ? "bottom-full mb-2 left-0" : "bottom-full mb-2 left-1/2 transform -translate-x-1/2"}
              `}
            >
              <div className="px-3 py-2 border-b border-neutral-700/50">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => setDropdownOpen(false)}
                className="
                  flex w-full items-center gap-2 px-3 py-2 text-sm
                  text-neutral-300
                  hover:bg-indigo-600/20 hover:text-indigo-200
                  transition-all duration-300 ease-out
                  cursor-pointer
                  active:scale-95
                  group
                "
              >
                <User className="w-4 h-4 text-indigo-400 transition-all duration-300 group-hover:scale-110" />
                Profile
              </button>

              <button
                onClick={() => {
                  onLogout()
                  setDropdownOpen(false)
                }}
                className="
                  flex w-full items-center gap-2 px-3 py-2 text-sm
                  text-red-400
                  hover:bg-red-600/20 hover:text-red-300
                  transition-all duration-300 ease-out
                  cursor-pointer
                  active:scale-95
                  group
                "
              >
                <LogOut className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <NewWorkspaceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

interface NavLinkProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  isOpen: boolean
}

function NavLink({ icon: Icon, label, active = false, isOpen }: NavLinkProps) {
  return (
    <button
      className={`
        w-full flex items-center py-2.5 rounded-lg
        transition-all duration-300 ease-out
        border cursor-pointer
        active:scale-95
        group
        relative overflow-hidden
        ${
          active
            ? `
              bg-gradient-to-r from-indigo-600/90 to-indigo-600/70
              border-indigo-500/50
              text-white
              shadow-lg shadow-indigo-600/20
              hover:shadow-indigo-600/30
            `
            : `
              text-neutral-400
              bg-neutral-900/40 hover:bg-neutral-800/60
              border-neutral-700/30 hover:border-indigo-500/40
              hover:text-indigo-300
              backdrop-blur-sm
            `
        }
        ${isOpen ? "px-3 gap-3 justify-start" : "justify-center"}
      `}
    >
      {!active && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/0 transition-all duration-300"></div>
      )}

      <Icon
        className={`
          w-5 h-5 flex-shrink-0 transition-all duration-300 ease-out relative z-10
          ${active ? "text-white" : "text-neutral-400 group-hover:text-indigo-300 group-hover:scale-110"}
        `}
      />
      {isOpen && <span className="text-sm font-medium transition-all duration-300 relative z-10">{label}</span>}
    </button>
  )
}
