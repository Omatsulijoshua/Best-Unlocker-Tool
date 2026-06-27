import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { containsSuspiciousRequest } from "@/lib/wizard";

const schema = z.object({
  userId: z.string(),
  title: z.string().min(5),
  systemType: z.string().min(2),
  description: z.string().min(20),
  proofChecklist: z.array(z.string()).default([]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL")
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid ticket." }, { status: 400 });
  const suspicious = containsSuspiciousRequest(`${body.data.title} ${body.data.description}`);
  const ticket = await prisma.supportTicket.create({
    data: {
      ...body.data,
      status: suspicious ? "REJECTED" : "OPEN",
      proofChecklist: body.data.proofChecklist
    }
  });
  return NextResponse.json({ ticket, warning: suspicious ? "Suspicious request rejected." : undefined });
}
