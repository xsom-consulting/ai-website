# Publicité xSOM Fleet, version 2 (FR et EN)

- Rendu avec Remotion : composition `fleet-ad-fr` / `fleet-ad-en` de
  `films/src/fleet/v2/FleetAd.tsx` (`npm --prefix films run render -- fleet-ad`).
- Fichiers : `xsom-fleet-hero-v2-fr.mp4`, `xsom-fleet-hero-v2-en.mp4` et leurs affiches `.jpg`
  (19,3 s : la promesse et le logo). La version 1 (`xsom-fleet-hero-*`) reste en place.
- Format : 20 secondes, 1920 × 1080, 60 images/s, H.264 BT.709 (yuv420p) avec démarrage
  progressif (`+faststart`), AAC stéréo 160 kbit/s ; ≤ 8 Mo (6,8 Mo). Lecture muette par défaut
  sur le site.
- Boucle : le film commence sur un fond noir et silencieux et finit en fondu au noir ; il se
  raccorde sans coupure visible.
- Montage à 120 BPM (un temps = 0,5 s) ; minutage unique `films/src/fleet/v2/ad-cues.json`,
  lu par les images et par la bande son.

| Temps | FR | EN |
|---|---|---|
| 0–2 s | ligne de code tapée de plus en plus vite (`const ia = toutesLesMeilleures();`) | `const ai = allTheBest();` |
| 2–5 s | six plans de 0,5 s : Poste, Console, Coûts, Terminal, UE, Entreprise | Poste, Console, Costs, Terminal, EU, Company |
| 5–8 s | pastilles « modèle », « assistant », « API » aimantées sur une grille de Postes · TOUTES LES MEILLEURES IA. | model, assistant, API · ALL THE BEST AI. |
| 8–11 s | une clé `AKIA••••` se brise sur la ligne du Poste · RIEN NE SORT. | NOTHING LEAVES. |
| 11–14 s | cachet POLITIQUE SIGNÉE, onde sur des milliers de Postes · PARTOUT. TOUT DE SUITE. | SIGNED POLICY · EVERYWHERE. INSTANTLY. |
| 14–17 s | compteurs de la console (Sièges, Facture réelle, Équivalent API estimé « estimation · Catalogue de prix du 2026-07-01 ») avec « Démonstration · données illustratives » · CHAQUE EURO MAÎTRISÉ. | Seats, Actual invoice, Estimated API equivalent (« estimate ») · EVERY EURO UNDER CONTROL. |
| 17–18 s | noir, silence | |
| 18–20 s | Les meilleures IA pour toute votre entreprise. La sécurité reste chez vous. · logo xSOM Fleet | The best AI for your whole company. Security stays with you. |

- Console : capture de la page « Couverture » (plan 2) et chiffres de la page « Coûts », vue
  Groupe, septembre 2026 (23 636,00 $, 25 476,00 $, 44 043,62 $), d’une base de démonstration
  jetable (`fleet-ops demo-data generate`) ; la mention de démonstration est à l’écran sur ces
  plans. La capture des Coûts n’apparaît que floutée en fond.
- Clé : fictive et masquée (`AKIA` suivi de points) ; aucune valeur de secret n’est écrite.
- Images : deux clips Pexels (licence Pexels, crédités quand même) :
  [A Programmer Working on a Laptop Computer](https://www.pexels.com/video/a-programmer-working-on-a-laptop-computer-13522186/) (Raddy, 2–2,5 s) et
  [Aerial View of La Défense Skyline in Paris](https://www.pexels.com/video/aerial-view-of-la-defense-skyline-in-paris-35317702/) (Florian Delée, 4,5–5 s).
  Graphismes dessinés par la composition : terminal, graphique, carte d’Europe en points,
  grille de Postes, éclats, cachet, compteurs.
- Son : musique et bruitages synthétisés dans le dépôt (`films/scripts/ad-score.mjs`) :
  cliquetis qui accélère, impacts, souffles à chaque coupe, montée, éclats de verre, coup sourd
  et son écho, tic-tac et « ding », accord final. Aucune piste ni banque de sons sous licence.
  Niveau intégré ≈ −17 LUFS.
- Aucun nom ni logo de fournisseur d’IA. Remotion : licence gratuite (voir `films/README.md`).
