import React from "react";
import { getCurrentUser } from "@/lib/auth-utils"; 
import { Menu, Home, FileText, Heart, Trash2 } from "lucide-react";
import SidebarProfileMenu from "./SidebarProfileMenu"; 
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
const NavLink = ({ icon: Icon, label, active = false, isOpen }: any) => {
    return (
        <button
          className={`w-full flex items-center py-2 rounded-lg transition-colors border 
            ${
              active
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                : "text-neutral-400 bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-indigo-600 hover:text-white"
            } ${
              isOpen 
                ? "px-3 gap-3 justify-start" 
                : "justify-center"
            }`
          }
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{label}</span>}
        </button>
      );
}

interface SidebarServerProps {
  isOpen: boolean;
  onToggle: () => void; 
  onLogout: () => void;
 }


const SidebarServer = async ({ isOpen, onToggle, onLogout }: SidebarServerProps) => {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div
      className={`hidden md:flex flex-col h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 border-r border-white/[0.04] text-neutral-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20" 
      }`}
    >
      {/* Logo / Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.04]">
        {isOpen && <h1 className="text-xl font-extrabold text-white">Canopy</h1>}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

     
    
      {/* New Workspace Button Placeholder (Matching previous code) */}
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

      {/* User Profile (Client Component) */}
      <SidebarProfileMenu user={user} isOpen={isOpen} onLogout={onLogout} />
    </div>
  );
};

export default SidebarServer;