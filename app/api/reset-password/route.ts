import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Token has expired." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
