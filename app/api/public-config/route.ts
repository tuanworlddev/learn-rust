import { readSupabaseConfig } from "@/lib/supabase/config.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = readSupabaseConfig();
  return Response.json(config.enabled ? config : { enabled: false }, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
