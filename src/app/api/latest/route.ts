import { NextResponse } from "next/server";
import { z } from "zod";
import { getLatest } from "@/lib/queries";

export const runtime = "nodejs";

const querySchema = z.object({
  device_id: z.enum(["outer", "purified"]),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device_id = url.searchParams.get("device_id");

  const parsed = querySchema.safeParse({ device_id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid device_id" }, { status: 400 });
  }

  const reading = await getLatest(parsed.data.device_id);
  return NextResponse.json({ reading });
}
