"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { useSiteHref } from "@/components/site/SiteProvider";
import type { NavTarget } from "@/lib/site-copy";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: NavTarget; children: ReactNode };

/**
 * Un lien vers une page d'un des trois sites, ou vers une adresse externe. Une adresse
 * relative passe par `next/link` ; une adresse absolue (autre site de production,
 * `www.xsom.fr`, GitHub) est un lien ordinaire, ouvert dans le même onglet entre nos
 * sites et dans un nouvel onglet vers l'extérieur.
 */
export function SiteLink({ to, children, ...rest }: Props) {
  const href = useSiteHref();
  if ("href" in to) {
    return <a {...rest} href={to.href} target="_blank" rel="noreferrer">{children}</a>;
  }
  const target = href(to.site, to.path);
  if (target.startsWith("/")) return <Link {...rest} href={target}>{children}</Link>;
  return <a {...rest} href={target}>{children}</a>;
}

/** Vrai pour un lien qui quitte nos trois sites : le texte porte alors une flèche. */
export const isExternal = (to: NavTarget) => "href" in to;
