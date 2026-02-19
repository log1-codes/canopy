"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

interface UserProfileDropdownProps {
    isOpen: boolean;
    user: { name: string; email: string; avatarInitials: string };
    onLogout: () => void;
}

export default function UserProfileDropdown({ isOpen, user, onLogout }: UserProfileDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userName = user?.name;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={`
        p-3 border-t border-white/4
        flex relative transition-all duration-500 ease-out
        ${isOpen ? "gap-3 items-center" : "flex-col items-center gap-2"}
      `}
        >
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`
          rounded-full transition-all duration-500 ease-out
          cursor-pointer
          hover:shadow-lg hover:shadow-indigo-500/20
          active:scale-95
          group
          ${isOpen ? "p-0 hover:ring-2 hover:ring-indigo-500/30" : "p-0.5 hover:bg-neutral-800/50 backdrop-blur-sm"}
        `}
            >
                <Avatar className={`${isOpen ? "h-12 w-12" : "h-8 w-8"} transition-all duration-500 group-hover:scale-105`}>
                    <AvatarFallback
                        className="
              text-white font-medium
              bg-linear-to-br from-indigo-600 to-indigo-800
              transition-all duration-500 ease-out
              group-hover:shadow-lg group-hover:shadow-indigo-600/30
            "
                    >
                        {user.avatarInitials}
                    </AvatarFallback>
                </Avatar>
            </button>

            {isOpen && (
                <div className="flex-1 min-w-0 text-left transition-all duration-500 animate-in fade-in-0 slide-in-from-left-2">
                    <p className="text-sm font-medium text-white truncate">{userName}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                </div>
            )}

            {dropdownOpen && (
                <div
                    className={`
            absolute z-30 w-48 rounded-lg
            border border-neutral-700/50
            bg-neutral-900/95 backdrop-blur-lg
            py-1
            shadow-lg shadow-neutral-900/70
            animate-in fade-in-0 zoom-in-95 duration-300
            transition-all ease-out
            ${isOpen ? "bottom-full mb-2 left-0" : "bottom-full mb-2 left-1/2 transform -translate-x-1/2"}
          `}
                >
                    <div className="px-3 py-2 border-b border-neutral-700/50">
                        <p className="text-sm font-semibold text-white truncate">{userName}</p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>

                    <button
                        onClick={() => setDropdownOpen(false)}
                        className="
              flex w-full items-center gap-2 px-3 py-2 text-sm
              text-neutral-300
              hover:bg-indigo-600/20 hover:text-indigo-200
              transition-all duration-300 ease-out
              cursor-pointer
              active:scale-95
              group
            "
                    >
                        <User className="w-4 h-4 text-indigo-400 transition-all duration-300 group-hover:scale-110" />
                        Profile
                    </button>

                    <button
                        onClick={() => {
                            onLogout();
                            setDropdownOpen(false);
                        }}
                        className="
              flex w-full items-center gap-2 px-3 py-2 text-sm
              text-red-400
              hover:bg-red-600/20 hover:text-red-300
              transition-all duration-300 ease-out
              cursor-pointer
              active:scale-95
              group
            "
                    >
                        <LogOut className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
