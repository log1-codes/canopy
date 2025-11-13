import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, context: {
    params: Promise<{ id : string }
    >
}) {
    //workspace-id
    const { id } = await context.params;

    try {
        // 1. Authentication & Authorization Check
        const fullSession = await getServerSession(authOptions);
        if (!fullSession || !fullSession.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = fullSession.user.id;

        // Check if user has ANY access to the workspace
        const access = await prisma.workspaceAccess.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: userId,
                },
            },
            select: { role: true },
        });

        if (!access) {
            return NextResponse.json({ message: 'Access denied.' }, { status: 403 });
        }

        // 2. Fetch ALL Pages in the Workspace (Flat list)
        // We fetch parentId to build the hierarchy on the client side
        const pages = await prisma.page.findMany({
            where: {
                workspaceId: id,
            },
            select: {
                id: true,
                title: true,
                parentId: true,
                icon: true,
            },
            orderBy: {
                createdAt: 'asc', // Order by creation date
            },
        });

        // 3. Success Response
        return NextResponse.json(pages, { status: 200 });

    } catch (error) {
        console.error('[API/PAGES/HIERARCHY/GET] Error fetching pages:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}