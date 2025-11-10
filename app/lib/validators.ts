import { z } from 'zod'

export const CreateWorkspaceSchema = z.object({
    name: z.string()
        .min(3, { message: "Workspace name must be at least 3 characters." })
        .max(50, { message: "Workspace name must not exceed 50 characters." })
        .trim(),
});

export const CreatePageSchema = z.object({
    workspaceId: z.string().cuid(),
    parentId: z.string().cuid().nullable().optional(),
    title: z.string()
        .min(1, { message: "page title can't be empty" })
        .max(255, { message: "Page title is too long." })
        .trim()
})