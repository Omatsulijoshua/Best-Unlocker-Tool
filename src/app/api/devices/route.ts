import { NextRequest, NextResponse } from "next/server";
import { deviceChipsets, deviceModels, searchDeviceModels } from "@/lib/devices";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  return NextResponse.json({
    chipsets: deviceChipsets,
    models: query ? searchDeviceModels(query) : deviceModels
  });
}
