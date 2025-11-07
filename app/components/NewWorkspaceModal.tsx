"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
interface NewWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function NewWorkspaceModal({ open, onOpenChange }: NewWorkspaceModalProps) {
    const [workspaceName, setWorkspaceName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleCreate = async () => {

        if (!workspaceName.trim()) {
            showToast("Workspace name cannot be empty.", "error", "top-right");
            return;
        }

        if (workspaceName.trim().length < 3) {
            showToast("Workspace name must be at least 3 characters.", "error", "top-right");
            return;
        }

        if (workspaceName.trim().length > 50) {
            showToast("Workspace name must not exceed 50 characters.", "error", "top-right");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/workspace/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: workspaceName.trim() }),
            });


            if (response.ok) {
                const newWorkspace = await response.json();
                showToast(`Workspace "${newWorkspace.name}" created.`, "success", "top-right");
                setWorkspaceName("");
                onOpenChange(false);
                router.push(`/workspace/${newWorkspace.id}`);
                router.refresh();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Failed to create workspace.";
                const validationErrors = errorData.errors?.name?.[0];

                showToast(` ${validationErrors} || ${errorMessage}`, "error", "top-right");
            }

        } catch (error) {
            console.error("Client-side error creating workspace:", error);
            showToast("Could not connect to the server. Please try again.", "error", "top-right");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Create New Workspace</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <Input
                        placeholder="Workspace name"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="bg-neutral-800 text-white border-neutral-700 focus:ring-indigo-600 focus:ring-offset-neutral-900"
                        disabled={isLoading}
                    />

                    <Button
                        onClick={handleCreate}
                        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Workspace"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}