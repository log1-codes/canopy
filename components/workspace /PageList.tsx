import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListTodo } from 'lucide-react';

interface PageListProps {
  workspaceId: string;
  rootPages: any[]; 
  userRole: UserRole;
}

export function PageList({ workspaceId, rootPages, userRole }: PageListProps) {
  const isWritable = (userRole === UserRole.OWNER || userRole === UserRole.EDITOR);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-2xl font-semibold text-foreground">Root Pages ({rootPages.length})</h2>
        {isWritable && (
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Page
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {rootPages.map((page) => (
          <div key={page.id} className="flex items-center justify-between p-4 bg-card rounded-md border border-border hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <ListTodo className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{page.title}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(page.updatedAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}