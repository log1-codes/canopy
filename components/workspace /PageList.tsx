'use client';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handlePageClick = (pageId: string) => {
    router.push(`/dashboard/workspace/${workspaceId}/page/${pageId}`);
  };


  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6  pb-4">
        <h2 className="text-2xl font-semibold text-white">
          Root Pages ({rootPages.length})
        </h2>

        {isWritable && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-neutral-700 hover:bg-neutral-800 text-white shadow-md"
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
            onClick={() => handlePageClick(page.id)} 
              key={page.id}
              className="flex cursor-pointer  items-center justify-between p-4 bg-neutral-800 rounded-md border border-neutral-700 
                         hover:bg-indigo-100/20 hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ListTodo className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-white">{page.title}</span>
              </div>
              <span className="text-sm text-gray-400">
                Last updated: {new Date(page.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 border border-neutral-700 rounded-xl bg-neutral-800">
          <ListTodo className="h-14 w-14 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Welcome to "{workspaceName}"
          </h2>
          <p className="text-gray-400 mb-6 max-w-md">
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
            <p className="text-red-500 text-sm">
              You have View-Only access. Contact the Owner to create new pages.
            </p>
          )}
        </div>
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
