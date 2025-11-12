import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReadOnlyEditableWrapper } from '@/app/components/editor/ReadOnlyEditableWrapper';

interface EditorRouteProps {
  params: Promise<{
    workspaceId: string;
    pageId: string;
  }>;
}

export default async function EditorRoute({ params }: EditorRouteProps) {
  const { workspaceId, pageId } = await params;

  // --- Authentication ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  // --- Fetch access + page ---
  const [access, page] = await prisma.$transaction([
    prisma.workspaceAccess.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      select: {
        role: true,
        workspace: { select: { name: true } },
      },
    }),
    prisma.page.findUnique({
      where: { id: pageId, workspaceId },
      select: { id: true, title: true, content: true, updatedAt: true },
    }),
  ]);

  if (!access || !page) {
    redirect(`/dashboard/workspace/${workspaceId}/pages?error=not_found`);
  }

  const userRole = access.role;
  const workspaceName = access.workspace.name;
  const canEdit = userRole === UserRole.OWNER || userRole === UserRole.EDITOR;

  return (
    <WorkspaceLayout workspaceName={workspaceName} userRole={userRole}>
      {/* <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Link
            href={`/dashboard/workspace/${workspaceId}/pages`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>

          <span className="text-gray-500">/</span>

          <span className="text-white font-medium truncate max-w-[180px]">
            {workspaceName}
          </span>

          <span className="text-gray-500">/</span>

          <span className="text-indigo-400 font-medium truncate max-w-[200px]">
            {page.title}
          </span>
        </div>
      </div> */}


      {/* --- ReadOnly + Edit Toggle Wrapper --- */}
      <ReadOnlyEditableWrapper
        page={page}
        workspaceId={workspaceId}
        canEdit={canEdit}
      />
    </WorkspaceLayout>
  );
}
