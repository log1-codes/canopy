"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, Hash, Link as LinkIcon } from "lucide-react";

export interface PageItem {
    id: string;
    title: string;
    parentId: string | null;
    icon: string | null;
}

export interface PageTreeNode extends PageItem {
    children: PageTreeNode[];
    isExpanded: boolean;
}

interface PageTreeProps {
    pages: PageTreeNode[];
    workspaceId?: string;
    isOpen: boolean;
    depth?: number;
}

export default function PageTree({
    pages,
    workspaceId,
    isOpen,
    depth = 0,
}: PageTreeProps) {
    const pathname = usePathname();
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

    const toggleExpand = (pageId: string) => {
        setExpandedNodes((prev) => ({ ...prev, [pageId]: !prev[pageId] }));
    };

    const getPageIcon = (icon: string | null) => {
        if (icon === 'hash') return <Hash className="h-4 w-4 text-indigo-300" />;
        if (icon === 'link') return <LinkIcon className="h-4 w-4 text-blue-300" />;
        return <FileText className="h-4 w-4 text-neutral-400" />; // Default icon
    };

    return (
        <ul className="space-y-0.5">
            {pages.map((page) => {
                const isActive = workspaceId ? pathname.includes(`/page/${page.id}`) : false;
                const isCurrentlyExpanded = expandedNodes[page.id] !== undefined ? expandedNodes[page.id] : page.isExpanded;
                const hasChildren = page.children.length > 0;
                const paddingLeft = depth * 16 + 12;

                return (
                    <li key={page.id} className="overflow-hidden">
                        <div
                            className={`flex items-center w-full group`}
                            // Apply indentation style
                            style={{ paddingLeft: `${paddingLeft}px` }}
                        >

                            {/* Expansion Button */}
                            {hasChildren && isOpen && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleExpand(page.id);
                                    }}
                                    className={`
                        p-1 flex-shrink-0 transition-all duration-300 ease-out
                        text-neutral-500 hover:text-indigo-400
                        ${isCurrentlyExpanded ? "rotate-90" : "rotate-0"}
                        hover:bg-neutral-800/50 rounded-md
                        active:scale-90 mr-1
                    `}
                                    title={isCurrentlyExpanded ? "Collapse" : "Expand"}
                                >
                                    <ChevronRight className="size-4 transition-all duration-300" />
                                </button>
                            )}

                            {!hasChildren && isOpen && (
                                <div className="w-5 flex-shrink-0 mr-1"></div>
                            )}

                            <Link
                                href={workspaceId ? `/dashboard/workspace/${workspaceId}/page/${page.id}` : "#"}
                                className={`
                  flex items-center gap-2 py-2 rounded-lg transition-all duration-300 ease-out text-sm w-full min-h-[36px]
                  ${isOpen ? "pl-2 pr-3" : "justify-center w-8 h-8 p-0"}
                  ${isActive
                                        ? "bg-gradient-to-r from-indigo-600/90 to-indigo-600/70 text-white font-medium shadow-lg shadow-indigo-600/20 border border-indigo-500/40"
                                        : "text-neutral-300 hover:text-white border border-transparent hover:bg-neutral-800/60 hover:border-indigo-500/30"
                                    }
                  hover:shadow-md hover:shadow-indigo-500/10
                  active:scale-95
                  relative overflow-hidden
                `}
                                title={page.title}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                )}

                                <span className="flex items-center gap-2 relative z-10">
                                    <div
                                        className={`flex-shrink-0 transition-all duration-300 ${isActive ? "scale-110" : "scale-100 group-hover:scale-110"}`}
                                    >
                                        {getPageIcon(page.icon)}
                                    </div>
                                    {isOpen && <span className="truncate">{page.title}</span>}
                                    {!isOpen && <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110"><FileText className="size-5" /></div>}
                                </span>
                            </Link>
                        </div>

                        {hasChildren && isCurrentlyExpanded && isOpen && (
                            <div className="pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                                <PageTree pages={page.children} workspaceId={workspaceId} isOpen={isOpen} depth={depth + 1} />
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
