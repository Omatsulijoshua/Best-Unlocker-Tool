import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAdminAction, requireAdmin } from "@/lib/security";

const patchSchema = z.object({
  userId: z.string(),
  action: z.enum(["approve", "reject", "block", "unblock", "reset-device", "verify-email"])
});

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin token required." }, { status: 401 });
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      devices: true,
      sessions: { where: { active: true } },
      licenses: { include: { plan: true } },
      payments: true
    }
  });
  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin token required." }, { status: 401 });
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid user action." }, { status: 400 });

  const before = await prisma.user.findUnique({ where: { id: body.data.userId } });
  if (!before) return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (body.data.action === "reset-device") {
    await prisma.userDevice.updateMany({ where: { userId: before.id }, data: { active: false } });
    await prisma.loginSession.updateMany({
      where: { userId: before.id, active: true },
      data: { active: false, closedAt: new Date() }
    });
    await recordAdminAction({ adminId: admin.sub, targetUserId: before.id, action: "user.device.reset", before: {}, after: {}, request });
    return NextResponse.json({ ok: true });
  }

  const data =
    body.data.action === "approve"
      ? { status: "APPROVED" as const }
      : body.data.action === "reject"
        ? { status: "REJECTED" as const }
        : body.data.action === "block"
          ? { status: "BLOCKED" as const }
          : body.data.action === "verify-email"
            ? { emailVerifiedAt: new Date() }
            : { status: "APPROVED" as const, blockedReason: null };

  const user = await prisma.user.update({ where: { id: before.id }, data });
  await recordAdminAction({ adminId: admin.sub, targetUserId: user.id, action: `user.${body.data.action}`, before, after: user, request });
  return NextResponse.json({ user });
}
