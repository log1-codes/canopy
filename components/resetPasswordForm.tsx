"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { checkPasswordComplexity, PasswordRequirementsGrid } from "@/lib/password-utils";


export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const complexity = useMemo(() => checkPasswordComplexity(password), [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();



    if (!token) {
      showToast("Invalid or missing token", "error", "top-right");
      return;
    }

    if (!complexity.isValid) {
      showToast("Password does not meet all complexity requirements", "warning", "top-right");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "warning", "top-right");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Reset failed");
      }

      showToast("Password successfully reset! Redirecting to login...", "success", "top-right");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {


      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        showToast("Network error. Please check your connection", "error", "top-right");
      } else {
        showToast(
          error?.message || "Something went wrong. Please try again",
          "error",
          "top-right"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Reset Password</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Enter your new password below to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.04] shadow-2xl"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-neutral-300">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-indigo-400 transition"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {password.length > 0 && (
              <PasswordRequirementsGrid complexity={complexity} />
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-neutral-300">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-indigo-400 transition"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${loading
              ? "bg-indigo-500/50 text-white/80"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              } shadow-xl rounded-xl transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Remembered your password?{" "}
            <a href="/login" className="text-white underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}