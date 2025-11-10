"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"; // To handle redirection
import { Loader2 } from "lucide-react"; // For loading spinner
import { useToast } from "@/components/ui/toast-provider";
interface NewWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; // Changed type to boolean for more flexibility
}

export default function NewWorkspaceModal({ open, onOpenChange }: NewWorkspaceModalProps) {
    const [workspaceName, setWorkspaceName] = useState(""); // Default to empty string for input
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter(); // Initialize router

    const handleCreate = async () => {
        // 1. Basic Client-side Validation
        if (!workspaceName.trim()) {
            showToast("Workspace name cannot be empty.");
            return;
        }

        if (workspaceName.trim().length < 3) {
            showToast("Workspace name must be at least 3 characters.");
            return;
        }

        if (workspaceName.trim().length > 50) {
            showToast("Workspace name must not exceed 50 characters.");
            return;
        }

        setIsLoading(true); // Start loading

        try {
            // 2. Call your API Route
            const response = await fetch('/api/workspaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: workspaceName.trim() }), // Send trimmed name
            });

            // 3. Handle API Response
            if (response.ok) {
                const newWorkspace = await response.json();
                showToast(`Success! Workspace "${newWorkspace.name} created.`);
                setWorkspaceName(""); // Clear input
                onOpenChange(false); // Close modal
                router.push(`/workspace/${newWorkspace.id}/pages`); // Redirect to the new workspace's page
                router.refresh(); // Refresh current route to fetch new data if needed (e.g., sidebar list of workspaces)

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Failed to create workspace.";
                const validationErrors = errorData.errors?.name?.[0]; // Get specific error for 'name' if any

                showToast(errorMessage);
            }

        } catch (error) {
            console.error("Client-side error creating workspace:", error);
            showToast("Could not connect to the server. Please try again.");
        } finally {
            setIsLoading(false); // End loading
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
                        className="bg-neutral-800 text-white border-neutral-700 focus:ring-indigo-600 focus:ring-offset-neutral-900" // Adjusted colors
                        disabled={isLoading} // Disable input while loading
                    />

                    <Button
                        onClick={handleCreate}
                        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading} // Disable button while loading
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