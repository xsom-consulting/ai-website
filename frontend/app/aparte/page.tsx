import type { Metadata } from "next";

import { AparteLanding } from "@/components/aparte/AparteLanding";
import "./aparte.css";

/**
 * Préproduction de la page d'Aparté, le produit pour indépendants qui remplacera Secret Guard
 * sur guard.xsom.fr. Non indexée tant qu'elle n'est pas validée.
 */
export const metadata: Metadata = {
  title: { absolute: "Aparté par xSOM · Gardez votre IA, rassurez vos clients" },
  description:
    "Aparté masque vos secrets avant chaque envoi à Claude Code, Codex, Claude Desktop ou ChatGPT, sur votre poste. 0 € pour les indépendants.",
  robots: { index: false, follow: false },
};

export default function AppartePage() {
  return <AparteLanding />;
}
