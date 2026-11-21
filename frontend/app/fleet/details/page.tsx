import type { Metadata } from "next";

import { FleetDetailsPage } from "@/components/fleet/FleetDetailsPage";
import { FLEET_COPY, FLEET_ORIGIN, fleetOgImage } from "@/components/fleet/fleet-copy";
import { FLEET_PRODUCT_COPY } from "@/components/fleet/fleet-product-copy";
import { getLang } from "@/lib/lang";
import "../../guard-landing.css";
import "../../home.css";
import "../../pitch.css";
import "../../fleet-product.css";

/** Le détail de xSOM Fleet, servi sur `fleet.xsom.fr/details` (voir `lib/sites.ts`). */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = FLEET_PRODUCT_COPY[lang].details;
  const poster = `${FLEET_ORIGIN}${fleetOgImage(lang)}`;
  const url = `${FLEET_ORIGIN}/details`;
  return {
    title: { absolute: copy.meta },
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      title: copy.meta,
      description: copy.description,
      url,
      siteName: "xSOM Fleet",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: poster, width: 1200, height: 630, alt: FLEET_COPY[lang].meta.ogAlt }],
    },
  };
}

export default function FleetDetailsRoute() {
  return <FleetDetailsPage />;
}
