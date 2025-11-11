'use client';

import { useState } from 'react';
import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListTodo } from 'lucide-react';
import NewPageModal from '../page/NewPageModal';

interface PageListProps {
  workspaceId: string;
  rootPages: any[];
  userRole: UserRole;
  workspaceName: string;
}

export function PageList({ workspaceId, rootPages, userRole, workspaceName }: PageListProps) {
  const isWritable = userRole === UserRole.OWNER || userRole === UserRole.EDITOR;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Root Pages ({rootPages.length})
        </h2>

        {isWritable && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Page
          </Button>
        )}
      </div>

      {/* Page List Section */}
      {rootPages.length > 0 ? (
        <div className="space-y-3">
          {rootPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 bg-card rounded-md border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{page.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date(page.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // When no pages exist
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 border border-border rounded-xl bg-card">
          <ListTodo className="h-14 w-14 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Welcome to "{workspaceName}"
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            This workspace doesn’t have any pages yet. Start by creating your first page to begin organizing and collaborating.
          </p>

          {isWritable ? (
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
        </div>
      )}

      {/* Modal for page creation (used in both cases) */}
      <NewPageModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        workspaceId={workspaceId}
        parentId={null}
      />
    </div>
  );
}
