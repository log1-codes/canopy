import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-utils";
import DashboardClient from "../components/dashboard/DashBoardClient";

export const metadata : Metadata = {
  title: 'Dashboard | Canopy',
  description:'Access your canopy dashboard here',
  robots:{
    index:false,
    follow:false
  }
}
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
