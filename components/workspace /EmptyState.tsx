'use client';

import { FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import NewPageModal from '../page/NewPageModal'; 

interface EmptyStateProps {
  workspaceId: string;
  canCreatePages: boolean;
  workspaceName: string;
}

export function EmptyState({ workspaceId, canCreatePages, workspaceName }: EmptyStateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 border border-border rounded-xl bg-card">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-foreground">
        Welcome to &ldquo;{workspaceName}&rdquo;
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        This workspace is currently empty. Start by creating your first page to begin organizing your thoughts and collaborating with your team.
      </p>
      
      {canCreatePages ? (
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Your First Page
        </Button>
      ) : (
        <p className="text-destructive text-sm">
          You have View-Only access. Contact the Owner to create new pages.
        </p>
      )}

      <NewPageModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        workspaceId={workspaceId}
        parentId={null} 
      />
    </div>
  );
}