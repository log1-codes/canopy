import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { UserRole } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth-utils';
import { CreateWorkspaceSchema } from '@/app/lib/validators';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function POST(req: Request) {
  try {
    const userSession = await getCurrentUser();

    if (!userSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
        return NextResponse.json({ message: 'User ID not found in session. Authentication configuration error.' }, { status: 500 });
    }


    const body = await req.json();
    const validatedFields = CreateWorkspaceSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid input data.' },
        { status: 400 }
      );
    }

    const { name } = validatedFields.data;

    const newWorkspace = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: name,
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
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
