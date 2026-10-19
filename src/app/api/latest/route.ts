import { NextResponse } from "next/server";
import { z } from "zod";
import { getLatest } from "@/lib/queries";

export const runtime = "nodejs";

const querySchema = z.object({
  device: z.enum(["inner", "outer"]),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const deviceParam = url.searchParams.get("device") ?? url.searchParams.get("device_id");

  const parsed = querySchema.safeParse({ device: deviceParam });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid device. Use /api/latest?device=outer or /api/latest?device=inner" },
      { status: 400 }
    );
  }

  try {
    const reading = await getLatest(parsed.data.device);
    return NextResponse.json({ reading });
  } catch (error) {
    console.error(
      `[api/latest] Supabase query for "${parsed.data.device}" failed:`,
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Failed to load latest reading" }, { status: 500 });
  }
}
