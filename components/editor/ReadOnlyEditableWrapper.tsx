'use client';
import { EditorComponent } from './EditorComponent';
interface Props {
    page: {
        id: string;
        title: string;
        content: any;
        updatedAt: Date;
    };
    workspaceId: string;
    canEdit: boolean;
}

export function ReadOnlyEditableWrapper({ page, workspaceId, canEdit }: Props) {
    return (
        <EditorComponent
            initialData={page}
            isEditable={canEdit}
            workspaceId={workspaceId}
        />
    );
}