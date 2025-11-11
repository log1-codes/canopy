import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UpdatePageSchema } from '@/app/lib/validators';
import { UserRole } from '@prisma/client';

export async function PUT(req: Request, context: { params: Promise<{ pageId: string }> }) {
  try {
    const { pageId } = await context.params;

    if (!pageId) {
      return NextResponse.json({ message: 'Missing page ID in request URL.' }, { status: 400 });
    }

    // --- Authentication ---
    const fullSession = await getServerSession(authOptions);
    if (!fullSession || !fullSession.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = fullSession.user.id;

    // --- Validation ---
    const body = await req.json();
    const validatedFields = UpdatePageSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors, message: 'Invalid update data.' },
        { status: 400 }
      );
    }
    const updateData = validatedFields.data;

    // --- Authorization ---
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { workspaceId: true },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found.' }, { status: 404 });
    }

    const access = await prisma.workspaceAccess.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: page.workspaceId,
          userId,
        },
      },
      select: { role: true },
    });

    const role = access?.role;
    if (!role || (role !== UserRole.OWNER && role !== UserRole.EDITOR)) {
      return NextResponse.json(
        { message: 'You do not have permission to edit this page.' },
        { status: 403 }
      );
    }

    // --- Update Page ---
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No fields provided for update.' }, { status: 400 });
    }

    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: { ...updateData, updatedAt: new Date() },
      select: { updatedAt: true },
    });

    // --- Success ---
    return NextResponse.json({ updatedAt: updatedPage.updatedAt }, { status: 200 });

  } catch (error) {
    console.error('PUT /api/pages/[pageId] error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
