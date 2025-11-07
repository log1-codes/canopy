"use client";

import { useState } from "react";
import { LogOut, User, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarProfileMenuProps {
  user: { name: string; email: string; avatarInitials: string } | null;
  isOpen: boolean;
  onLogout: () => void; // Function passed from a higher-level client component
}

export default function SidebarProfileMenu({ user, isOpen, onLogout }: SidebarProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    // Profile Area Container
    <div
      className={`p-3 border-t border-white/[0.04] flex relative ${
        isOpen ? "gap-3 items-center" : "flex-col items-center gap-2"
      }`}
    >
      {/* 1. Avatar Button (Toggles Menu) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="cursor-pointer rounded-full p-0.5 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        <Avatar className={isOpen ? "h-10 w-10" : "h-8 w-8"}>
          {/* FIX: Ensuring high contrast background and white text is applied 
            directly to the AvatarFallback to prevent blending into the dark background.
          */}
          <AvatarFallback
            className="text-white font-medium bg-gradient-to-br from-indigo-600 to-indigo-800 text-sm"
          >
            {user.avatarInitials}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* 2. User Info (Only visible when sidebar is open) */}
      {isOpen && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
        </div>
      )}

      {/* 3. Dropdown Menu (Only visible when menuOpen is true) */}
      {menuOpen && (
        <div
          className={`absolute z-30 w-48 rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-2xl 
          ${isOpen ? "bottom-full mb-2 left-0" : "bottom-full mb-2 left-1/2 transform -translate-x-1/2"}`}
        >
          <div className="px-3 py-2 border-b border-neutral-700">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
          </div>
          
          <button
            onClick={() => {
              // Add navigation logic to /profile
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={() => {
              onLogout(); 
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}