import WorkspaceClient, { Workspace } from "./workspace-grid-client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface WorkspaceGridProps {
  user: string;
}

export default async function WorkspaceGridServer({ user }: WorkspaceGridProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let workspaces: Workspace[] = [];

  if (userId) {
    try {
      const rawWorkspaces = await prisma.workspace.findMany({
        where: {
          OR: [
            { ownerId: userId },
            {
              accesses: {
                some: { userId: userId },
              },
            },
          ],
        },
        include: {
          _count: {
            select: { pages: true },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      workspaces = rawWorkspaces.map((ws) => ({
        id: ws.id,
        title: ws.name,
        description: ws.description ?? "",
        pages: ws._count.pages,
        updated: ws.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back, {user}! 👋
        </h1>
        <p className="text-gray-400">
          Here are all your accessible workspaces
        </p>
      </div>
      <WorkspaceClient workspaces={workspaces} />
    </div>
  );
}