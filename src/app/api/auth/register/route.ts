import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditActivity, getClientIp, hashPassword, rateLimit } from "@/lib/security";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(10).max(128)
});

export async function POST(request: NextRequest) {
  const limit = await rateLimit(`register:${getClientIp(request)}`, 5, 60);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many registration attempts." }, { status: 429 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }

  const email = body.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: body.data.name,
      email,
      passwordHash: await hashPassword(body.data.password),
      status: "PENDING"
    },
    select: { id: true, email: true, status: true }
  });

  await auditActivity({ userId: user.id, action: "website.signup.pending", request });
  return NextResponse.json({
    user,
    message: "Account created. Verify your email and wait for admin approval before app login."
  });
}
