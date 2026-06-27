import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditActivity, verifyAccessToken } from "@/lib/security";

const schema = z.object({ sessionId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid logout payload." }, { status: 400 });
  }

  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  const payload = await verifyAccessToken(token);
  await prisma.loginSession.updateMany({
    where: { id: body.data.sessionId, userId: payload.sub },
    data: { active: false, closedAt: new Date() }
  });
  await auditActivity({ userId: payload.sub, action: "app.logout", metadata: { sessionId: body.data.sessionId }, request });
  return NextResponse.json({ ok: true });
}
