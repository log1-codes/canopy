"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2, Eye, EyeOff } from "lucide-react" 

import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false) 
  const[rememberme , setRememberMe]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.")
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl,
        rememberMe : rememberme
      })

      setLoading(false)

      if (result?.error) {
        let errorMessage = "Invalid credentials. Please check your email and password."

        if (result.error === "No user found with this email") {
            errorMessage = "No account found with this email."
        } else if (result.error === "Invalid password") {
            errorMessage = "Invalid password. Please try again."
        }
        
        setError(errorMessage)
        return
      }
      
      if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }

    } catch (err) {
      setLoading(false)
      setError("An unexpected error occurred. Please try again.")
    }
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
              className="mt-2 w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm">
            <span className="text-neutral-300">Password</span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-indigo-400 focus:outline-none transition duration-150"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input
              type="checkbox"
              checked={rememberme}
              onChange={()=>setRememberMe(!rememberme)} 
              className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded" />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${loading
                ? "bg-neutral-300 text-black opacity-80"
                : "bg-white text-black hover:bg-neutral-50"
              } shadow-custom-xl rounded-xl transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
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