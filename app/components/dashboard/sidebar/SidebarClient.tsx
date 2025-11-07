"use client";

import type React from "react";
import {
  Plus,
  Home,
  FileText,
  Heart,
  Trash2,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: { name: string; email: string; avatarInitials: string } | null;
  onLogout: () => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  user,
  onLogout,
}: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return null;
  }

  const userName = user.name;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div
        className={`hidden md:flex flex-col h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 border-r border-white/[0.04] transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.04]">
          {isOpen && <h1 className="text-xl font-bold text-white">Canopy</h1>}
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-3 space-y-4">
          <NavLink icon={Home} label="Dashboard" active isOpen={isOpen} />
          <NavLink icon={FileText} label="All Pages" isOpen={isOpen} />
          <NavLink icon={Heart} label="Favorites" isOpen={isOpen} />
          <NavLink icon={Trash2} label="Trash" isOpen={isOpen} />
        </nav>

        {/* NEW WORKSPACE BUTTON */}
        <div className="p-3 border-t border-white/[0.04]">
          <Button
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all h-10 ${
              isOpen ? "justify-start gap-3" : "justify-center"
            }`}
          >
            <Plus className="w-5 h-5" />
            {isOpen && "New Workspace"}
          </Button>
        </div>

        {/* USER DROPDOWN */}
        <div
          ref={dropdownRef}
          className={`p-3 border-t border-white/[0.04] flex relative ${
            isOpen ? "gap-3 items-center" : "flex-col items-center gap-2"
          }`}
        >
          {/* AVATAR BUTTON */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`rounded-full ${
              isOpen ? "p-0" : "p-0.5 hover:bg-neutral-800"
            }`}
          >
            <Avatar className={isOpen ? "h-12 w-12" : "h-8 w-8"}>
              <AvatarFallback className="text-white font-medium text-lg bg-gradient-to-br from-indigo-600 to-indigo-800">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
          </button>

          {isOpen && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          )}

          {/* DROPDOWN MENU */}
          {dropdownOpen && (
            <div
              className={`absolute z-30 w-48 rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-2xl 
                ${
                  isOpen
                    ? "bottom-full mb-2 left-0"
                    : "bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                }`}
            >
              <div className="px-3 py-2 border-b border-neutral-700">
                <p className="text-sm font-semibold text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                Profile
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface NavLinkProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  isOpen: boolean;
}

function NavLink({ icon: Icon, label, active = false, isOpen }: NavLinkProps) {
  return (
    <button
      className={`w-full flex items-center py-2 rounded-lg transition-colors border ${
        active
          ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
          : "text-neutral-400 bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-indigo-600 hover:text-indigo-400"
      } ${isOpen ? "px-3 gap-3 justify-start" : "justify-center"}`}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          active ? "text-white" : "text-neutral-400 group-hover:text-indigo-400"
        }`}
      />
      {isOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
