import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { UserRole } from '@prisma/client';

import { getCurrentUser } from '@/lib/auth-utils';
import { WorkspaceClientLayout } from './WorkspaceClientLayout';

interface WorkspaceLayoutProps {
  workspaceId: string;
  workspaceName: string;
  userRole: UserRole;
  children: ReactNode;
}

export async function WorkspaceLayout({
  workspaceId,
  workspaceName,
  userRole,
  children,
}: WorkspaceLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    // Passing necessary props down to the Client Component
    <WorkspaceClientLayout 
        user={user}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        userRole={userRole}
      >
        {children}
    </WorkspaceClientLayout>
  );
}