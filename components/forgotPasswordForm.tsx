"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();



    if (!email.trim()) {

      showToast("Please enter your email address", "warning", "top-right");
      return;
    }

    if (!validateEmail(email)) {

      showToast("Please enter a valid email address", "warning", "top-right");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send reset link");
      }

      showToast(
        "Password reset link sent! Please check your email",
        "success",
        "top-right",
      );
      setEmail("");
    } catch (error: any) {

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        showToast(
          "Network error. Please check your connection",
          "error",
          "top-right",
        );
      } else {
        showToast(
          error?.message || "Something went wrong. Please try again",
          "error",
          "top-right",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-neutral-900 to-neutral-950 text-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Canopy</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Forgot your password? We'll help you reset it securely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 rounded-3xl bg-linear-to-br from-white/3 to-white/1 backdrop-blur-sm border border-white/4 shadow-2xl"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-neutral-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="you@example.com"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${loading
              ? "bg-indigo-500/50 text-white/80"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              } shadow-xl rounded-xl cursor-pointer transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
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
