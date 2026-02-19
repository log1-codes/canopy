import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { UserRole } from "@prisma/client";

import { UpdateAccessSchema } from "@/app/lib/validators";
import { RemoveAccessSchema } from "@/app/lib/validators";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const fullSession = await getServerSession(authOptions);
        if (!fullSession?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = fullSession.user.id;
        const currentAccess = await prisma.workspaceAccess.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId
                }
            },
            select: { role: true }
        });

        if (!currentAccess) {
            return NextResponse.json({ message: 'Access denied.' }, { status: 403 });
        }

        const collaborators = await prisma.workspaceAccess.findMany({
            where: { workspaceId: id },
            select: {
                id: true,
                role: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json({
            canManage: currentAccess.role === UserRole.OWNER,
            members: collaborators.map((entry) => ({
                id: entry.id,
                role: entry.role,
                user: entry.user,
                isSelf: entry.user.id === userId
            }))
        });

    } catch (error) {
        console.error('[API/ACCESS/GET] Error fetching workspace access:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const fullSession = await getServerSession(authOptions);
        if (!fullSession || !fullSession.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const currentUserId = fullSession.user.id;
        if (!currentUserId) {
            return NextResponse.json({ message: 'UserID not found, Relogin Please' }, { status: 401 });
        }
        const ownerAccess = await prisma.workspaceAccess.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: currentUserId
                }
            }
        })
        if (ownerAccess?.role !== UserRole.OWNER) {
            return NextResponse.json({ message: 'Only the Owner can manage sharing settings.' }, { status: 403 });
        }
        const body = await req.json();
        const validatedFields = UpdateAccessSchema.safeParse(body);
        if (!validatedFields.success) {
            return NextResponse.json(
                { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid input data.' },
                { status: 400 }
            );
        }
        const { email: targetEmail, role: newRole } = validatedFields.data;
        const targetUser = await prisma.user.findUnique({
            where: { email: targetEmail },
            select: { id: true, name: true },
        });

        if (!targetUser) {
            return NextResponse.json({ message: `User with email ${targetEmail} not found.` }, { status: 404 });
        }

        if (targetUser.id === currentUserId) {
            return NextResponse.json({ message: 'Cannot modify your own Owner access.' }, { status: 400 });
        }

        const accessEntry = await prisma.workspaceAccess.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: targetUser.id,
                },
            },
            update: {
                role: newRole,
            },
            create: {
                workspaceId: id,
                userId: targetUser.id,
                role: newRole,
            },
            select: { id: true, role: true },
        });
        return NextResponse.json({
            message: `User ${targetUser.name || 'N/A'} access updated to ${newRole}.`,
            accessId: accessEntry.id
        }, { status: 200 });


    } catch (error) {
        console.error('[API/ACCESS/POST] Error updating access:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const fullSession = await getServerSession(authOptions);
        if (!fullSession?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const ownerId = fullSession.user.id;
        const ownerAccess = await prisma.workspaceAccess.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: ownerId
                }
            }
        });

        if (ownerAccess?.role !== UserRole.OWNER) {
            return NextResponse.json({ message: 'Only the Owner can remove collaborators.' }, { status: 403 });
        }

        const body = await req.json();
        const parsed = RemoveAccessSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors, message: 'Invalid input data.' },
                { status: 400 }
            );
        }

        const targetUserId = parsed.data.userId;
        if (targetUserId === ownerId) {
            return NextResponse.json({ message: 'Owners cannot remove their own access.' }, { status: 400 });
        }

        const targetAccess = await prisma.workspaceAccess.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: targetUserId
                }
            }
        });

        if (!targetAccess) {
            return NextResponse.json({ message: 'Collaborator not found for this workspace.' }, { status: 404 });
        }

        if (targetAccess.role === UserRole.OWNER) {
            return NextResponse.json({ message: 'Cannot remove another owner via this action.' }, { status: 400 });
        }

        await prisma.workspaceAccess.delete({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: targetUserId
                }
            }
        });

        return NextResponse.json({ message: 'Access removed successfully.' }, { status: 200 });
    } catch (error) {
        console.error('[API/ACCESS/DELETE] Error removing access:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}