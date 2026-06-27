import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  priceCents: z.number().int().positive(),
  durationDays: z.number().int().positive(),
  active: z.boolean().default(true)
});

export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({ orderBy: { priceCents: "asc" } });
  return NextResponse.json({ plans });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin token required." }, { status: 401 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  const plan = await prisma.subscriptionPlan.create({ data: body.data });
  return NextResponse.json({ plan });
}
