import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const userSession = await getCurrentUser();

        if (!userSession) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { message: "User ID not found in the session. Authentication configuration error." },
                { status: 500 }
            );
        }

        // Fetch all workspaces where the user has access (owner or member)
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
            id:ws.id,
            title: ws.name,
            description : ws.description,
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
            { message: "Internal Server Error", error: String(error) },
            { status: 500 }
        );
    }
}