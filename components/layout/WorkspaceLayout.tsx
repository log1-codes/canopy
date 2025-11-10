'use client';

import { ReactNode } from 'react';
import { UserRole } from '@prisma/client';

import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
interface WorkspaceLayoutProps {
  workspaceName: string;
  userRole: UserRole;
  children: ReactNode;
}

export function WorkspaceLayout({ workspaceName, userRole, children }: WorkspaceLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-inter">
      {/* 1. Sidebar (Placeholder) */}
      <Sidebar workspaceName={workspaceName} userRole={userRole} />

      <div className="flex flex-col flex-grow">
        {/* 2. TopBar (Placeholder) */}
        <TopBar workspaceName={workspaceName} userRole={userRole} />

        {/* 3. Main Content */}
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}