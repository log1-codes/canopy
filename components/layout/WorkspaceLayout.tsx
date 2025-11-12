import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { UserRole } from '@prisma/client';

import { getCurrentUser } from '@/lib/auth-utils';
import { WorkspaceClientLayout } from './WorkspaceClientLayout';

interface WorkspaceLayoutProps {
  workspaceName: string;
  userRole: UserRole;
  children: ReactNode;
}

export async function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <WorkspaceClientLayout user={user}>{children}</WorkspaceClientLayout>
  );
}