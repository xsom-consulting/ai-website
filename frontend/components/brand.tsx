/**
 * Le logo xSOM : les trois flèches coudées entrelacées, servi depuis
 * `public/xsom-mark.svg` (variante pour fond sombre) et `public/xsom-mark-light.svg`
 * (variante pour fond clair), copies exactes du logo du site de conseil. Il apparaît
 * dans le bloc de marque (`components/site/Brand.tsx`) et dans les replis des films.
 *
 * Le logo est servi en `<img>` et non inline : il porte trois masques avec leurs `id`,
 * et deux copies inline dans la même page (en-tête et pied de page) produiraient des
 * `id` en double. Un fichier séparé, c'est en plus une seule requête mise en cache
 * pour tout le site : le même arbitrage que `xsom.fr`.
 */

/**
 * Les variantes d'origine, choisies par le thème partagé sans toucher au SVG.
 *
 * `alt=""` : le logo est décoratif. Le nom accessible du site (« xSOM · IA »,
 * « xSOM Fleet », « Secret Guard ») est porté par le texte posé à côté ; donner un
 * `alt` au signe le ferait annoncer deux fois par un lecteur d'écran.
 *
 * `width`/`height` en attributs même si la classe redimensionne : ils donnent le
 * ratio intrinsèque, donc pas de saut de mise en page au chargement.
 */
export function XsomMark({ className = "h-[42px] w-[42px]" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`xsom-brand-mark shrink-0 ${className}`}>
      {/* SVG assets already carry their original paths; no raster optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/xsom-mark.svg"
        alt=""
        width={42}
        height={42}
        className="xsom-brand-mark__dark"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/xsom-mark-light.svg"
        alt=""
        width={42}
        height={42}
        className="xsom-brand-mark__light"
      />
    </span>
  );
}
