"use client";

import { SiteLink } from "@/components/site/SiteLink";
import { XsomMark } from "@/components/brand";
import { useT } from "@/lib/i18n";
import { BRAND } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";

/**
 * Le bloc de marque d'un site : le logo xSOM et le nom du site (« xSOM · IA »,
 * « xSOM Fleet », « Secret Guard »). Le nom accessible est le texte lui-même ; le
 * logo est décoratif (voir `brand.tsx`).
 */
export function Brand({ site, className = "brand" }: { site: Site; className?: string }) {
  const { lang } = useT();
  const brand = BRAND[site][lang];
  return (
    <SiteLink to={{ site }} className={className}>
      <XsomMark />
      <span>
        <span className="brand__name">
          {brand.lead} <span className="brand__product">{brand.product}</span>
        </span>
      </span>
    </SiteLink>
  );
}
