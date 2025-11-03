"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"

export default function SignupPage() {
  const { showToast } = useToast()  // ✅ corrected destructuring
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🧠 Input Validation before submit
    if (!name.trim()) {
      showToast("Please enter your name.", "warning", "top-right")
      return
    }

    if (!email.trim()) {
      showToast("Email is required.", "warning", "top-right")
      return
    }

    if (!email.includes("@")) {
      showToast("Invalid email format.", "error", "top-right")
      return
    }

    if (!password.trim()) {
      showToast("Password cannot be empty.", "warning", "top-right")
      return
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "warning", "top-right")
      return
    }

    // 🧩 If validation passes:
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 1000)) // mock API
      showToast("Account created successfully!", "success", "top-right")
      router.push("/")
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error", "top-right")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Canopy</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Organize. Collaborate. Create. Together.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.04] shadow-custom-2xl transition-all duration-200"
        >
          <label className="block text-sm">
            <span className="text-neutral-300">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              placeholder="Alex"
            />
          </label>

          <label className="block text-sm">
            <span className="text-neutral-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm">
            <span className="text-neutral-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input
                type="checkbox"
                className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${
              loading
                ? "bg-neutral-300 text-black opacity-80"
                : "bg-white text-black hover:bg-neutral-50"
            } shadow-custom-xl rounded-xl transition-all duration-200`}
            disabled={loading}
          >
            {loading ? "Signing up…" : "Sign up"}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account on Canopy?{" "}
            <a href="/login" className="text-white underline">
              login
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
