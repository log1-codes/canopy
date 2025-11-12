
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { PageList } from '@/components/workspace /PageList';
import { EmptyState } from '@/components/workspace /EmptyState';
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout"
interface WorkspacePagesPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function WorkspacePagesPage({ params }: WorkspacePagesPageProps) {
    const { workspaceId } = await params;

    // --- 1. Authentication & User ID Retrieval ---
    const fullSession = await getServerSession(authOptions);

    if (!fullSession || !fullSession.user?.id) {
        redirect('/login');
    }

    const userId = fullSession.user.id;

    // --- 2. Authorization Check & Data Fetching ---
    const accessData = await prisma.workspaceAccess.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId: workspaceId,
                userId: userId,
            },
        },
        // Fetch essential workspace info and all root-level pages
        select: {
            role: true,
            workspace: {
                select: {
                    id: true,
                    name: true,
                    pages: {
                        where: {
                            parentId: null, // Only fetch top-level/root pages for the index
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                        select: {
                            id: true,
                            title: true,
                            updatedAt: true,
                            icon: true,
                            isPublished: true,
                        },
                    },
                },
            },
        },
    });

    if (!accessData || !accessData.workspace) {
        redirect('/dashboard?error=AccessDenied');
    }

    const { role, workspace } = accessData;
    const isWritable = (role === UserRole.OWNER || role === UserRole.EDITOR);
    const rootPages = workspace.pages || []; 

    const pageCount = await prisma.page.count({
        where: { workspaceId: workspaceId },
    });

    return (
        <WorkspaceLayout  workspaceName={workspace.name} userRole={role}>
            <div className="p-8  bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50  md:p-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold  mb-6">
                    {workspace.name} <span className=" text-xl">({pageCount} Total Pages)</span>
                </h1>

                {rootPages.length === 0 ? (
                    // A. Empty State
                    <EmptyState
                        workspaceId={workspaceId}
                        isWritable={isWritable}
                        workspaceName={workspace.name}
                    />
                ) : (
                    // B. Page List View
                    <PageList
                        workspaceName={workspace.name}
                        workspaceId={workspaceId}
                        rootPages={rootPages}
                        userRole={role}
                    />
                )}
            </div>
        </WorkspaceLayout>
    );
}
