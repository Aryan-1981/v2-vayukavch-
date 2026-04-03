import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const payloadSchema = z.object({
  device_id: z.enum(["outer", "purified"]),
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

  const { data, error } = await supabaseServer
    .from("air_readings")
    .insert(parsed.data)
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: data });
}
