"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Menu, LogOut, User } from "lucide-react"; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {useWorkspaceStore} from '@/app/stores/workspaceStore';

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  user: { name: string; email: string; avatarInitials: string } | null;
  onLogout: () => void; 
}

export default function Topbar({ onMenuClick, user, onLogout }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const{ query , setQuery} = useWorkspaceStore();

  
  const dropdownRef = useRef<HTMLDivElement>(null); 

  const avatarInitials = user?.avatarInitials || "U";
  const userName = user?.name || "Guest";

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
  }, [dropdownRef]); 

  return (
    <header className="h-16 bg-linear-to-br from-neutral-900 to-neutral-950 text-neutral-50 px-6 flex items-center justify-between md:justify-end gap-4 md:gap-6 shadow-xl ">
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-neutral-50" />
      </button>

      <div className="hidden md:flex flex-1 items-center gap-4 ">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-50">Dashboard</h2>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="pl-10 bg-neutral-900 border border-neutral-800 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-neutral-900 h-10 rounded-md"
          />
        </div>
      </div>

      
      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-1 cursor-pointer hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-white font-medium bg-linear-to-br from-indigo-600 to-indigo-800"
            >
              {avatarInitials}
            </AvatarFallback>
          </Avatar>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-20 w-48 rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-2xl">
            <div className="px-3 py-2 border-b border-neutral-700">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
            </div>
            
            <button
              onClick={() => {
                setDropdownOpen(false);
              }}
              className="flex cursor-pointer  w-full items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => {
                onLogout(); 
                setDropdownOpen(false);
              }}
              className="flex cursor-pointer w-full items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}