"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { WorkspaceCard, WorkspaceListItem } from "./workspace-items";

export interface Workspace {
  id: number;
  title: string;
  description: string;
  pages: number;
  updated: string;
}

type ViewType = "grid" | "list";
type SortType = "edited" | "created" | "name";

interface WorkspaceClientProps {
  workspaces: Workspace[];
}

export default function WorkspaceClient({ workspaces }: WorkspaceClientProps) {
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<SortType>("edited");

  const sortedWorkspaces = useMemo(() => {
    if (sort === "name") {
      return [...workspaces].sort((a, b) => a.title.localeCompare(b.title));
    }
    return workspaces;
  }, [workspaces, sort]);

  const getSortLabel = (value: SortType) => {
    switch (value) {
      case "edited":
        return "Last Edited";
      case "created":
        return "Created Date";
      case "name":
        return "Name";
    }
  };

  return (
    <div>
      {/* Filter/Sort Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 text-sm">Sort by:</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-sm text-white 
                           rounded-lg px-3 py-2 transition-all duration-200 
                           hover:bg-neutral-800 hover:border-indigo-600 hover:text-indigo-400"
              >
                {getSortLabel(sort)}
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-44 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-1"
            >
             {(["edited", "created", "name"] as SortType[]).map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSort(option)}
                  className={`flex items-center justify-between text-sm rounded-md px-3 py-2 cursor-pointer transition-colors
                    ${
                      sort === option
                        ? "bg-indigo-600 text-white"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400"
                    }`}
                >
                  {getSortLabel(option)}
                  {sort === option && (
                    <span className="text-xs text-indigo-300 font-medium">
                      Active
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800 transition-colors">
          <Button
            size="sm"
            onClick={() => setView("grid")}
            className={`px-3 h-8 rounded-md transition-all duration-200 ${
              view === "grid"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-indigo-400"
            }`}
          >
            ⊞ Grid
          </Button>
          <Button
            size="sm"
            onClick={() => setView("list")}
            className={`px-3 h-8 rounded-md transition-all duration-200 ${
              view === "list"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-indigo-400"
            }`}
          >
            ≡ List
          </Button>
        </div>
      </div>

      {/* Workspaces Grid/List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceListItem key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
