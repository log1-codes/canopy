"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, Home, FileText, Heart, Trash2, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import NewWorkspaceModal from "../../NewWorkspaceModal"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  user: { name: string; email: string; avatarInitials: string } | null
  onLogout: () => void
}

export default function Sidebar({ isOpen, onToggle, user, onLogout }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userName = user?.name

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
          transition-all duration-500 ease-out
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between h-16 px-4
            border-b border-white/[0.04]
            transition-all duration-500 ease-out
          "
        >
          {isOpen && <h1 className="text-xl font-bold text-white transition-opacity duration-500">Canopy</h1>}
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
              active:scale-95
            "
          >
            <Menu className="w-6 h-6 text-neutral-400 hover:text-indigo-400 transition-colors duration-500" />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-3 py-3 space-y-2">
          <NavLink icon={Home} label="Dashboard" active isOpen={isOpen} />
          <NavLink icon={FileText} label="All Pages" isOpen={isOpen} />
          <NavLink icon={Heart} label="Favorites" isOpen={isOpen} />
          <NavLink icon={Trash2} label="Trash" isOpen={isOpen} />
        </nav>

        {/* NEW WORKSPACE BUTTON */}
        <div className="p-3 border-t border-white/[0.04]">
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
              ${isOpen ? "justify-start gap-3" : "justify-center"}
            `}
          >
            <Plus className="w-5 h-5 transition-transform duration-500" />
            {isOpen && <span className="transition-opacity duration-500">New Workspace</span>}
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
              ${isOpen ? "p-0 hover:ring-2 hover:ring-indigo-500/30" : "p-0.5 hover:bg-neutral-800/50 backdrop-blur-sm"}
            `}
          >
            <Avatar className={isOpen ? "h-12 w-12" : "h-8 w-8"}>
              <AvatarFallback
                className="
                  text-white font-medium text-lg
                  bg-gradient-to-br from-indigo-600 to-indigo-800
                  transition-all duration-500 ease-out
                "
              >
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
          </button>

          {isOpen && (
            <div className="flex-1 min-w-0 text-left transition-opacity duration-500">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className={`
                absolute z-30 w-48 rounded-lg
                border border-neutral-700/50
                bg-neutral-900/95 backdrop-blur-lg
                py-1
                shadow-lg shadow-neutral-900/70
                animate-in fade-in-0 zoom-in-95 duration-500
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
                "
              >
                <User className="w-4 h-4 text-indigo-400" />
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
                "
              >
                <LogOut className="w-4 h-4" />
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
        transition-all duration-500 ease-out
        border cursor-pointer
        active:scale-95
        group
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
      <Icon
        className={`
          w-5 h-5 flex-shrink-0 transition-all duration-500 ease-out
          ${active ? "text-white" : "text-neutral-400 group-hover:text-indigo-300 group-hover:scale-110"}
        `}
      />
      {isOpen && <span className="text-sm font-medium transition-colors duration-500">{label}</span>}
    </button>
  )
}
