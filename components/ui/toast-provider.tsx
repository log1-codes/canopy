"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface ToastProps {
  id: number
  message: string
  type?: "success" | "error" | "warning" | "info"
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastProps["type"],
    position?: ToastProps["position"]
  ) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (
    message: string,
    type: ToastProps["type"] = "info",
    position: ToastProps["position"] = "top-right"
  ) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, position }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
          const filtered = toasts.filter((t) => t.position === pos)
          if (!filtered.length) return null

          const [vertical, horizontal] = pos.split("-")

          return (
            <div
              key={pos}
              className={`fixed z-[9999] flex flex-col gap-3 p-4 ${
                vertical === "top" ? "top-4" : "bottom-4"
              } ${horizontal === "left" ? "left-4" : "right-4"}`}
            >
              <AnimatePresence>
                {filtered.map((toast) => (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: vertical === "top" ? -20 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: vertical === "top" ? -20 : 20 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl px-5 py-3 text-sm font-medium backdrop-blur-md shadow-lg border
                    ${
                      toast.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : toast.type === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : toast.type === "warning"
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                        : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    }`}
                  >
                    {toast.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        })}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}