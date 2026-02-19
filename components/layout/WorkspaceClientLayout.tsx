'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import Sidebar from '../dashboard/sidebar/SidebarClient';
import { useSignOut } from '@/hooks/useSignOut';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';
import SharingModal from '@/components/sharingModal';
import { ArrowLeft, Compass, Home } from 'lucide-react';

interface WorkspaceClientLayoutProps {
  user: { name: string; email: string; avatarInitials: string };
  workspaceId: string;
  workspaceName: string;
  userRole: UserRole;
  children: ReactNode;
}

export function WorkspaceClientLayout({
  user,
  workspaceId,
  workspaceName,
  userRole,
  children,
}: WorkspaceClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const handleSignOut = useSignOut();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const isOwner = userRole === UserRole.OWNER;
  const isOnWorkspacePages = pathname?.includes(`/workspace/${workspaceId}/pages`) ?? false;

  const handleShareClick = () => {
    if (!isOwner) {
      showToast('Only workspace owners can manage sharing.', 'warning', 'top-right');
    }
    setIsSharingModalOpen(true);
  };

  const handleBackNavigate = () => {
    router.back();
  };

  const handleGoToPages = () => {
    router.push(`/dashboard/workspace/${workspaceId}/pages`);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          onLogout={handleSignOut}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          workspaceId={workspaceId}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex flex-wrap md:flex-nowrap md:items-center md:justify-between
                   px-6 py-4 h-auto border-b border-white/10 bg-neutral-900/90 
                   backdrop-blur-md">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigate}
                className="cursor-pointer text-neutral-50 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToPages}
                disabled={isOnWorkspacePages}
                className="text-neutral-300 hover:text-white disabled:text-neutral-500"
              >
                <Compass className="h-4 w-4" />
                Workspace Pages
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToDashboard}
                className="cursor-pointer text-neutral-50 hover:text-white"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </div>

            <div className="flex flex-col select-none  min-w-[220px]">
              <p className="text-lg font-semibold text-white truncate">{workspaceName}</p>
              <p className="text-xs uppercase tracking-wide text-indigo-300">{userRole}</p>
            </div>

            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer border-indigo-600/40 text-indigo-200 hover:bg-indigo-600/10"
                onClick={handleShareClick}
              >
                Share Access
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-neutral-50 hover:text-white"
                onClick={handleSignOut}
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <SharingModal
        open={isSharingModalOpen}
        onOpenChange={setIsSharingModalOpen}
        workspaceId={workspaceId}
        isOwner={isOwner}
      />
    </>
  );
}