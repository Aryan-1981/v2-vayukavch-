import { NextResponse } from "next/server";
import { z } from "zod";
import { getIngestToken } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const payloadSchema = z.object({
  device_id: z.enum(["outer", "purified"]),
  pm1: z.number().int().nonnegative().optional(),
  pm25: z.number().int().nonnegative().optional(),
  pm10: z.number().int().nonnegative().optional(),
});

function isAuthorized(req: Request) {
  const ingestToken = getIngestToken();
  if (!ingestToken) return false;

  const auth = req.headers.get("authorization") || "";
  const expected = ["Bearer", ingestToken].join(" ");
  return auth === expected;
}

export async function POST(req: Request) {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

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
    .from("air_data")
    .insert(parsed.data as never)
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: data });
}
