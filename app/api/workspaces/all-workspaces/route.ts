import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = user.id;

        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        accesses: {
                            some: {
                                userId: userId
                            }
                        }
                    }
                ]
            },
            include: {
                _count: {
                    select: { pages: true }
                },
                accesses: {
                    where: { userId: userId },
                    select: { role: true }
                }
            },
            orderBy: {
                updatedAt: "desc"
            }
        });

        const transformedWorkspaces = workspaces.map(ws => ({
            id: ws.id,
            title: ws.name,
            description: ws.description,
            pages: ws._count.pages,
            updated: ws.updatedAt.toISOString(),
        }));

        return NextResponse.json(
            { workspaces: transformedWorkspaces },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching workspaces:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}