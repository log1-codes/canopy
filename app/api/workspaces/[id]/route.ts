import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, context : { params:Promise< { id: string } > }) {
    try {
        const userSession = await getCurrentUser();
        if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ message: 'User ID not found in session. Authentication configuration error.' }, { status: 500 });
        }

        const { id } = await context.params;
        console.log("Params received:", context.params);

        if (!id) {
            return NextResponse.json({ error: "Workspace ID missing" }, { status: 400 });
          }
          
        const body = await req.json();
        const { name, description } = body; 

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid workspace name" }, { status: 400 });
        }

        // Check ownership or access level
        const access = await prisma.workspaceAccess.findFirst({
            where: {
                workspaceId: id,
                userId: userId,
                role: "OWNER",
            },
        });

        if (!access) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedWorkspace = await prisma.workspace.update({
            where: { id },
            data: {
                name,
                description: description ?? undefined,
            },
        });

        return NextResponse.json({ success: true, workspace: updatedWorkspace });
    } catch (error) {
        console.error("Error renaming workspace:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const userSession = await getCurrentUser();
      if (!userSession)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;
      const { id } = await context.params;
  
      // Ensure the user is the OWNER
      const access = await prisma.workspaceAccess.findFirst({
        where: {
          workspaceId: id,
          userId,
          role: "OWNER",
        },
      });
  
      if (!access)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
      // 🔥 Delete dependent records first (order matters)
      await prisma.$transaction([
        prisma.workspaceAccess.deleteMany({ where: { workspaceId: id } }),
        prisma.page.deleteMany({ where: { workspaceId: id } }),
        prisma.workspace.delete({ where: { id } }),
      ]);
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  