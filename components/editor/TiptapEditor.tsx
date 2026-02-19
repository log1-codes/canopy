"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Heading } from "@tiptap/extension-heading"
import { CodeBlock } from "@tiptap/extension-code-block"
import { Blockquote } from "@tiptap/extension-blockquote"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { HardBreak } from "@tiptap/extension-hard-break"
import { useEffect } from "react"
import { Bold, Italic, Strikethrough, Code, Quote, ListChecks, ListOrdered, List } from "lucide-react"

import { cn } from "@/lib/utils"

interface TiptapEditorProps {
  initialContent: any
  onUpdate: (jsonContent: any) => void
  isEditable: boolean
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null
  if (!editor.isEditable) return null

  const inactiveClass =
    "p-2 hover:bg-neutral-700 rounded text-neutral-400 transition-all duration-200 hover:text-neutral-200"
  const activeClass = "bg-neutral-700 text-neutral-100 p-2 rounded transition-all duration-200"

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 px-4 py-3 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md shadow-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? activeClass : inactiveClass}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? activeClass : inactiveClass}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? activeClass : inactiveClass}
        title="Strikethrough (Ctrl+Shift+X)"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <div className="h-6 w-px bg-neutral-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? activeClass : inactiveClass}
        title="Heading 1 (Ctrl+Alt+1)"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? activeClass : inactiveClass}
        title="Heading 3 (Ctrl+Alt+3)"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? activeClass : inactiveClass}
        title="Bullet List (Ctrl+Shift+8)"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? activeClass : inactiveClass}
        title="Ordered List (Ctrl+Shift+7)"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <div className="h-6 w-px bg-neutral-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? activeClass : inactiveClass}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? activeClass : inactiveClass}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive("taskList") ? activeClass : inactiveClass}
        title="To-Do List"
      >
        <ListChecks className="h-4 w-4" />
      </button>
    </div>
  )
}

export function TiptapEditor({ initialContent, onUpdate, isEditable }: TiptapEditorProps) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: { keepAttributes: true },
          orderedList: { keepAttributes: true },
        }),
        Heading.configure({ levels: [1, 2, 3] }),
        Blockquote,
        CodeBlock,
        TaskList,
        TaskItem.configure({ nested: true }),
        HardBreak,
      ],
      content: initialContent || "<p>Start writing...</p>",
      editable: isEditable,
      editorProps: {
        attributes: {
          class: cn(
            "prose",
            "dark:prose-invert",
            "prose-sm",
            "max-w-4xl",
            "mx-auto",
            "w-full",
            "focus:outline-none",
            "min-h-[500px]",
            "p-4",
            "pb-16",
            "md:p-8",
            "md:pb-16",
            "lg:p-12",
            "lg:pb-16",
            "dark:prose-headings:text-neutral-50",
            "dark:prose-p:text-neutral-300",
            "dark:prose-strong:text-neutral-200",
            "dark:prose-em:text-neutral-200",
            "dark:prose-code:text-neutral-200",
            "dark:prose-code:bg-neutral-800",
            "dark:prose-pre:bg-neutral-900",
            "dark:prose-pre:text-neutral-200",
            "dark:prose-blockquote:text-neutral-400",
            "dark:prose-blockquote:border-neutral-700",
            "dark:prose-hr:border-neutral-800",
            "dark:prose-li:text-neutral-300",
            "dark:prose-a:text-neutral-300",
            "dark:prose-a:hover:text-neutral-100",
            !isEditable && "cursor-default",
          ),
        },
      },
      onUpdate: ({ editor }) => {
        onUpdate(editor.getJSON())
      },
      immediatelyRender: false,
    },
    [isEditable],
  )

  useEffect(() => {
    if (!editor || editor.isDestroyed) return

    if (JSON.stringify(initialContent) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(initialContent || {}, { emitUpdate: false })
    }
  }, [editor, initialContent])

  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy()
      }
    }
  }, [editor])

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 rounded-lg overflow-hidden shadow-lg border border-neutral-800">
      <MenuBar editor={editor} />
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-950">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
