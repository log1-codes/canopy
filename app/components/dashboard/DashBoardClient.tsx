"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import SidebarClient from "./sidebar/SidebarClient";
import WorkspaceGrid from "./workspace/workspace-grid-server";
import Topbar from "./topbar/topbar";
interface DashboardClientProps {
  user: { name: string; email: string; avatarInitials: string } | null;
  initialSidebarState: boolean;
}

const DashboardClient = ({ user, initialSidebarState }: DashboardClientProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarState);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      showToast("Signing out...", "info", "top-right");

      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      showToast("Signed out successfully!", "success", "top-right");

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error("Sign out error:", error);
      showToast("Failed to sign out. Please try again.", "error", "top-right");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50">
        <div className="flex h-screen overflow-hidden justify-center items-center">
          <h2 className="text-white text-xl">Please log in to access the dashboard</h2>
        </div>
      </div>
    );
  }

  return (
      <div className="flex h-screen overflow-hidden">
        <SidebarClient
        onLogout={()=>handleSignOut()}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col  overflow-hidden">
          {/* Top Bar */}
          <Topbar onLogout={()=>handleSignOut()} user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-950">
            <WorkspaceGrid user={user.name} />
          </main>
        </div>
      </div>
  );
};

export default DashboardClient;
