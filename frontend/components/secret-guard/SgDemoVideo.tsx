"use client";

import { useT } from "@/lib/i18n";
import { SECRET_GUARD_COPY, SECRET_GUARD_DEMO_MEDIA } from "./secret-guard-copy";

/**
 * L'emplacement de la vidéo de démonstration, en tête de page. Tant que
 * `secret-guard-demo.mp4` n'est pas dans `public/signal-media/` (lu à la construction),
 * rien ne s'affiche ici et la vidéo d'ambiance de l'ouverture reste seule. La vidéo ne se
 * lance qu'à la demande du visiteur : rien n'est téléchargé avant.
 */
export function SgDemoVideo() {
  const { lang } = useT();
  if (!SECRET_GUARD_DEMO_MEDIA.available) return null;
  return (
    <figure className="sg-demo">
      <video
        className="sg-demo__video"
        src={SECRET_GUARD_DEMO_MEDIA.mp4}
        poster={SECRET_GUARD_DEMO_MEDIA.hasPoster ? SECRET_GUARD_DEMO_MEDIA.poster : undefined}
        controls
        playsInline
        preload="none"
        aria-label={SECRET_GUARD_COPY[lang].hero.demo}
      />
    </figure>
  );
}
