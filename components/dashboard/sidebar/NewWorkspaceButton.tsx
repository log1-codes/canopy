import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewWorkspaceButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function NewWorkspaceButton({ isOpen, onClick }: NewWorkspaceButtonProps) {
    return (
        <div className="p-3 border-t border-white/4 transition-all duration-500">
            <Button
                onClick={onClick}
                className={`
          w-full bg-linear-to-r from-indigo-600 to-indigo-600
          hover:from-indigo-500 hover:to-indigo-600
          text-white font-semibold rounded-xl
          transition-all duration-500 ease-out
          h-10
          hover:shadow-lg hover:shadow-indigo-600/30
          active:scale-95
          border border-indigo-500/30 hover:border-indigo-400/50
          backdrop-blur-sm
          cursor-pointer
          group
          ${isOpen ? "justify-start gap-3" : "justify-center"}
        `}
            >
                <Plus className="w-5 h-5 transition-all duration-500 group-hover:rotate-90 group-hover:scale-110" />
                {isOpen && <span className="transition-all duration-500">New Workspace</span>}
            </Button>
        </div>
    );
}
