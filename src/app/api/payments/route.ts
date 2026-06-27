import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  userId: z.string(),
  planId: z.string(),
  reference: z.string().optional(),
  proofUrl: z.string().url().optional()
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: body.data.planId } });
  if (!plan || !plan.active) return NextResponse.json({ error: "Plan is unavailable." }, { status: 404 });

  const payment = await prisma.payment.create({
    data: {
      userId: body.data.userId,
      planId: body.data.planId,
      amountCents: plan.priceCents,
      currency: plan.currency,
      reference: body.data.reference,
      proofUrl: body.data.proofUrl,
      status: "PENDING"
    }
  });
  return NextResponse.json({ payment, message: "Payment submitted as pending until admin approval." });
}
