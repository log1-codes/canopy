"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AlertTriangle, CheckCircle, Save, Loader2, SaveAll, Bell } from "lucide-react"
import { debounce } from "@/app/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import "../editor/tiptap-editor-styles.css"

const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
}

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

const TiptapEditor = dynamic(() => import("./TiptapEditor").then((mod) => mod.TiptapEditor), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full p-8 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading editor...
    </div>
  ),
})

export function EditorComponent({ initialData, isEditable, workspaceId }: EditorComponentProps) {
  const [title, setTitle] = useState(initialData.title)
  const [content, setContent] = useState(initialData.content)
  const [status, setStatus] = useState<"saved" | "saving" | "error" | "unsaved">("saved")
  const [lastSaved, setLastSaved] = useState(initialData.updatedAt)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isHeaderFocused, setIsHeaderFocused] = useState(false)

  const debouncedSave = useMemo(() => {
    const saveCore = async (dataToSave: { title?: string; content?: any }) => {
      if (status === "saving" || !isEditable || Object.keys(dataToSave).length === 0) {
        return
      }

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
  }, [initialData.id, isEditable, status])

  const handleManualSave = useCallback(() => {
    if (!isEditable || status === "saving" || !unsavedChanges) return

    debouncedSave.cancel()
    debouncedSave({ title: title, content: content })
  }, [isEditable, status, unsavedChanges, title, content, debouncedSave])

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

  useEffect(() => {
    if (unsavedChanges) {
      const timeout = setTimeout(() => {
        if (unsavedChanges) {
          setStatus("unsaved")
        }
      }, 500)
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleManualSave])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 text-foreground">
      <header
        className={cn(
          "flex justify-between items-center h-16 sticky top-0 z-20",
          "border-b border-neutral-800/50",
          "bg-neutral-950/80 backdrop-blur-sm",
          "transition-all duration-300 ease-out",
          isHeaderFocused && "bg-neutral-950 border-neutral-700/50 shadow-lg shadow-neutral-950/20",
        )}
      >
        <div className="flex flex-grow items-center gap-4 px-6">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => setIsHeaderFocused(true)}
            onBlur={() => setIsHeaderFocused(false)}
            className={cn(
              "text-2xl font-bold tracking-tight",
              "bg-transparent border-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "transition-all duration-200",
              "placeholder:text-neutral-700",
              !isEditable && "cursor-not-allowed text-neutral-600",
              isEditable && "text-neutral-50",
              isHeaderFocused && "text-neutral-100",
            )}
            placeholder="Untitled Page"
            disabled={!isEditable}
          />
        </div>

        <div className="flex items-center gap-3 px-6">
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              "transition-all duration-300",
              "min-w-fit px-2 py-1 rounded-md",
              status === "error" && "text-red-400",
              status === "saved" && "text-emerald-400",
              (status === "saving" || status === "unsaved") && "text-neutral-400",
            )}
          >
            {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "saved" && <CheckCircle className="h-4 w-4 animate-in fade-in duration-300" />}
            {status === "error" && <AlertTriangle className="h-4 w-4 animate-in shake duration-300" />}
            {status === "unsaved" && <Save className="h-4 w-4 animate-pulse" />}

            <span className="hidden sm:inline-block">
              {status === "saved"
                ? "Saved"
                : status === "saving"
                  ? "Saving..."
                  : status === "error"
                    ? "Error"
                    : "Unsaved"}
            </span>
          </div>

          {isEditable && (
            <Button
              onClick={handleManualSave}
              variant="ghost"
              size="sm"
              className={cn(
                "transition-all duration-300 ease-out",
                "px-3 py-1.5 h-auto text-sm font-medium",
                "hover:scale-105 active:scale-95",
                "rounded-md",
                unsavedChanges &&
                  cn(
                    "bg-gradient-to-r from-neutral-800 to-neutral-750",
                    "text-neutral-100",
                    "hover:from-neutral-700 hover:to-neutral-700",
                    "shadow-sm hover:shadow-md hover:shadow-neutral-900/30",
                  ),
                !unsavedChanges && "text-neutral-500 opacity-50 hover:opacity-70",
              )}
              disabled={status === "saving" || !unsavedChanges}
              title="Save Page Manually (Ctrl+S)"
            >
              <SaveAll className={cn("h-4 w-4 mr-2", status === "saving" && "animate-spin")} />
              {status === "saving" ? "Saving" : "Save"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-neutral-600 hover:text-neutral-400",
              "transition-all duration-300",
              "hover:bg-neutral-800/50",
            )}
          >
            <Bell className="h-5 w-5" />
          </Button>

          <span
            className={cn(
              "text-neutral-500 hidden sm:block text-xs font-medium",
              "min-w-[80px] text-right",
              "transition-colors duration-300",
            )}
          >
            {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto scroll-smooth">
        {!isEditable && (
          <div
            className={cn(
              "mx-auto max-w-4xl px-6 py-4 mt-6",
              "bg-yellow-500/10 border border-yellow-700/30 rounded-lg",
              "text-yellow-600 text-sm font-medium",
              "animate-in fade-in slide-in-from-top-2 duration-500",
            )}
          >
            You have View-Only access. Editing is disabled.
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-8">
          <TiptapEditor initialContent={content} onUpdate={handleContentChange} isEditable={isEditable} />
        </div>
      </div>
    </div>
  )
}
