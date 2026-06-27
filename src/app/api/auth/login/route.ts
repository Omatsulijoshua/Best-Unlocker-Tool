import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken, getClientIp, rateLimit, verifyPassword } from "@/lib/security";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid login details." }, { status: 400 });
  }

  const email = body.data.email.toLowerCase();
  const limit = await rateLimit(`login:${email}:${getClientIp(request)}`, 6, 60);
  if (!limit.ok) {
    await prisma.activityLog.create({
      data: { action: "auth.rate_limited", metadata: { email }, ipAddress: getClientIp(request) }
    });
    return NextResponse.json({ error: "Too many login attempts." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) {
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: { increment: 1 } } });
    }
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const tokenUser = { sub: user.id, email: user.email, role: user.role };
  return NextResponse.json({
    accessToken: await createAccessToken(tokenUser),
    refreshToken: await createRefreshToken(tokenUser),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
  });
}
