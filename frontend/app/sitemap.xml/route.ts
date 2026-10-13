import { getHostSite } from "@/lib/site-host";
import { sitemapXml } from "@/lib/seo-files";

// Dépend de l'adresse demandée : jamais figé à la construction.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(sitemapXml(await getHostSite()), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
