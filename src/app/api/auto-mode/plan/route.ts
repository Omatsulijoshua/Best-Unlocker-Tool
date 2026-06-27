import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAutoModePlan } from "@/lib/autoMode";

const schema = z.object({
  action: z.enum(["view-device-details", "official-frp-recovery", "factory-reset", "reboot-recovery", "reboot-bootloader"]),
  ownsOrAdministers: z.boolean(),
  device: z.object({
    vendorId: z.number().optional(),
    productId: z.number().optional(),
    manufacturerName: z.string().optional(),
    productName: z.string().optional(),
    serialNumber: z.string().optional()
  })
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid auto mode request." }, { status: 400 });
  }

  return NextResponse.json({ plan: buildAutoModePlan(body.data) });
}
