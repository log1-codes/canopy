import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout'; // Re-use the existing layout
import { EditorComponent } from '@/app/components/editor/EditorComponent';
interface EditorRouteProps {
  params: Promise< {
    workspaceId: string;
    pageId: string;
  }>;
}

export default async function EditorRoute({ params }: EditorRouteProps) {
  const { workspaceId, pageId } =await  params;

  // --- 1. Authentication & User ID Retrieval ---
  const fullSession = await getServerSession(authOptions);
  
  if (!fullSession || !fullSession.user?.id) {
    redirect('/login');
  }
  const userId = fullSession.user.id; 

  // --- 2. Combined Authorization and Page Data Fetching ---
  
  const [access, page] = await prisma.$transaction([
    // Check user's role in the workspace
    prisma.workspaceAccess.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspaceId,
          userId: userId,
        },
      },
      select: { 
        role: true,
        workspace: {
          select: { name: true }
        }
      },
    }),
    
    prisma.page.findUnique({
      where: {
        id: pageId,
        workspaceId: workspaceId, 
      },
      select: {
        id: true,
        title: true,
        content: true, 
        updatedAt: true,
      },
    }),
  ]);

  if (!access || !page) {
    redirect(`/workspace/${workspaceId}/pages?error=PageNotFoundOrAccessDenied`);
  }

  const userRole = access.role;
  const workspaceName = access.workspace.name;
  const isEditable = (userRole === UserRole.OWNER || userRole === UserRole.EDITOR);

  return (
    <WorkspaceLayout workspaceName={workspaceName} userRole={userRole}>
      <EditorComponent
        initialData={{
          id: page.id,
          title: page.title,
          content: page.content as any,
          updatedAt: page.updatedAt,
        }}
        isEditable={isEditable}
        workspaceId={workspaceId}
      />
    </WorkspaceLayout>
  );
}