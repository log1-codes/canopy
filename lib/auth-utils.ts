import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0]; 
    }
    return name[0].toUpperCase(); 
  };

  const userName = session.user.name || "Anonymous"; 

  return {
    name: userName,
    email: session.user.email || "unknown@example.com", 
    avatarInitials: getInitials(userName), 
  };
}
