import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-utils";
import DashboardClient from "@/components/dashboard/DashBoardClient";
import WorkspaceGridServer from "@/components/dashboard/workspace/workspace-grid-server";
export const metadata: Metadata = {
    title: 'Dashboard | Canopy',
    description: 'Access your canopy dashboard here',
    robots: {
        index: false,
        follow: false
    }
}

const DashboardPage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 flex justify-center items-center">
            <h2 className="text-white text-xl">Please log in to access the dashboard</h2>
        </div>;
    }

    return (
        <DashboardClient
            user={user}
            initialSidebarState={true}
            workspaceContent={<WorkspaceGridServer user={user.name} />}
        />
    );
};

export default DashboardPage;