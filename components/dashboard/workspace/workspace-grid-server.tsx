import WorkspaceClient, { Workspace } from "./workspace-grid-client";
import { headers } from "next/headers"; 

interface WorkspaceGridProps {
  user: string;
}

export default async function WorkspaceGridServer({ user }: WorkspaceGridProps) {
  
  const headersList =await  headers();
  const cookie = headersList.get('cookie') || '';

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/all-workspaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie, 
    },
    cache: "no-store",
  });

  let workspaces: Workspace[] = [];

  if (res.ok) {
    const data = await res.json();
    workspaces = data.workspaces || [];
  } else {
    console.error("Failed to fetch workspaces:", res.statusText);
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