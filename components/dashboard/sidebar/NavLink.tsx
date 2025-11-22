"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

interface NavLinkProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active?: boolean;
    isOpen: boolean;
    href?: string;
}

export default function NavLink({ icon: Icon, label, active = false, isOpen, href = "#" }: NavLinkProps) {
    const pathname = usePathname();
    const isActiveLink = href !== "#" && pathname === href;

    return (
        <Link
            href={href}
            className={`
        w-full flex items-center py-2.5 rounded-lg
        transition-all duration-300 ease-out
        border cursor-pointer
        active:scale-95
        group
        relative overflow-hidden
        ${(active || isActiveLink)
                    ? `
              bg-gradient-to-r from-indigo-600/90 to-indigo-600/70
              border-indigo-500/50
              text-white
              shadow-lg shadow-indigo-600/20
              hover:shadow-indigo-600/30
            `
                    : `
              text-neutral-400
              bg-neutral-900/40 hover:bg-neutral-800/60
              border-neutral-700/30 hover:border-indigo-500/40
              hover:text-indigo-300
              backdrop-blur-sm
            `
                }
        ${isOpen ? "px-3 gap-3 justify-start" : "justify-center"}
      `}
        >
            {!active && !isActiveLink && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/0 transition-all duration-300"></div>
            )}

            <Icon
                className={`
          w-5 h-5 flex-shrink-0 transition-all duration-300 ease-out relative z-10
          ${(active || isActiveLink) ? "text-white" : "text-neutral-400 group-hover:text-indigo-300 group-hover:scale-110"}
        `}
            />

            {isOpen && <span className="text-sm font-medium transition-all duration-300 relative z-10">{label}</span>}
        </Link>
    );
}
