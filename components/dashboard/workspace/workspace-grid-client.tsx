"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useWorkspaceStore } from "@/app/stores/workspaceStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { WorkspaceCard, WorkspaceListItem } from "./workspace-items"
import { NoWorkSpace } from "./NoWorkSpace"

export interface Workspace {
  id: string
  title: string
  description: string
  pages: number
  updated: string
}

type ViewType = "grid" | "list"
type SortType = "edited" | "created" | "name"

interface WorkspaceClientProps {
  workspaces: Workspace[]
}

export default function WorkspaceClient({ workspaces }: WorkspaceClientProps) {
  const [view, setView] = useState<ViewType>("grid")
  const [sort, setSort] = useState<SortType>("edited")
  const { query } = useWorkspaceStore()

  useEffect(() => {
    const savedView = localStorage.getItem("workspace_view") as ViewType | null
    const savedSort = localStorage.getItem("workspace_sort") as SortType | null

    if (savedView) setView(savedView)
    if (savedSort) setSort(savedSort)
  }, [])

  useEffect(() => {
    localStorage.setItem("workspace_view", view)
  }, [view])

  useEffect(() => {
    localStorage.setItem("workspace_sort", sort)
  }, [sort])

  const sortedWorkspaces = useMemo(() => {
    const sorted = [...workspaces]
    if (sort === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === "edited") {
      sorted.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    } else if (sort === "created") {
      sorted.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime())
    }
    return sorted
  }, [workspaces, sort])

  const filteredWorkspaces = useMemo(() => {
    if (!query.trim()) return sortedWorkspaces
    return sortedWorkspaces.filter((w) => w.title.toLowerCase().includes(query.toLowerCase()))
  }, [sortedWorkspaces, query])

  const getSortLabel = (value: SortType) => {
    switch (value) {
      case "edited":
        return "Last Edited"
      case "created":
        return "Created Date"
      case "name":
        return "Name"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
  }

  const controlsVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
  }

  return (
    <div>
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 text-sm">Sort by:</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="
                    relative flex items-center gap-2 
                    bg-gradient-to-br from-neutral-800/80 to-neutral-900/80
                    backdrop-blur-lg
                    border border-white/[0.05]
                    text-sm text-neutral-100
                    rounded-lg px-3 py-2 
                    cursor-pointer
                    transition-all duration-500 ease-out
                    hover:border-indigo-500/50 
                    hover:bg-gradient-to-br hover:from-neutral-700/80 hover:to-neutral-800/80
                    hover:text-indigo-300
                    hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]
                    active:scale-95
                  "
                >
                  {getSortLabel(sort)}
                  <motion.div
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-neutral-400 group-hover:text-indigo-400"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="
                w-44 
                bg-neutral-900/80 
                backdrop-blur-lg
                border border-white/[0.05]
                rounded-lg 
                shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                p-1
                animate-in fade-in-0 zoom-in-95 duration-500
              "
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {(["edited", "created", "name"] as SortType[]).map((option) => (
                  <motion.div key={option} whileHover={{ x: 4 }} transition={{ duration: 0.5 }}>
                    <DropdownMenuItem
                      onClick={() => setSort(option)}
                      className={`
                        flex items-center justify-between text-sm rounded-md px-3 py-2 
                        cursor-pointer 
                        transition-all duration-500 ease-out
                        ${sort === option
                          ? "bg-indigo-600/60 text-indigo-100 shadow-lg shadow-indigo-500/20"
                          : "text-neutral-300 hover:bg-neutral-800/60 hover:text-indigo-300 hover:shadow-md hover:shadow-indigo-500/10"
                        }
                      `}
                    >
                      {getSortLabel(option)}
                      <AnimatePresence mode="wait">
                        {sort === option && (
                          <motion.span
                            key="active-label"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="text-xs text-indigo-200 font-medium"
                          >
                            Active
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div
          className="
            flex gap-2 
            bg-neutral-900/50 
            backdrop-blur-lg
            p-1 rounded-lg 
            border border-white/[0.05]
            transition-all duration-500
            hover:border-white/[0.1]
            hover:shadow-[0_8px_32px_rgba(99,102,241,0.1)]
          "
          whileHover={{ boxShadow: "0 8px 32px rgba(99, 102, 241, 0.15)" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Button
              size="sm"
              onClick={() => setView("grid")}
              className={`
                px-3 h-8 rounded-md 
                transition-all duration-500 ease-out
                cursor-pointer
                ${view === "grid"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_16px_rgba(99,102,241,0.3)]"
                  : "bg-transparent text-neutral-400 hover:bg-neutral-800/60 hover:text-indigo-300 hover:shadow-md hover:shadow-indigo-500/10"
                }
              `}
            >
              ⊞ Grid
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Button
              size="sm"
              onClick={() => setView("list")}
              className={`
                px-3 h-8 rounded-md 
                transition-all duration-500 ease-out
                cursor-pointer
                ${view === "list"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_16px_rgba(99,102,241,0.3)]"
                  : "bg-transparent text-neutral-400 hover:bg-neutral-800/60 hover:text-indigo-300 hover:shadow-md hover:shadow-indigo-500/10"
                }
              `}
            >
              ≡ List
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredWorkspaces.length > 0 ? (
          view === "grid" ? (
            <motion.div
              key="grid-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredWorkspaces.map((workspace) => (
                <motion.div key={workspace.id} variants={itemVariants} layout>
                  <WorkspaceCard workspace={workspace} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {filteredWorkspaces.map((workspace) => (
                <motion.div key={workspace.id} variants={itemVariants} layout>
                  <WorkspaceListItem workspace={workspace} />
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <NoWorkSpace query={query} />
        )}
      </AnimatePresence>
    </div>
  )
}
