'use client';

import { useState, type ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SidebarClient from '@/app/components/dashboard/sidebar/SidebarClient';
import Topbar from '@/app/components/dashboard/topbar/topbar';
import { useToast } from '@/components/ui/toast-provider';

interface WorkspaceClientLayoutProps {
  user: { name: string; email: string; avatarInitials: string };
  children: ReactNode;
}

export function WorkspaceClientLayout({ user, children }: WorkspaceClientLayoutProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="flex h-screen">
      <SidebarClient onLogout={handleSignOut} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Topbar onLogout={handleSignOut} user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} /> */}
        <main className="flex-1 bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}