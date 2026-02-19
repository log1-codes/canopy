"use client";

import { useState, type ReactNode } from "react";
import { useSignOut } from "@/hooks/useSignOut";
import SidebarClient from "./sidebar/SidebarClient";
import Topbar from "./topbar/topbar";

interface DashboardClientProps {
  user: { name: string; email: string; avatarInitials: string } | null;
  initialSidebarState: boolean;
  workspaceContent: ReactNode;
}

const DashboardClient = ({ user, initialSidebarState, workspaceContent }: DashboardClientProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarState);
  const handleSignOut = useSignOut();

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarClient
        onLogout={() => handleSignOut()}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Topbar onLogout={() => handleSignOut()} user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-950">
          {workspaceContent}
        </main>
      </div>
    </div>
  );
};

export default DashboardClient;