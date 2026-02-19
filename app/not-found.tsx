import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-900 to-neutral-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-indigo-600 mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                    <p className="text-neutral-400 text-sm">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 font-medium"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    )
}
