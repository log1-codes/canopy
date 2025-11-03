"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: call  auth API here
    setTimeout(() => {
      setLoading(false)
      router.push("/") 
    }, 800)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Canopy</h1>
          <p className="text-sm text-neutral-400 mt-2">Organize. Collaborate. Create. Together.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.04] shadow-custom-2xl"
        >
          <label className="block text-sm">
            <span className="text-neutral-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm">
            <span className="text-neutral-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input type="checkbox" className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-white text-black hover:bg-neutral-50 shadow-custom-xl rounded-xl"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            New to Canopy?{" "}
            <a href="/signup" className="text-white underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}