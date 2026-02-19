import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, context: {
    params: Promise<{ id: string }
    >
}) {
    const { id } = await context.params;

    try {
        const fullSession = await getServerSession(authOptions);
        if (!fullSession || !fullSession.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = fullSession.user.id;

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
                createdAt: 'asc',
            },
        });

        return NextResponse.json(pages, { status: 200 });

    } catch (error) {
        console.error('[API/PAGES/HIERARCHY/GET] Error fetching pages:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}