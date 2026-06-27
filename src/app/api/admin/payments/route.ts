import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAdminAction, requireAdmin } from "@/lib/security";

const patchSchema = z.object({
  paymentId: z.string(),
  action: z.enum(["approve", "reject"])
});

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin token required." }, { status: 401 });
  const payments = await prisma.payment.findMany({
    include: { user: true, plan: true, license: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ payments });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin token required." }, { status: 401 });
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payment action." }, { status: 400 });

  const payment = await prisma.payment.findUnique({ where: { id: body.data.paymentId }, include: { plan: true } });
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  if (body.data.action === "reject") {
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "REJECTED", reviewedAt: new Date(), reviewedById: admin.sub }
    });
    await recordAdminAction({ adminId: admin.sub, targetUserId: payment.userId, action: "payment.reject", before: payment, after: updated, request });
    return NextResponse.json({ payment: updated });
  }

  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + payment.plan.durationDays * 24 * 60 * 60 * 1000);
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "APPROVED", reviewedAt: startsAt, reviewedById: admin.sub }
    });
    const license = await tx.license.upsert({
      where: { paymentId: payment.id },
      update: { status: "ACTIVE", startsAt, expiresAt },
      create: { userId: payment.userId, planId: payment.planId, paymentId: payment.id, status: "ACTIVE", startsAt, expiresAt }
    });
    return { payment: updated, license };
  });

  await recordAdminAction({
    adminId: admin.sub,
    targetUserId: payment.userId,
    action: "payment.approve.activate_license",
    before: payment,
    after: result,
    request
  });
  return NextResponse.json(result);
}
