"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserRole } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { PlusCircle, ListTodo } from "lucide-react"
import NewPageModal from "../page/NewPageModal"

interface RootPage {
  id: string
  title: string
  updatedAt: string | Date
}

interface PageListProps {
  workspaceId: string
  rootPages: RootPage[]
  userRole: UserRole
  workspaceName: string
}

export function PageList({ workspaceId, rootPages, userRole, workspaceName }: PageListProps) {
  const canCreatePages = userRole === UserRole.OWNER
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handlePageClick = (pageId: string) => {
    router.push(`/dashboard/workspace/${workspaceId}/page/${pageId}`)
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-neutral-700/30">
        <div>
          <h2 className="text-3xl font-semibold text-white mb-1">Root Pages</h2>
          <p className="text-sm text-neutral-400">
            {rootPages.length} {rootPages.length === 1 ? "page" : "pages"} in this workspace
          </p>
        </div>

        {canCreatePages && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="
              bg-gradient-to-r from-indigo-600 to-indigo-600
              hover:from-indigo-500 hover:to-indigo-600
              text-white font-semibold
              shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50
              transition-all duration-500 ease-out
              active:scale-95
              border border-indigo-500/30 hover:border-indigo-400/50
              backdrop-blur-sm
              cursor-pointer
              hover:scale-[1.02]
              h-10 rounded-lg px-6
            "
          >
            <PlusCircle className="mr-2 h-5 w-5 transition-transform duration-500" />
            New Page
          </Button>
        )}
      </div>

      {/* Page List Section */}
      {rootPages.length > 0 ? (
        <div className="space-y-3">
          {rootPages.map((page, index) => (
            <div
              key={page.id}
              onClick={() => handlePageClick(page.id)}
              className="
                flex cursor-pointer items-center justify-between p-4
                relative overflow-hidden
                bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900
                border border-neutral-700/50
                hover:border-indigo-500/50
                rounded-xl
                transition-all duration-500 ease-out
                group
                hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]
                hover:scale-[1.01]
                hover:translate-x-1
                active:scale-95
              "
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
              </div>

              <div className="relative flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="
                    p-2.5
                    bg-gradient-to-br from-neutral-700 to-neutral-750
                    group-hover:from-indigo-600/40 group-hover:to-indigo-500/20
                    rounded-lg transition-all duration-500 ease-out
                    group-hover:scale-110
                    group-hover:shadow-lg group-hover:shadow-indigo-500/20
                    flex-shrink-0
                  "
                >
                  <ListTodo className="h-5 w-5 text-neutral-300 group-hover:text-indigo-300 transition-colors duration-500" />
                </div>
                <span className="font-medium text-white group-hover:text-indigo-200 transition-colors duration-500 truncate">
                  {page.title}
                </span>
              </div>

              <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-500 whitespace-nowrap ml-4 hidden sm:block">
                {new Date(page.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
          flex flex-col items-center justify-center h-[50vh] text-center p-6
          relative overflow-hidden
          border border-neutral-700/50
          rounded-xl
          bg-gradient-to-br from-neutral-800/50 via-neutral-850/50 to-neutral-900/50
          backdrop-blur-sm
          shadow-[0_8px_32px_rgba(99,102,241,0.1)]
          group
        "
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          </div>

          <div className="relative">
            <div
              className="
              p-4
              bg-gradient-to-br from-neutral-700/50 to-neutral-800/50
              rounded-full
              mb-4
              group-hover:shadow-lg group-hover:shadow-indigo-500/20
              transition-all duration-500
            "
            >
              <ListTodo className="h-12 w-12 text-neutral-400 group-hover:text-indigo-400 transition-colors duration-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-indigo-200 transition-colors duration-500">
              Welcome to &ldquo;{workspaceName}&rdquo;
            </h2>
            <p className="text-neutral-400 group-hover:text-neutral-300 mb-8 max-w-md transition-colors duration-500">
              This workspace doesn&apos;t have any pages yet. Start by creating your first page to begin organizing and
              collaborating.
            </p>

            {canCreatePages ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="
                  bg-gradient-to-r from-indigo-600 to-indigo-600
                  hover:from-indigo-500 hover:to-indigo-600
                  text-white font-semibold
                  shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50
                  transition-all duration-500 ease-out
                  active:scale-95
                  border border-indigo-500/30 hover:border-indigo-400/50
                  backdrop-blur-sm
                  cursor-pointer
                  hover:scale-[1.02]
                  h-11 rounded-lg px-6
                "
              >
                <PlusCircle className="mr-2 h-5 w-5 transition-transform duration-500" />
                Create Your First Page
              </Button>
            ) : (
              <p className="text-red-400 text-sm font-medium">
                You have View-Only access. Contact the Owner to create new pages.
              </p>
            )}
          </div>
        </div>
      )}

      <NewPageModal open={isModalOpen} onOpenChange={setIsModalOpen} workspaceId={workspaceId} parentId={null} />
    </div>
  )
}
