import WorkspaceClient, { Workspace } from "./workspace-grid-client"; // Import the client component and types

const mockWorkspaces: Workspace[] = [
  {
    id: 1,
    title: "Team Project Alpha",
    description: "Collaborative project for Q1 planning",
    pages: 42,
    updated: "2 hours ago",
  },
  {
    id: 2,
    title: "Design System",
    description: "Shared design documentation and components",
    pages: 28,
    updated: "5 hours ago",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Campaign strategy and content planning",
    pages: 15,
    updated: "1 day ago",
  },
  {
    id: 4,
    title: "Engineering Notes",
    description: "Technical documentation and architecture",
    pages: 67,
    updated: "3 hours ago",
  },
  {
    id: 5,
    title: "Product Roadmap",
    description: "Feature planning and release schedule",
    pages: 34,
    updated: "12 hours ago",
  },
  {
    id: 6,
    title: "Team Handbook",
    description: "Company policies and team guidelines",
    pages: 21,
    updated: "1 week ago",
  },
];
interface workspaceGridProps {
    user: string;
}
export default function WorkspaceGridServer({user}: workspaceGridProps) {
  return (
    <div className=" p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user}! 👋</h1>
        <p className="text-gray-400">Here are all your accessible workspaces</p>
      </div>
      <WorkspaceClient workspaces={mockWorkspaces} />
    </div>
  );
}