import { z } from 'zod'

export const CreateWorkspaceSchema = z.object({
    name: z.string()
        .min(3, { message: "Workspace name must be at least 3 characters." })
        .max(50, { message: "Workspace name must not exceed 50 characters." })
        .trim(),
});

// export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;