import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const payloadSchema = z.object({
  device: z.enum(["inner", "outer"]).optional(),
  device_id: z.enum(["inner", "outer"]).optional(),
  pm1: z.number().int().nonnegative().optional(),
  pm25: z.number().int().nonnegative().optional(),
  pm10: z.number().int().nonnegative().optional(),
});

function isAuthorized(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${env.INGEST_TOKEN}`;
  return auth === expected;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const device = parsed.data.device ?? parsed.data.device_id;
  if (!device) {
    return NextResponse.json(
      { error: "Missing device. Send \"device\" or legacy \"device_id\" (inner|outer)" },
      { status: 400 }
    );
  }

  if (
    parsed.data.pm1 === undefined &&
    parsed.data.pm25 === undefined &&
    parsed.data.pm10 === undefined
  ) {
    return NextResponse.json(
      { error: "At least one of pm1, pm25, pm10 is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("air_data")
    .insert({
      device,
      pm1: parsed.data.pm1,
      pm25: parsed.data.pm25,
      pm10: parsed.data.pm10,
    })
    .select("id, device, created_at")
    .single();

  if (error) {
    console.error("[api/ingest] Insert into air_data failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      device,
    });
    return NextResponse.json({ error: "Failed to store reading" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: data });
}
