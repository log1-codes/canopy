import { getCurrentUser } from "@/lib/auth-utils";
import DashboardClient from "../components/dashboard/DashBoardClient";
const DashboardServer = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
      <DashboardClient user={user} initialSidebarState={true} />
  );
};

export default DashboardServer;
