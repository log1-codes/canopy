'use client';
import { Search, Bell, Menu, Settings } from 'lucide-react';
import { UserRole } from '@prisma/client'; 
import { Button } from '@/components/ui/button';

interface TopBarProps {
  workspaceName: string;
  userRole: UserRole;
}

export function TopBar({ workspaceName, userRole }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6 shadow-md">
      
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white truncate max-w-xs">
          {workspaceName}
        </h1>
        <span className="text-xs font-medium text-indigo-400 uppercase">
          {userRole}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Search pages..."
            className="w-64 rounded-lg bg-gray-800 border border-gray-700 py-2 pl-10 pr-4 text-sm text-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-400 hover:text-white" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}