import { z } from 'zod'
import { UserRole } from '@prisma/client';
export const CreateWorkspaceSchema = z.object({
    name: z.string()
        .min(3, { message: "Workspace name must be at least 3 characters." })
        .max(50, { message: "Workspace name must not exceed 50 characters." })
        .trim(),
    desc: z.string().optional()
});

export const CreatePageSchema = z.object({
    workspaceId: z.string().cuid(),
    parentId: z.string().cuid().nullable().optional(),
    title: z.string()
        .min(1, { message: "page title can't be empty" })
        .max(255, { message: "Page title is too long." })
        .trim()
})

const TiptapNodeSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        type: z.string(),
        attrs: z.record(z.string(), z.unknown()).optional(),
        content: z.array(TiptapNodeSchema).optional(),
        marks: z.array(z.object({
            type: z.string(),
            attrs: z.record(z.string(), z.unknown()).optional(),
        })).optional(),
        text: z.string().optional(),
    })
);

const TiptapDocSchema = z.object({
    type: z.literal("doc"),
    content: z.array(TiptapNodeSchema).optional(),
});

export const UpdatePageSchema = z.object({
    title: z.string().max(255).optional(),
    content: TiptapDocSchema.optional()
})


export const UpdateAccessSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    role: z.nativeEnum(UserRole).refine(role => role !== UserRole.OWNER, {
        message: "Cannot assign or update OWNER role via this API.",
    }),
})
export const RemoveAccessSchema = z.object({
    userId: z.string().cuid({ message: "Invalid user id." }),
});