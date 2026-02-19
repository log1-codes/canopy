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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onLogout={() => handleSignOut()} user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto bg-linear-to-br from-neutral-900 to-neutral-950">
          {workspaceContent}
        </main>
      </div>
    </div>
  );
};

export default DashboardClient;