import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildGuidance, containsSuspiciousRequest } from "@/lib/wizard";

const schema = z.object({
  userId: z.string().optional(),
  systemType: z.string(),
  ownsOrAdministers: z.boolean(),
  proof: z.array(z.string()).default([]),
  notes: z.string().default("")
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid wizard request." }, { status: 400 });
  const suspicious = containsSuspiciousRequest(`${body.data.systemType} ${body.data.notes}`);
  const generatedGuidance = suspicious
    ? "We cannot assist with bypass, exploit, brute-force, credential theft, or unauthorized access requests."
    : buildGuidance(body.data);
  const session = await prisma.recoveryWizardSession.create({
    data: {
      userId: body.data.userId,
      systemType: body.data.systemType,
      ownsOrAdministers: body.data.ownsOrAdministers,
      availableProof: body.data.proof,
      generatedGuidance,
      suspicious
    }
  });
  return NextResponse.json({ session, generatedGuidance });
}
