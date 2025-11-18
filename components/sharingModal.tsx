"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Users } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useToast } from "./ui/toast-provider";

interface SharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  isOwner: boolean;
}

interface Collaborator {
  id: string;
  role: UserRole;
  isSelf: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function SharingModal({ open, onOpenChange, workspaceId, isOwner }: SharingModalProps) {
  const [targetEmail, setTargetEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VIEWER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Collaborator[]>([]);
  const { showToast } = useToast();

  const resetForm = () => {
    setTargetEmail("");
    setSelectedRole(UserRole.VIEWER);
  };

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;
    setIsFetchingMembers(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/access`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch collaborators.");
      }
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error("Failed to fetch collaborators", error);
      const message = error instanceof Error ? error.message : "Unable to load collaborators.";
      showToast(message, "error", "top-right");
    } finally {
      setIsFetchingMembers(false);
    }
  }, [workspaceId, showToast]);

  useEffect(() => {
    if (open) {
      fetchMembers();
    } else {
      resetForm();
    }
  }, [open, fetchMembers]);

  const handleShare = async () => {
    if (!isOwner) {
      showToast("Only workspace owners can update sharing.", "error", "top-right");
      return;
    }

    if (!targetEmail.trim()) {
      showToast("Please provide an email address.", "warning", "top-right");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail.trim(), role: selectedRole }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to update access.");
      }

      showToast("Access updated successfully!", "success", "top-right");
      await fetchMembers();
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update access.";
      showToast(message, "error", "top-right");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: string, label: string) => {
    if (!isOwner) {
      showToast("Only workspace owners can remove collaborators.", "error", "top-right");
      return;
    }

    setRemovingUserId(userId);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/access`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to remove collaborator.");
      }

      showToast(`Removed ${label} from this workspace.`, "success", "top-right");
      await fetchMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove collaborator.";
      showToast(message, "error", "top-right");
    } finally {
      setRemovingUserId(null);
    }
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (a.role === UserRole.OWNER) return -1;
      if (b.role === UserRole.OWNER) return 1;
      if (a.role === b.role) {
        return a.user.email.localeCompare(b.user.email);
      }
      return a.role.localeCompare(b.role);
    });
  }, [members]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share workspace</DialogTitle>
          <p className="text-sm text-neutral-400">
            Invite teammates by email and choose whether they can just view or also edit page content.
          </p>
        </DialogHeader>

        {!isOwner && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            You can see who has access, but only the owner can change sharing settings.
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-200">Invite by email</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="user@example.com"
              value={targetEmail}
              disabled={isSubmitting || !isOwner}
              onChange={(event) => setTargetEmail(event.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-white"
            />
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={isSubmitting || !isOwner}
            >
              <SelectTrigger className="bg-neutral-900 border border-neutral-800 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 text-white border border-neutral-800">
                <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleShare}
            disabled={!isOwner || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send invite
              </>
            )}
          </Button>
        </DialogFooter>

        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2 text-sm text-neutral-300 font-medium">
            <Users className="h-4 w-4" />
            People with access
          </div>

          <div className="max-h-56 overflow-y-auto rounded-lg border border-neutral-800/70 bg-neutral-900/60 px-3 py-2 space-y-2">
            {isFetchingMembers ? (
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading collaborators...
              </div>
            ) : sortedMembers.length === 0 ? (
              <p className="text-neutral-500 text-sm">No collaborators yet.</p>
            ) : (
              sortedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-md border border-neutral-800/50 bg-neutral-900/80 px-3 py-2 gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.user.name || member.user.email}
                      {member.isSelf && <span className="text-xs text-neutral-400"> (you)</span>}
                    </p>
                    <p className="text-xs text-neutral-500">{member.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                      {member.role}
                    </span>
                    {isOwner && !member.isSelf && member.role !== UserRole.OWNER && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                        onClick={() => handleRemoveMember(member.user.id, member.user.email)}
                        disabled={removingUserId === member.user.id}
                      >
                        {removingUserId === member.user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}