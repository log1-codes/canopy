import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { CreateWorkspaceSchema } from '@/app/lib/validators';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const body = await req.json();
    const validatedFields = CreateWorkspaceSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid input data.' },
        { status: 400 }
      );
    }

    const { name, desc } = validatedFields.data;

    const newWorkspace = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: name,
          description: desc,
          ownerId: userId,
        },
      });

      await tx.workspaceAccess.create({
        data: {
          workspaceId: workspace.id,
          userId: userId,
          role: UserRole.OWNER,
        },
      });

      return workspace;
    });
    return NextResponse.json(newWorkspace, { status: 201 });

  } catch (error) {
    console.error('[API/WORKSPACES/POST] Error creating workspace:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
