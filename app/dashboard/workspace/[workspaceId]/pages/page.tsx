
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageList } from '@/components/workspace /PageList';
import { EmptyState } from '@/components/workspace /EmptyState';
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout"
interface WorkspacePagesPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}
export const metadata : Metadata ={
        title: 'Workspace Pages  | Canopy',
        description:'Workspace Pages Desciption' ,
        robots:{
            index:false ,
            follow:false
        }
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
    const canCreatePages = role === UserRole.OWNER;
    const rootPages = workspace.pages || []; 
    const firstPage = rootPages[0];

    const pageCount = await prisma.page.count({
        where: { workspaceId: workspaceId },
    });

    return (
        <WorkspaceLayout 
            workspaceId={workspaceId}
            workspaceName={workspace.name}
            userRole={role}
        >
            <div className="p-8  bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50  md:p-10 max-w-7xl mx-auto">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700/40 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
            
                    <div className="flex flex-wrap gap-2">
                        {firstPage ? (
                            <Link
                                href={`/dashboard/workspace/${workspaceId}/page/${firstPage.id}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-indigo-600/50 px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-500/10"
                            >
                                Go to "{firstPage.title}"
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span className="text-sm text-neutral-400">
                                Create a page to start navigating within this workspace.
                            </span>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl font-bold  mb-6">
                    {workspace.name} <span className=" text-xl">({pageCount} Total Pages)</span>
                </h1>

                {rootPages.length === 0 ? (
                    // A. Empty State
                    <EmptyState
                        workspaceId={workspaceId}
                        canCreatePages={canCreatePages}
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
