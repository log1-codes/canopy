import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils'; 
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface WorkspacePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = await params;

  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect('/login');
  }
  
  const userId = (await getServerSession(authOptions))?.user?.id;
  if (!userId) {
    redirect('/login');
  }
  
  const access = await prisma.workspaceAccess.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspaceId,
        userId: userId,
      },
    },
    select: {
      role: true,
      workspace: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!access) {
    redirect('/dashboard?error=AccessDenied');
  }


  const rootPages = await prisma.page.findMany({
    where: {
      workspaceId: workspaceId,
      parentId: null, 
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 1, 
  });

  // if (rootPages.length > 0) {
  //   // Found pages: Redirect to the first page's dedicated route
  //   // The route will be /workspace/[workspaceId]/page/[pageId]
  //   redirect(`/workspace/${workspaceId}/page/${rootPages[0].id}`);
  // } else {
  //   // No pages found: Redirect to a dedicated creation page/route
  //   // This route will handle the initial page creation UI
  //   redirect(`/workspace/${workspaceId}/create-first-page`);
  // }
}