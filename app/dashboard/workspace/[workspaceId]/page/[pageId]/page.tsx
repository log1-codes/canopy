import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { ReadOnlyEditableWrapper } from '@/components/editor/ReadOnlyEditableWrapper';

interface EditorRouteProps {
    params: Promise<{
        workspaceId: string;
        pageId: string;
    }>;
}

export default async function EditorRoute({ params }: EditorRouteProps) {
    const { workspaceId, pageId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/login');
    const userId = session.user.id;

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
        <WorkspaceLayout workspaceId={workspaceId} workspaceName={workspaceName} userRole={userRole}>
            <ReadOnlyEditableWrapper page={page} workspaceId={workspaceId} canEdit={canEdit} />
        </WorkspaceLayout>
    );
}