<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project
This is a Next.js (App Router) TypeScript project.

## Conventions
- Prefer server-side data fetching in Server Components.
- Use environment variables for secrets. Never expose server keys to the client.

## Supabase
- Use `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (service role) only on the server.
- Ingest endpoint requires `Authorization: Bearer $INGEST_TOKEN`.
