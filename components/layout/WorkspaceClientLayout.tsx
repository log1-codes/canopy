'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import Sidebar from '../dashboard/sidebar/SidebarClient';
import { useSignOut } from '@/hooks/useSignOut';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';
import SharingModal from '@/components/sharingModal';
import { ArrowLeft, Compass } from 'lucide-react';

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
          <header className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 bg-neutral-900/90 backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackNavigate}
                className="cursor-pointer text-neutral-400 hover:text-white h-8 w-8 flex-shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-sm font-semibold text-white truncate max-w-[200px]">
                  {workspaceName}
                </h1>
                <span className="text-xs uppercase tracking-wide text-indigo-400/80 font-medium px-1.5 py-0.5 bg-indigo-500/10 rounded">
                  {userRole}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!isOnWorkspacePages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoToPages}
                  className="text-neutral-400 hover:text-white text-xs h-8"
                  title="View all pages"
                >
                  <Compass className="h-3.5 w-3.5 mr-1" />
                  Pages
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer border-indigo-600/40 text-indigo-200 hover:bg-indigo-600/10 text-xs h-8"
                onClick={handleShareClick}
              >
                Share Access
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-neutral-400 hover:text-white text-xs h-8"
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