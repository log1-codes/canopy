"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Save,
  Loader2,
  SaveAll,
  Edit3,
  Eye,
  Plus,
} from "lucide-react"
import { debounce } from "@/app/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import "../editor/tiptap-editor-styles.css"
import NewPageModal from "@/components/page/NewPageModal"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

interface PageData {
  id: string
  title: string
  content: any
  updatedAt: Date
}

interface EditorComponentProps {
  initialData: PageData
  isEditable: boolean
  workspaceId: string
}

const TiptapEditor = dynamic(
  () => import("./TiptapEditor").then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full p-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading editor...
      </div>
    ),
  }
)

export function EditorComponent({
  initialData,
  isEditable,
  workspaceId,
}: EditorComponentProps) {
  const [title, setTitle] = useState(initialData.title)
  const [content, setContent] = useState(initialData.content)
  const [status, setStatus] = useState<"saved" | "saving" | "error" | "unsaved">("saved")
  const [lastSaved, setLastSaved] = useState(initialData.updatedAt)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isHeaderFocused, setIsHeaderFocused] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  const router = useRouter()
  const effectiveEditable = isEditable && editMode

  const debouncedSave = useMemo(() => {
    const saveCore = async (dataToSave: { title?: string; content?: any }) => {
      if (status === "saving" || !effectiveEditable || Object.keys(dataToSave).length === 0)
        return

      setStatus("saving")

      try {
        const response = await fetch(`/api/pages/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        })

        if (response.ok) {
          const { updatedAt } = await response.json()
          setLastSaved(new Date(updatedAt))
          setStatus("saved")
          setUnsavedChanges(false)
        } else {
          setStatus("error")
          console.error("Save failed:", await response.json())
        }
      } catch (error) {
        setStatus("error")
        console.error("Network save error:", error)
      }
    }

    return debounce(saveCore, 1500)
  }, [initialData.id, effectiveEditable, status])

  const handleManualSave = useCallback(() => {
    if (!effectiveEditable || status === "saving" || !unsavedChanges) return
    debouncedSave.cancel()
    debouncedSave({ title, content })
  }, [effectiveEditable, status, unsavedChanges, title, content, debouncedSave])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    setUnsavedChanges(true)
    debouncedSave({ title: newTitle })
  }

  const handleContentChange = (newContent: any) => {
    setContent(newContent)
    setUnsavedChanges(true)
    debouncedSave({ content: newContent })
  }

  const handleToggleEditMode = () => {
    if (editMode && unsavedChanges) handleManualSave()
    setEditMode((prev) => !prev)
  }

  const handleSubpageCreated = (newPageId: string) => {
    setModalOpen(false)
    router.push(`/dashboard/workspace/${workspaceId}/page/${newPageId}`)
  }

  useEffect(() => {
    if (unsavedChanges) {
      const timeout = setTimeout(() => setStatus("unsaved"), 500)
      return () => clearTimeout(timeout)
    } else if (status === "unsaved") {
      setStatus("saved")
    }
  }, [unsavedChanges, status])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault()
        handleManualSave()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleManualSave])

  useEffect(() => {
    if (!unsavedChanges) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [unsavedChanges])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 text-foreground">
      {/* Header */}
      <header
        className={cn(
          "flex justify-between items-center h-16 sticky top-0 z-20",
          "border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm",
          isHeaderFocused &&
          "bg-neutral-950 border-neutral-700/50 shadow-lg shadow-neutral-950/20"
        )}
      >
        {/* Left side: title */}
        <div className="flex flex-grow items-center gap-4 px-6">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => setIsHeaderFocused(true)}
            onBlur={() => setIsHeaderFocused(false)}
            className={cn(
              "text-2xl font-bold tracking-tight bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-700",
              !effectiveEditable && "cursor-not-allowed text-neutral-600",
              effectiveEditable && "text-neutral-50"
            )}
            placeholder="Untitled Page"
            disabled={!effectiveEditable}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 px-6">
          {/* Status indicator */}
          {effectiveEditable && (
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md",
                status === "error" && "text-red-400",
                status === "saved" && "text-emerald-400",
                (status === "saving" || status === "unsaved") && "text-neutral-400"
              )}
            >
              {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "saved" && <CheckCircle className="h-4 w-4" />}
              {status === "error" && <AlertTriangle className="h-4 w-4" />}
              {status === "unsaved" && <Save className="h-4 w-4 animate-pulse" />}
              <span className="hidden sm:inline capitalize">{status}</span>
            </div>
          )}

          {/* Manual Save */}
          {effectiveEditable && unsavedChanges && (
            <Button
              onClick={handleManualSave}
              variant="ghost"
              size="sm"
              className="px-3 py-1.5 h-auto text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-md"
              disabled={status === "saving"}
              title="Save Page Manually (Ctrl+S)"
            >
              <SaveAll className={cn("h-4 w-4 mr-2", status === "saving" && "animate-spin")} />
              {status === "saving" ? "Saving" : "Save"}
            </Button>
          )}

          {/* Edit/View Mode Toggle */}
          {isEditable && (
            <Button
              onClick={handleToggleEditMode}
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2 text-sm border-neutral-700 transition-all cursor-pointer",
                editMode
                  ? "bg-amber-500/10 border-amber-600/50 text-amber-400 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 border-emerald-600/50 text-emerald-400 hover:bg-emerald-500/20"
              )}
            >
              {editMode ? (
                <>
                  <Eye className="h-4 w-4" /> View Mode
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" /> Edit Mode
                </>
              )}
            </Button>
          )}

          {/* ➕ Add Subpage */}
          {isEditable && (
            <Button
              onClick={() => setModalOpen(true)}
              variant="ghost"
              size="sm"
              className="text-indigo-400 hover:bg-indigo-600/10"
              title="Add Subpage"
            >
              <Plus className="h-4 w-4 mr-1" /> Subpage
            </Button>
          )}

          <span className="text-neutral-500 hidden sm:block text-xs font-medium min-w-[80px] text-right">
            {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-grow overflow-y-auto scroll-smooth">
        {/* Info banners */}
        {!editMode && (
          <div
            className={cn(
              "mx-auto max-w-4xl px-6 py-3 mt-6 rounded-lg text-sm font-medium",
              isEditable
                ? "bg-blue-500/10 border border-blue-700/30 text-blue-400"
                : "bg-neutral-800/50 border border-neutral-700/30 text-neutral-400"
            )}
          >
            {isEditable ? (
              <>
                You're viewing this page in <strong>read-only mode</strong>. Click{" "}
                <strong>"Edit Mode"</strong> above to make changes.
              </>
            ) : (
              <> You have <strong>view-only</strong> access to this page.</>
            )}
          </div>
        )}

        {editMode && (
          <div className="mx-auto max-w-4xl px-6 py-3 mt-6 bg-emerald-500/10 border border-emerald-700/30 rounded-lg text-emerald-400 text-sm font-medium">
            <strong>Edit mode active</strong> - Your changes will be saved automatically
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-8">
          <TiptapEditor
            initialContent={content}
            onUpdate={handleContentChange}
            isEditable={effectiveEditable}
          />
        </div>
      </div>

      {/* Subpage Creation Modal */}
      <NewPageModal
        open={isModalOpen}
        onOpenChange={() => setModalOpen(false)}
        parentId={initialData.id}
        workspaceId={workspaceId}
        onPageCreated={handleSubpageCreated}
      />
    </div>
  )
}
