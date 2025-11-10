'use client';
import Link from 'next/link';
import { Home, NotebookText, Star, Trash2 } from 'lucide-react';
import { UserRole } from '@prisma/client';

interface SidebarProps {
  workspaceName: string;
  userRole: UserRole;
}

export function Sidebar({ workspaceName, userRole }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4 flex flex-col justify-between">
      
      <div className="space-y-6">
        <div className="text-2xl font-extrabold text-white mb-6">
          Canopy
        </div>
        
        <nav className="space-y-2">
          <SidebarLink href="/dashboard" icon={Home} label="Dashboard" />
          <SidebarLink href={`/workspace/${workspaceName}/index`} icon={NotebookText} label="All Pages" active />
        </nav>

        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Workspace Tools</p>
          <SidebarLink href="/favorites" icon={Star} label="Favorites" />
          <SidebarLink href="/trash" icon={Trash2} label="Trash" />
        </div>
      </div>
      
      <div className="text-sm text-gray-400 border-t border-gray-700 pt-4">
        Logged in as: User Name
      </div>
    </aside>
  );
}

const SidebarLink = ({ href, icon: Icon, label, active = false }: any) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 
                ${active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </Link>
);