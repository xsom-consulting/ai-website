import { getHostSite } from "@/lib/site-host";
import { robotsTxt } from "@/lib/seo-files";

// Dépend de l'adresse demandée : jamais figé à la construction.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(robotsTxt(await getHostSite()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
