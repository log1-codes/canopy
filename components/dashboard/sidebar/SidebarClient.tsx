"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Home, Heart, Trash2, Layout } from "lucide-react"
import NewWorkspaceModal from "../../NewWorkspaceModal"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"

import SidebarHeader from "./SidebarHeader"
import NavLink from "./NavLink"
import PageTree, { PageItem, PageTreeNode } from "./PageTree"
import NewWorkspaceButton from "./NewWorkspaceButton"
import UserProfileDropdown from "./UserProfileDropdown"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  user: { name: string; email: string; avatarInitials: string } | null
  onLogout: () => void
  workspaceId?: string
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

export default function Sidebar({ isOpen, onToggle, user, onLogout, workspaceId }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pages, setPages] = useState<PageTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
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

  if (!user) return null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 z-50 h-screen
          flex flex-col
          bg-linear-to-br from-neutral-900 via-neutral-900 to-neutral-950
          border-r border-white/4
          transition-transform duration-500 ease-out
          md:static md:translate-x-0 md:flex
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-20 md:translate-x-0"}
          ${!isOpen && "md:w-20"}
        `}
      >
        <SidebarHeader isOpen={isOpen} onToggle={onToggle} />

        <div
          ref={scrollContainerRef}
          className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            [data-scroll-container]::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <nav className="space-y-2 pb-4 border-b border-white/4">
            <NavLink icon={Home} href="/dashboard" label="Dashboard" isOpen={isOpen} />
            <NavLink icon={Layout} href="/workspaces" label="Workspaces" isOpen={isOpen} />
            <NavLink icon={Heart} label="Favorites" isOpen={isOpen} />
            <NavLink icon={Trash2} label="Trash" isOpen={isOpen} />
          </nav>

          <div className="space-y-2">
            {isOpen && (
              <p className="text-xs font-semibold text-neutral-50 uppercase px-3 pt-1 transition-opacity duration-500">
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

        <NewWorkspaceButton isOpen={isOpen} onClick={() => setIsModalOpen(true)} />

        <UserProfileDropdown isOpen={isOpen} user={user} onLogout={onLogout} />
      </div>

      <NewWorkspaceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}