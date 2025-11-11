import { MoreHorizontal, Folder, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Workspace } from "./workspace-grid-client";
import { formatRelativeTime } from "@/app/lib/date-utils";
import Link from "next/link";
interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const displayTime = formatRelativeTime(workspace.updated);
  const href = `/dashboard/workspace/${workspace.id}/pages`
  return (
    
    <Link href={href}>
      <Card
      className="
        bg-gradient-to-br from-neutral-800 via-neutral-750 to-neutral-800
        border border-neutral-700/60
        hover:border-indigo-500/40
        hover:shadow-lg hover:shadow-indigo-500/20
        transition-all duration-300
        p-6 group cursor-pointer rounded-xl
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="
            p-3
            bg-gradient-to-br from-neutral-700 to-neutral-600
            group-hover:from-indigo-700/30 group-hover:to-indigo-500/20
            rounded-lg transition-all duration-300
          "
        >
          <Folder className="w-6 h-6 text-neutral-300 group-hover:text-indigo-300 transition-colors" />
        </div>

        <button
          className="
            p-2 hover:bg-neutral-700/60 rounded-lg
            opacity-0 group-hover:opacity-100 transition-all
          "
        >
          <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">
        {workspace.title}
      </h3>
      <p className="text-neutral-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {workspace.description}
      </p>

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{workspace.pages} Pages</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-neutral-500" />
          <span>{displayTime}</span>
        </div>
      </div>
    </Card>
    
    </Link>
  );
}

interface WorkspaceListItemProps {
  workspace: Workspace;
}

export function WorkspaceListItem({ workspace }: WorkspaceListItemProps) {
  const displayTime = formatRelativeTime(workspace.updated);
 const href = `/dashboard/workspace/${workspace.id}/pages`
  return (
    <Link href={href}>
      <div
      className="
        bg-gradient-to-br from-neutral-800 via-neutral-750 to-neutral-800
        border border-neutral-700/60
        hover:border-indigo-500/40
        rounded-lg
        p-4 flex items-center justify-between
        group
        hover:shadow-lg hover:shadow-indigo-500/20
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="
            p-2
            bg-gradient-to-br from-neutral-700 to-neutral-600
            group-hover:from-indigo-700/30 group-hover:to-indigo-500/20
            rounded-lg transition-all duration-300
          "
        >
          <Folder className="w-5 h-5 text-neutral-300 group-hover:text-indigo-300 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors">
            {workspace.title}
          </h3>
          <p className="text-neutral-400 text-sm truncate">
            {workspace.description}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 ml-4">
        <span className="text-sm text-neutral-400">{workspace.pages} Pages</span>
        <span className="text-sm text-neutral-500 whitespace-nowrap">{displayTime}</span>
      </div>

      <button
        className="
          p-2 hover:bg-neutral-700/60 rounded-lg
          opacity-0 group-hover:opacity-100 transition-all
        "
      >
        <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
      </button>
    </div>
    </Link>
  );
}
