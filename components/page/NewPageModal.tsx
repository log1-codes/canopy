'use client';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CreatePageSchema } from "@/app/lib/validators";
import { useToast } from "../ui/toast-provider";
interface NewPageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    parentId: string | null; 
}

export default function NewPageModal({ open, onOpenChange, workspaceId, parentId }: NewPageModalProps) {
    const [pageTitle, setPageTitle] = useState("Untitled");
    const [isLoading, setIsLoading] = useState(false);
    const {showToast } = useToast();
    const router = useRouter();

    const handleCreate = async () => {
        const trimmedTitle = pageTitle.trim();

        // 1. Client-side Validation using Zod
        const validationResult = CreatePageSchema.safeParse({
            workspaceId: workspaceId,
            parentId: parentId,
            title: trimmedTitle,
        });

        if (!validationResult.success) {
            const error = validationResult.error.flatten().fieldErrors.title?.[0] || "Invalid input.";
            showToast( error, "error", "top-right");
            return;
        }

        setIsLoading(true);

        try {
            // 2. Call the API Route
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    parentId: parentId,
                    title: trimmedTitle,
                }),
            });

            // 3. Handle API Response
            if (response.ok) {
                const newPage = await response.json();
                showToast(`Page Created!",Page "${newPage.title}" has been added.` ,'error','top-right');
                
                // Clear state, close modal, and redirect/refresh
                setPageTitle("Untitled");
                onOpenChange(false);
                
                // After creating the first page, redirect the user to the editor view for that page.
                router.push(`/workspace/${workspaceId}/page/${newPage.id}`);
                router.refresh(); 

            } else {
                const errorData = await response.json();
                showToast(`Creation Failed" ${errorData.message} || "Could not create page due to an unexpected error.` , 'error' , 'top-right');
            }

        } catch (error) {
            console.error("Client-side error creating page:", error);
            showToast("Check your connection and try again" ,"error", "top-right");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Create New Page</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <Input
                        placeholder="e.g. Project Plan, Daily Notes"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="bg-gray-800 text-white border-gray-700 focus:ring-indigo-600 focus:ring-offset-gray-900"
                        disabled={isLoading}
                    />
                </div>

                <DialogFooter>
                    <Button 
                        variant="secondary" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Page"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}