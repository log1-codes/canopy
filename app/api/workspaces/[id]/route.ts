import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Workspace ID missing" }, { status: 400 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid workspace name" }, { status: 400 });
    }

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
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;
    const { id } = await context.params;

    const access = await prisma.workspaceAccess.findFirst({
      where: {
        workspaceId: id,
        userId,
        role: "OWNER",
      },
    });

    if (!access)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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