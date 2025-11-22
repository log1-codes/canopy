import { Menu } from "lucide-react";

interface SidebarHeaderProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
    return (
        <div
            className="
        flex items-center justify-between h-16 px-4
        border-b border-white/[0.04]
        transition-all duration-700 ease-out
      "
        >
            {isOpen && (
                <h1 className="text-xl font-bold text-white transition-all duration-500 opacity-100 animate-in fade-in-0 slide-in-from-left-2">
                    Canopy
                </h1>
            )}
            <button
                onClick={onToggle}
                className="
          p-1.5 rounded-lg
          bg-neutral-800/30 hover:bg-neutral-700/50
          backdrop-blur-md
          border border-white/[0.05] hover:border-indigo-500/30
          transition-all duration-500 ease-out
          hover:shadow-lg hover:shadow-indigo-500/10
          cursor-pointer
          active:scale-90
          group
        "
            >
                <Menu className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400 transition-all duration-500 group-hover:rotate-90" />
            </button>
        </div>
    );
}
