import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/resend";
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email)
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "If this email exists, a reset link has been sent." },
      { status: 200 }
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;


  try {
    await sendResetEmail(email, resetUrl);
  } catch (err) {
    console.error("Error sending reset email:", err);
  }

  return NextResponse.json(
    { message: "If this email exists, a reset link has been sent." },
    { status: 200 }
  );
}