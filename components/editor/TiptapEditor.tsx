"use client"
import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Heading } from "@tiptap/extension-heading"
import { CodeBlock } from "@tiptap/extension-code-block"
import { Blockquote } from "@tiptap/extension-blockquote"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { HardBreak } from "@tiptap/extension-hard-break"
import { Highlight } from "@tiptap/extension-highlight"
import { Underline } from "@tiptap/extension-underline"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Placeholder } from "@tiptap/extension-placeholder"
import { CharacterCount } from "@tiptap/extension-character-count"
import { useEffect, useState, useCallback, useRef } from "react"
import {
  Bold, Italic, Strikethrough, Code, Quote, ListChecks,
  ListOrdered, List, Underline as UnderlineIcon, Highlighter,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Download, Copy, Check, Undo, Redo, AlignLeft, AlignCenter,
  AlignRight, Heading1, Heading2, Heading3, Minus, FileText,
  ChevronDown, X, Search, Type, Palette, MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"


interface TiptapEditorProps {
  initialContent?: JSONContent | string
  onUpdate?: (jsonContent: JSONContent) => void
  isEditable?: boolean
  title?: string
  onTitleChange?: (title: string) => void
}


function tiptapJsonToMarkdown(node: JSONContent, indent = 0): string {
  if (!node) return ""

  const pad = "  ".repeat(indent)

  switch (node.type) {
    case "doc":
      return (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join("\n\n")

    case "paragraph":
      if (!node.content) return ""
      return (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join("")

    case "heading": {
      const level = node.attrs?.level || 1
      const hashes = "#".repeat(level)
      const text = (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join("")
      return `${hashes} ${text}`
    }

    case "bulletList":
      return (node.content || []).map((n) => tiptapJsonToMarkdown(n, indent)).join("\n")

    case "orderedList":
      return (node.content || []).map((n, i) => {
        const text = tiptapJsonToMarkdown(n, indent)
        return `${pad}${i + 1}. ${text.replace(/^- /, "")}`
      }).join("\n")

    case "listItem": {
      const children = (node.content || [])
      const first = children[0]
      const firstText = first ? tiptapJsonToMarkdown(first, 0) : ""
      const rest = children.slice(1).map((n) => tiptapJsonToMarkdown(n, indent + 1)).join("\n")
      return `${pad}- ${firstText}${rest ? "\n" + rest : ""}`
    }

    case "taskList":
      return (node.content || []).map((n) => tiptapJsonToMarkdown(n, indent)).join("\n")

    case "taskItem": {
      const checked = node.attrs?.checked ? "x" : " "
      const text = (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join(" ").trim()
      return `${pad}- [${checked}] ${text}`
    }

    case "blockquote": {
      const text = (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join("\n")
      return text.split("\n").map((l) => `> ${l}`).join("\n")
    }

    case "codeBlock": {
      const lang = node.attrs?.language || ""
      const code = (node.content || []).map((n) => n.text || "").join("")
      return `\`\`\`${lang}\n${code}\n\`\`\``
    }

    case "code":
      return `\`${node.text || ""}\``

    case "horizontalRule":
      return "---"

    case "hardBreak":
      return "\n"

    case "image":
      return `![${node.attrs?.alt || ""}](${node.attrs?.src || ""})`

    case "table": {
      const rows = (node.content || [])
      if (!rows.length) return ""
      const rendered = rows.map((r) => {
        const cells = (r.content || []).map((c) => {
          return (c.content || []).map((n) => tiptapJsonToMarkdown(n)).join("").trim()
        })
        return "| " + cells.join(" | ") + " |"
      })
      const header = rendered[0]
      const firstRowContent = rows[0]?.content || []
      const separator = "| " + firstRowContent.map(() => "---").join(" | ") + " |"
      return [header, separator, ...rendered.slice(1)].join("\n")
    }

    case "text": {
      let text = node.text || ""
      const marks = node.marks || []
      for (const mark of marks) {
        if (mark.type === "bold") text = `**${text}**`
        else if (mark.type === "italic") text = `*${text}*`
        else if (mark.type === "strike") text = `~~${text}~~`
        else if (mark.type === "code") text = `\`${text}\``
        else if (mark.type === "underline") text = `<u>${text}</u>`
        else if (mark.type === "highlight") text = `==${text}==`
        else if (mark.type === "link") text = `[${text}](${mark.attrs?.href || ""})`
      }
      return text
    }

    default:
      return (node.content || []).map((n) => tiptapJsonToMarkdown(n)).join("")
  }
}


function CodeBlockWithCopy({ node, children }: { node: JSONContent; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const code = node?.textContent || ""

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <pre className="bg-neutral-900 border border-neutral-700/60 rounded-lg p-4 overflow-x-auto text-sm font-mono text-neutral-200">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs px-2 py-1 rounded flex items-center gap-1"
      >
        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  )
}


const Sep = () => <div className="h-5 w-px bg-neutral-700 mx-0.5" />


const ToolbarBtn = ({
  onClick, active, title, children, disabled,
}: {
  onClick: () => void
  active?: boolean
  title?: string
  children: React.ReactNode
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "flex items-center justify-center h-7 w-7 rounded text-xs transition-all duration-150 select-none",
      active
        ? "bg-violet-600/30 text-violet-300 ring-1 ring-violet-500/40"
        : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200",
      disabled && "opacity-30 cursor-not-allowed pointer-events-none"
    )}
  >
    {children}
  </button>
)


function LinkModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")

  const apply = () => {
    if (!url) return
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, "")
    if (selectedText) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    } else {
      editor.chain().focus().insertContent(`<a href="${url}">${text || url}</a>`).run()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 w-80 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-100">Insert Link</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">URL</label>
            <input
              autoFocus
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-neutral-600"
              onKeyDown={e => e.key === "Enter" && apply()}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Text (optional)</label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Link text"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-neutral-600"
              onKeyDown={e => e.key === "Enter" && apply()}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 text-sm py-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition">Cancel</button>
          <button onClick={apply} className="flex-1 text-sm py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition">Apply</button>
        </div>
      </div>
    </div>
  )
}


function ImageModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [src, setSrc] = useState("")
  const [alt, setAlt] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const insert = () => {
    if (!src) return
    editor.chain().focus().setImage({ src, alt }).run()
    onClose()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setSrc(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 w-80 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-100">Insert Image</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Image URL</label>
            <input
              value={src}
              onChange={e => setSrc(e.target.value)}
              placeholder="https://..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-neutral-600"
            />
          </div>
          <div className="text-center text-xs text-neutral-600 my-1">— or —</div>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-neutral-700 rounded-lg py-3 text-xs text-neutral-500 hover:border-violet-500 hover:text-violet-400 transition"
          >
            Upload from device
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {src && (
            <img src={src} alt="preview" className="w-full h-32 object-cover rounded-lg border border-neutral-700" />
          )}
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Alt text</label>
            <input
              value={alt}
              onChange={e => setAlt(e.target.value)}
              placeholder="Describe the image"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 text-sm py-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition">Cancel</button>
          <button onClick={insert} disabled={!src} className="flex-1 text-sm py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition disabled:opacity-40">Insert</button>
        </div>
      </div>
    </div>
  )
}


function ExportMenu({ editor, title }: { editor: Editor; title: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const exportMarkdown = () => {
    const json = editor.getJSON()
    const md = tiptapJsonToMarkdown(json)
    const blob = new Blob([md], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.md`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const exportJson = () => {
    const json = editor.getJSON()
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.json`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const exportText = () => {
    const text = editor.getText()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const copyMarkdown = () => {
    const json = editor.getJSON()
    const md = tiptapJsonToMarkdown(json)
    navigator.clipboard.writeText(md)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Export"
        className="flex items-center gap-1 h-7 px-2 rounded text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-150"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline text-xs">Export</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-48 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden py-1">
          {[
            { label: "Export as Markdown", icon: <FileText className="h-3.5 w-3.5" />, action: exportMarkdown },
            { label: "Export as JSON", icon: <Code className="h-3.5 w-3.5" />, action: exportJson },
            { label: "Export as Plain Text", icon: <Type className="h-3.5 w-3.5" />, action: exportText },
            { label: "Copy as Markdown", icon: <Copy className="h-3.5 w-3.5" />, action: copyMarkdown },
          ].map(item => (
            <button key={item.label} onClick={item.action} className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
              <span className="text-neutral-500">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


function FindReplace({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [find, setFind] = useState("")
  const [replace, setReplace] = useState("")

  const doReplace = () => {
    if (!find) return
    const html = editor.getHTML()
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const next = html.replace(new RegExp(escaped, "g"), replace)
    editor.commands.setContent(next)
    onClose()
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950 flex-wrap">
      <Search className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
      <input
        autoFocus
        value={find}
        onChange={e => setFind(e.target.value)}
        placeholder="Find..."
        className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 w-32"
        onKeyDown={e => e.key === "Enter" && doReplace()}
      />
      <input
        value={replace}
        onChange={e => setReplace(e.target.value)}
        placeholder="Replace..."
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-neutral-600"
        onKeyDown={e => e.key === "Enter" && doReplace()}
      />
      <button onClick={doReplace} className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-2.5 py-1 rounded transition">Replace All</button>
      <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 ml-auto">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}


const MenuBar = ({
  editor, title, showFind, setShowFind,
}: {
  editor: Editor | null
  title: string
  showFind: boolean
  setShowFind: (v: boolean | ((v: boolean) => boolean)) => void
}) => {
  const [showLink, setShowLink] = useState(false)
  const [showImage, setShowImage] = useState(false)

  if (!editor) return null

  const isEditable = editor.isEditable

  return (
    <>
      {showLink && <LinkModal editor={editor} onClose={() => setShowLink(false)} />}
      {showImage && <ImageModal editor={editor} onClose={() => setShowImage(false)} />}

      {isEditable && (
        <div className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
              <Undo className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
              <Redo className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
              <Heading1 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
              <Heading2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
              <Heading3 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
              <Bold className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
              <Italic className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
              <UnderlineIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
              <Strikethrough className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
              <Highlighter className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
              <List className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
              <ListOrdered className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task List">
              <ListChecks className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
              <Code className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
              <Quote className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
              <Minus className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => setShowLink(true)} active={editor.isActive("link")} title="Insert Link">
              <LinkIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => setShowImage(true)} title="Insert Image">
              <ImageIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
              title="Insert Table"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <Sep />

            <ToolbarBtn onClick={() => setShowFind(s => !s)} active={showFind} title="Find & Replace (Ctrl+H)">
              <Search className="h-3.5 w-3.5" />
            </ToolbarBtn>

            <div className="ml-auto flex items-center gap-1">
              <ExportMenu editor={editor} title={title} />
            </div>
          </div>

          {showFind && <FindReplace editor={editor} onClose={() => setShowFind(false)} />}
        </div>
      )}
    </>
  )
}


function Footer({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  const chars = editor.storage.characterCount?.characters() ?? 0
  const words = editor.storage.characterCount?.words() ?? 0

  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-neutral-800 bg-neutral-950 text-xs text-neutral-600">
      <span>{words} words · {chars} characters</span>
      <span className="text-neutral-700">Tiptap</span>
    </div>
  )
}


export function TiptapEditor({
  initialContent,
  onUpdate,
  isEditable = true,
  title = "Untitled",
  onTitleChange,
}: TiptapEditorProps) {
  const [showFind, setShowFind] = useState(false)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
          bulletList: { keepAttributes: true },
          orderedList: { keepAttributes: true },
        }),
        Heading.configure({ levels: [1, 2, 3] }),
        Blockquote,
        CodeBlock.configure({
          HTMLAttributes: { class: "code-block" },
        }),
        TaskList,
        TaskItem.configure({ nested: true }),
        HardBreak,
        Highlight.configure({ multicolor: false }),
        Underline,
        TextStyle,
        Color,
        Link.configure({
          openOnClick: !isEditable,
          HTMLAttributes: { class: "underline text-violet-400 hover:text-violet-300 cursor-pointer" },
        }),
        Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full border border-neutral-700" } }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({
          placeholder: "Start writing, or press '/' for commands…",
          emptyEditorClass: "is-editor-empty",
        }),
        CharacterCount,
      ],
      content: initialContent || "",
      editable: isEditable,
      editorProps: {
        attributes: {
          class: cn(
            "prose dark:prose-invert prose-sm max-w-4xl mx-auto w-full focus:outline-none",
            "min-h-[500px] p-4 pb-16 md:p-8 md:pb-16 lg:p-12 lg:pb-16",
            "dark:prose-headings:text-neutral-50",
            "dark:prose-p:text-neutral-300",
            "dark:prose-strong:text-neutral-200",
            "dark:prose-em:text-neutral-200",
            "dark:prose-code:text-violet-300",
            "dark:prose-code:bg-neutral-800",
            "dark:prose-pre:bg-neutral-900",
            "dark:prose-pre:text-neutral-200",
            "dark:prose-blockquote:text-neutral-400",
            "dark:prose-blockquote:border-violet-700",
            "dark:prose-hr:border-neutral-800",
            "dark:prose-li:text-neutral-300",
            "dark:prose-a:text-violet-400",
            "dark:prose-table:text-neutral-300",
            "dark:prose-th:text-neutral-200",
            "dark:prose-td:text-neutral-400",
            !isEditable && "cursor-default",
          ),
        },
        handleKeyDown: (view, event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "h") {
            event.preventDefault()
            setShowFind(s => !s)
            return true
          }
          return false
        },
      },
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getJSON())
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
      if (editor && !editor.isDestroyed) editor.destroy()
    }
  }, [editor])

  return (
    <>
      <style>{`
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #525252;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-top: 3px;
        }
        .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] {
          accent-color: #7c3aed;
          width: 14px;
          height: 14px;
          cursor: pointer;
        }
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #404040;
          padding: 0.4rem 0.75rem;
          min-width: 80px;
          vertical-align: top;
          position: relative;
        }
        .ProseMirror th {
          background: #1a1a1a;
          font-weight: 600;
          color: #e5e5e5;
        }
        .ProseMirror td {
          color: #a3a3a3;
        }
        .ProseMirror .selectedCell:after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(124,58,237,0.1);
          pointer-events: none;
        }
        .ProseMirror pre {
          position: relative;
        }
        .ProseMirror code:not(pre code) {
          background: #262626;
          color: #c084fc;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          font-size: 0.875em;
        }
        .ProseMirror mark {
          background: rgba(234,179,8,0.25);
          color: #fde047;
          border-radius: 2px;
          padding: 0 2px;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #7c3aed;
          padding-left: 1rem;
          color: #737373;
          font-style: italic;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #262626;
          margin: 2rem 0;
        }
        .ProseMirror img {
          max-width: 100%;
          border-radius: 8px;
        }
        .ProseMirror a {
          color: #a78bfa;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #c4b5fd;
        }
        .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #f5f5f5; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: #f0f0f0; }
        .ProseMirror h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.4rem; color: #e5e5e5; }

        /* Code block copy button group */
        .ProseMirror pre {
          background: #111 !important;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 1rem;
          overflow-x: auto;
          position: relative;
        }
        .ProseMirror pre code {
          background: none !important;
          color: #e2e8f0 !important;
          padding: 0 !important;
        }
      `}</style>

      <div className="flex flex-col h-full bg-neutral-950 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
        {isEditable ? (
          <div className="px-4 pt-6 pb-1 md:px-8 md:pt-8">
            <input
              value={title}
              onChange={e => onTitleChange?.(e.target.value)}
              placeholder="Untitled"
              className="w-full text-3xl font-bold text-neutral-100 bg-transparent border-none outline-none placeholder:text-neutral-700 max-w-4xl mx-auto block"
            />
          </div>
        ) : (
          <div className="px-4 pt-6 pb-1 md:px-8 md:pt-8">
            <h1 className="text-3xl font-bold text-neutral-100 max-w-4xl mx-auto">{title}</h1>
          </div>
        )}

        <MenuBar editor={editor} title={title} showFind={showFind} setShowFind={setShowFind} />

        <div className="grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-950">
          <EditorContent editor={editor} />
        </div>

        <Footer editor={editor} />
      </div>
    </>
  )
}