import { NextResponse } from "next/server";
import { z } from "zod";
import { getLatestByDevice } from "@/lib/queries";

export const runtime = "nodejs";

const querySchema = z.object({
  device_id: z.enum(["outer", "purified"]).optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device_id = url.searchParams.get("device_id");

  const parsed = querySchema.safeParse({ device_id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid device_id" }, { status: 400 });
  }

  try {
    const [outer, purified] = await Promise.all([getLatestByDevice("outer"), getLatestByDevice("inner")]);

    if (parsed.data.device_id === "outer") {
      return NextResponse.json({ reading: outer });
    }

    if (parsed.data.device_id === "purified") {
      return NextResponse.json({ reading: purified });
    }

    return NextResponse.json({ outer, purified });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to query latest readings", details }, { status: 502 });
  }
}
