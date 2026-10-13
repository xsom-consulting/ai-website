# Film d’accueil xSOM Fleet (FR et EN)

- Rendu avec Remotion : composition `fleet-hero-fr` / `fleet-hero-en` de
  `films/src/fleet/FleetHero.tsx` (`npm --prefix films run render -- fleet-hero`).
- Deux fichiers, un par langue du site : `xsom-fleet-hero-fr.mp4` et `xsom-fleet-hero-en.mp4`,
  chacun avec son affiche `.jpg` (13,8 s : la console, avec la mention de démonstration).
- Format : 16 secondes, 1920 × 1080, 24 images/s, H.264 BT.709 (yuv420p) avec démarrage
  progressif (`+faststart`), AAC stéréo. Lecture muette par défaut sur le site.
- Boucle raccordée : sur ses 0,9 dernière seconde, le premier plan revient en fondu et atteint
  exactement l’image par laquelle le film commence.
- Images : cinq clips Pexels, sous la [licence Pexels](https://www.pexels.com/license/)
  (usage commercial libre, attribution non obligatoire, crédités ici quand même) :

| Temps | Clip | Auteur |
|---|---|---|
| 0–3,8 s (et 15,1–16 s) | [A Programmer Working on a Laptop Computer](https://www.pexels.com/video/a-programmer-working-on-a-laptop-computer-13522186/) | Raddy |
| 3,8–5,9 s | [Colorful Code on Dark Background](https://www.pexels.com/video/colorful-code-on-dark-background-34268861/) | Jakub Zerdzicki |
| 5,9–8 s | [An Empty Office](https://www.pexels.com/video/an-empty-office-5483080/) | cottonbro studio |
| 8–12,2 s | [Aerial View of La Défense Skyline in Paris](https://www.pexels.com/video/aerial-view-of-la-defense-skyline-in-paris-35317702/) | Florian Delée |
| 12,2–15,1 s | [Abstract 3D Network Structure Animation](https://www.pexels.com/video/abstract-3d-network-structure-animation-35004655/) | Nicola Narracci |

- Console : capture de la page « Couverture » de la console xSOM Fleet, base de démonstration
  jetable (`fleet-ops demo-data generate`) ; la mention « Démonstration · données
  illustratives » (« Demonstration · illustrative data ») est à l’écran pendant tout le plan.
  Les chiffres affichés (450 Postes) sont des données générées, pas celles d’un client.
- Graphismes animés dessinés par la composition : grille de 150 Sièges, maillage bleu.
- Musique : synthétisée dans le dépôt (`films/scripts/score.mjs`, repère `fleet-hero`), même
  instrument que les autres films, ré mineur → Fa majeur 9. Aucune piste sous licence.
- Titres (zones de sécurité du site : aucun titre au-dessus de 290 px ni sous 250 px du bas) :

| Temps | FR | EN |
|---|---|---|
| 0,3–3,4 s | Vos développeurs / ONT LEUR ASSISTANT / DE CODE. | Your developers / HAVE THEIR CODING / ASSISTANT. |
| 3,9–5,5 s | Au tarif API, / AUCUN PLAFOND. | At API rates, / NO CEILING. |
| 6–7,6 s | Une organisation : / 150 SIÈGES / AU PLUS. | One organization: / 150 SEATS / AT MOST. |
| 8,1–11,8 s | XSOM FLEET · PLUSIEURS ORGANISATIONS. / UNE POLITIQUE PAR POSTE. / LE COÛT RÉEL. | XSOM FLEET · SEVERAL ORGANIZATIONS. / ONE POLICY PER POSTE. / THE REAL COST. |
| 12,4–14,7 s | Une seule / CONSOLE. · Démonstration · données illustratives | One single / CONSOLE. · Demonstration · illustrative data |

- Les personnes visibles sont des figurants de banques d’images : ni clients, ni équipes xSOM.
- Remotion : licence gratuite (entreprise de trois salariés au plus), voir `films/README.md`.
