import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ReadOnlyEditableWrapper } from '@/components/editor/ReadOnlyEditableWrapper';

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
        <WorkspaceLayout workspaceId={workspaceId} workspaceName={workspaceName} userRole={userRole}>
            <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
                    <span className="text-white font-medium truncate max-w-[220px]">
                        {workspaceName}
                    </span>
                    <span className="hidden md:inline text-gray-500">/</span>
                    <span className="text-indigo-400 font-semibold truncate max-w-[260px]">
                        {page.title}
                    </span>
                </div>

                <div className="flex gap-2 text-sm flex-wrap">
                    <Link
                        href={`/dashboard/workspace/${workspaceId}/pages`}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-700/40 px-3 py-1.5 text-neutral-200 hover:bg-neutral-800 transition"
                    >
                        All Pages
                    </Link>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-700/40 px-3 py-1.5 text-neutral-200 hover:bg-neutral-800 transition"
                    >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <ReadOnlyEditableWrapper page={page} workspaceId={workspaceId} canEdit={canEdit} />
        </WorkspaceLayout>

    );
}