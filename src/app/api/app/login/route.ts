import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  auditActivity,
  createAccessToken,
  createRefreshToken,
  getClientIp,
  rateLimit,
  sessionExpiry,
  sha256,
  verifyPassword
} from "@/lib/security";
import { validateAppAccess } from "@/lib/license";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceId: z.string().min(8).max(256),
  fingerprint: z.record(z.unknown()).default({})
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid app login payload." }, { status: 400 });
  }

  const email = body.data.email.toLowerCase();
  const limit = await rateLimit(`app-login:${email}:${getClientIp(request)}`, 5, 60);
  if (!limit.ok) {
    await auditActivity({ action: "app.login.rate_limited", metadata: { email }, request });
    return NextResponse.json({ error: "Too many app login attempts." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordValid = user ? await verifyPassword(body.data.password, user.passwordHash) : false;
  const validation = await validateAppAccess({ email, passwordValid, deviceId: body.data.deviceId });

  if (!validation.ok) {
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: { increment: 1 } } });
      await auditActivity({
        userId: user.id,
        action: `app.login.denied.${validation.code}`,
        metadata: { deviceIdHash: await sha256(body.data.deviceId) },
        request
      });
    }
    return NextResponse.json({ error: validation.message, code: validation.code }, { status: 403 });
  }

  await prisma.userDevice.upsert({
    where: { userId_deviceIdHash: { userId: validation.user.id, deviceIdHash: validation.deviceIdHash } },
    update: { active: true, lastSeenAt: new Date(), fingerprint: body.data.fingerprint },
    create: {
      userId: validation.user.id,
      deviceIdHash: validation.deviceIdHash,
      fingerprint: body.data.fingerprint,
      active: true
    }
  });

  const refreshToken = await createRefreshToken({
    sub: validation.user.id,
    email: validation.user.email,
    role: validation.user.role
  });
  const session = await prisma.loginSession.create({
    data: {
      userId: validation.user.id,
      deviceIdHash: validation.deviceIdHash,
      refreshTokenHash: await sha256(refreshToken),
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
      expiresAt: sessionExpiry()
    }
  });

  const accessToken = await createAccessToken({
    sub: validation.user.id,
    email: validation.user.email,
    role: validation.user.role,
    sessionId: session.id
  });

  await prisma.user.update({ where: { id: validation.user.id }, data: { failedLoginCount: 0 } });
  await auditActivity({ userId: validation.user.id, action: "app.login.allowed", metadata: { sessionId: session.id }, request });

  const cacheMinutes = Number(process.env.APP_LICENSE_CACHE_MINUTES ?? 15);
  return NextResponse.json({
    accessToken,
    refreshToken,
    sessionId: session.id,
    license: {
      status: validation.license.status,
      plan: validation.license.plan.name,
      startsAt: validation.license.startsAt,
      expiresAt: validation.license.expiresAt,
      cacheExpiresAt: new Date(Date.now() + cacheMinutes * 60 * 1000)
    },
    idlePolicy: { lockAfterSeconds: 300, warnAfterSeconds: 240 }
  });
}
