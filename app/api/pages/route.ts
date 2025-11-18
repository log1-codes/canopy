import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreatePageSchema } from '@/app/lib/validators';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // --- 1. Authentication ---
    const fullSession = await getServerSession(authOptions);

    if (!fullSession || !fullSession.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = fullSession.user.id;

    // --- 2. Validation ---
    const body = await req.json();
    const validatedFields = CreatePageSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid page data.' },
        { status: 400 }
      );
    }
    const { workspaceId, parentId, title } = validatedFields.data;

    // --- 3. Authorization (RBAC Check) ---
    const access = await prisma.workspaceAccess.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspaceId,
          userId: userId,
        },
      },
      select: { role: true },
    });

    if (!access) {
      return NextResponse.json({ message: 'Access to workspace denied.' }, { status: 403 });
    }

    const { role } = access;
    // Only owners can create new pages to keep shared editors focused on page content.
    if (role !== UserRole.OWNER) {
      return NextResponse.json(
        { message: 'Only workspace owners can create new pages.' },
        { status: 403 }
      );
    }

    // --- 4. Page Creation ---
    const newPage = await prisma.page.create({
      data: {
        title: title,
        workspaceId: workspaceId,
        parentId: parentId || null, // Ensure parentId is null if not provided
      },
    });

    // --- 5. Success Response ---
    return NextResponse.json(newPage, { status: 201 });

  } catch (error) {
    console.error('[API/PAGES/POST] Error creating page:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}