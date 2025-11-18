'use client';

import { useState, type ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import SidebarClient from '@/app/components/dashboard/sidebar/SidebarClient';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';
import SharingModal from '@/components/sharingModal';

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
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const isOwner = userRole === UserRole.OWNER;

  const handleSignOut = async () => {
    setLoading(true);
    try {
      showToast('Signing out...', 'info', 'top-right');

      await signOut({
        redirect: false,
        callbackUrl: '/login',
      });

      showToast('Signed out successfully!', 'success', 'top-right');

      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 500);
    } catch (error) {
      console.error('Sign out error:', error);
      showToast('Failed to sign out. Please try again.', 'error', 'top-right');
      setLoading(false);
    }
  };

  const handleShareClick = () => {
    if (!isOwner) {
      showToast('Only workspace owners can manage sharing.', 'warning', 'top-right');
    }
    setIsSharingModalOpen(true);
  };

  return (
    <>
      <div className="flex h-screen">
        <SidebarClient
          onLogout={handleSignOut}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          workspaceId={workspaceId}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between h-16 border-b border-white/5 bg-neutral-950/80 px-6 backdrop-blur-lg">
            <div>
              <p className="text-lg font-semibold text-white truncate max-w-xs">
                {workspaceName}
              </p>
              <p className="text-xs uppercase tracking-wide text-indigo-300">
                {userRole}
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                className="cursor-pointer text-neutral-300 hover:text-white"
                onClick={handleSignOut}
                disabled={loading}
              >
                {loading ? 'Signing out...' : 'Logout'}
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