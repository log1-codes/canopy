import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Retrieves the currently authenticated user's info and ID.
 * Use this single function instead of calling both getCurrentUser() and getServerSession() separately.
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
    id: session.user.id,
    name: userName,
    email: session.user.email || "unknown@example.com",
    avatarInitials: getInitials(userName),
  };
}

/**
 * @deprecated Use getAuthenticatedUser() instead — it returns both user info and ID.
 */
export async function getCurrentUser() {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    avatarInitials: user.avatarInitials,
  };
}
