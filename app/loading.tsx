export default function Loading() {
    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-neutral-700 border-t-indigo-500 animate-spin" />
                </div>
                <p className="text-neutral-400 text-sm animate-pulse">Loading...</p>
            </div>
        </div>
    )
}
