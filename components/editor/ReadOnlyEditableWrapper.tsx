"use client"

import { EditorComponent } from "./EditorComponent"

interface ReadOnlyEditableWrapperProps {
    page: {
        id: string
        title: string
        content: any
        updatedAt: Date
    }
    workspaceId: string
    canEdit: boolean
}

export function ReadOnlyEditableWrapper({ page, workspaceId, canEdit }: ReadOnlyEditableWrapperProps) {
    return (
        <EditorComponent
            initialData={page}
            workspaceId={workspaceId}
            isEditable={canEdit}
        />
    )
}
