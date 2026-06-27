import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guides = await prisma.recoveryGuide.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { title: "asc" }
  });
  return NextResponse.json({ guides });
}
