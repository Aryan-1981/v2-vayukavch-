# Air Monitor (Supabase + Vercel + ESP)

Next.js (App Router) TypeScript dashboard that stores air sensor readings in Supabase and shows the latest values for two devices:

- `outer` (unfiltered inlet)
- `inner` (filtered outlet)

## Environment variables

Fill `.env.local`:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (Supabase secret/service role key; server-only)
- `INGEST_TOKEN` (your own secret token; ESP must include it)

## Ingest API

ESP devices POST to:

- `POST /api/ingest`

Headers:

- `Authorization: Bearer <INGEST_TOKEN>`
- `Content-Type: application/json`

Body example:

```json
{ "device": "inner", "pm1": 12, "pm25": 34, "pm10": 56 }
```

The legacy key `device_id` is still accepted for backwards compatibility. Rows are stored in `public.air_data` with the `device` column.

## Latest API

- `GET /api/latest?device=outer`
- `GET /api/latest?device=inner`

The legacy query parameter `device_id` is still accepted for backwards compatibility. Returns `{ "reading": { "device", "pm1", "pm25", "pm10", "created_at" } | null }`, sorted by `created_at` descending.

## Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

- Import this project into Vercel
- Add the same env vars in Vercel → Project → Settings → Environment Variables
- Deploy
