"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { checkPasswordComplexity, PasswordRequirementsGrid } from "@/lib/password-utils"


export default function SignupPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const complexity = useMemo(() => checkPasswordComplexity(password), [password]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError("Please enter your name.")
      showToast("Please enter your name.", "warning", "top-right")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid email address.")
      showToast("Please enter a valid email address.", "warning", "top-right")
      return
    }

    if (!password.trim()) {
      setFormError("Password cannot be empty.")
      showToast("Password cannot be empty.", "warning", "top-right")
      return
    }

    if (!complexity.isValid) {
      setFormError("Password does not meet all complexity requirements.")
      showToast("Password does not meet all complexity requirements.", "warning", "top-right")
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        redirect: false,
      })

      if (result?.error) {
        let errorMessage = "Failed to create account. Please try again."

        if (result.error === "User already exists with this email") {
          errorMessage = "A user already exists with this email address. Try logging in instead."
        } else if (result.error === "Failed to create account") {
          errorMessage = "Something went wrong during signup. Please try again."
        } else {
          errorMessage = result.error
        }

        setFormError(errorMessage)
        showToast(`Error : ${errorMessage}`, "error", "top-right")
        setLoading(false)
        return
      }

      if (result?.ok) {
        showToast("Account created successfully! Redirecting...", "success", "top-right")
        router.push("/login")
        router.refresh()
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.")
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
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
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

            {password.length > 0 && (
              <PasswordRequirementsGrid complexity={complexity} />
            )}
          </label>

          <Button
            type="submit"
            className={`w-full h-12 ${loading
              ? "bg-indigo-500/50 text-white/80"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              } shadow-custom-xl rounded-xl transition-all duration-200`}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? "Signing up…" : "Sign up"}
          </Button>

          {/* ✅ Improved Forgot Password placement */}
          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </a>
          </div>

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
