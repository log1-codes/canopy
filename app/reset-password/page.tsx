import { Suspense } from "react"
import ResetPasswordForm from "@/components/resetPasswordForm"

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-4 border-neutral-700 border-t-indigo-500 animate-spin" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    )
}