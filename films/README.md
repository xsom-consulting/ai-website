# Films de ai.xsom.fr, fleet.xsom.fr et guard.xsom.fr (Remotion)

Toutes les vidéos du site sont rendues ici, en React, par [Remotion](https://www.remotion.dev) :
images d'archives sous licence, étalonnage maison, titres cinétiques, graphismes animés et
musique de synthèse. Aucune étape FFmpeg à la main, aucun clip généré par IA.

| Composition | Fichier produit | Page |
|---|---|---|
| `home-fr`, `home-en` | `frontend/public/signal-media/xsom-ia-home-{fr,en}.mp4` + `.jpg` (15 s, 24 fps) | Accueil de ai.xsom.fr |
| `extension` | `frontend/public/signal-media/secret-guard-loop.webm` + `.jpg` (10 s en boucle, muet) | Ouverture de guard.xsom.fr |
| `fleet-hero-fr`, `fleet-hero-en` | `frontend/public/signal-media/xsom-fleet-hero-{fr,en}.mp4` + `.jpg` (16 s en boucle, 24 fps, ≤ 6 Mo) | Version 1, retirée du site (fichiers supprimés ; à recréer par un rendu si besoin) |
| `fleet-how-{orgs,policy,block,coverage,costs}-{fr,en}` | `frontend/public/signal-media/xsom-fleet-how-<sujet>-{fr,en}.mp4` + `.jpg` (10 s en boucle, muets, 30 fps, ≤ 2,5 Mo) | Version 1, retirée du site (fichiers supprimés ; à recréer par un rendu si besoin) |
| `fleet-ad-{fr,en}` | `frontend/public/signal-media/xsom-fleet-hero-v2-{fr,en}.mp4` + `.jpg` (20 s en boucle, 60 fps, 120 BPM, bruitages synthétisés, ≤ 8 Mo) | Film d’ouverture de fleet.xsom.fr (version 2) |
| `fleet-how-v2-{fr,en}` | `frontend/public/signal-media/xsom-fleet-how-v2-{fr,en}.mp4` + `.jpg` (≈ 72 et 80 s, 30 fps, voix off et sous-titres, ≤ 15 Mo) | « Comment ça marche » de fleet.xsom.fr (version 2, film unique avec chapitres) |

Ce dépôt est public : il ne contient aucun film de démarchage (présentation d'un prospect, séquence
où paraît une marque). Les films de présentation commerciale de xSOM Fleet se font hors de ce dépôt.

## Rendre

```sh
cd films
npm ci
npm run footage   # télécharge les clips de footage.json, copie polices et logo dans public/
npm run render    # tout ; ou par nom : npm run render -- home extension fleet-hero fleet-how
npm run studio    # prévisualisation interactive
npm run stills -- fleet-hero-fr:2,13.8   # images clés dans out/stills, avec la sonde de mise en page
```

Les films de fleet.xsom.fr (sauf `block`) montrent la console xSOM Fleet : ses captures
(PNG 2x, 3200 × 2000, pages entières plus hautes) sont déposées à la main dans
`public/screens/{fr,en}/<nom>.png` avec `public/screens/manifest.json`, depuis une base de
démonstration jetable (`fleet-ops demo-data generate`). Une capture absente est remplacée à
l'image par un gabarit gris qui nomme le fichier attendu. `npm run render` vérifie la taille de
chaque film du site Fleet et l'encode de nouveau à un CRF plus élevé s'il dépasse son budget.

`public/` n'est jamais versionné : les clips se retrouvent à l'identique depuis leur
identifiant Pexels (rendu 1080p), les captures de la console se refont depuis une base de
démonstration, la musique se synthétise. Les rendus, eux, sont versionnés dans `frontend/`.

## Voix off (films v2)

`scripts/voiceover.mjs` fait dire les scènes de `src/fleet/v2/how-script.json` par ElevenLabs
(modèle et voix consignés dans le script), met les mp3 en cache dans `public/voice/` (non
versionné) et écrit `src/fleet/v2/voice-timing.json` (durées des scènes, sous-titres). La clé
n’est jamais écrite : elle est lue dans le Trousseau au moment de l’appel.

```sh
ELEVENLABS_API_KEY="$(security find-generic-password -s elevenlabs-api-key -a xsom -w)" node scripts/voiceover.mjs
npm run render -- fleet-ad fleet-how-v2
```

Une scène déjà en cache n’est jamais renvoyée ; `--silent` construit le film sans voix.
Les noms de Fournisseur visibles sur les captures restent lisibles (usage nominatif) ;
`redact` d’un `TourPage` sait encore masquer une zone si besoin.

## Sources

- `src/kit.tsx` : enchaînement des plans (fondu de 0,3 s, lente poussée), étalonnage
  commun (ton marine, bords assombris pour l'en-tête et les commandes, vignette, grain),
  et les révélations de texte.
- `src/overlays.tsx` : les fuites rouges (acte 2 de l'accueil) et le maillage bleu qui les
  recouvre (actes 3 et 4).
- `src/HomeFilm.tsx` : le film de ai.xsom.fr, ses plans, ses mots (FR/EN) et ses minutages.
  Les mots restent synchronisés avec les `label` de `AI_HERO_MEDIA`
  (`frontend/components/ai/ai-copy.ts`).
- `src/ExtensionLoop.tsx` : boucle sans raccord visible (la dernière seconde se fond dans
  la seconde qui précède la première image).
- `src/fleet/` : les films de xSOM Fleet et une sonde de mise en page qui signale, au rendu,
  tout titre hors cadre ou qui en chevauche un autre (`out/*.probe.log`).
- `src/fleet/FleetHero.tsx` : le film d'accueil de fleet.xsom.fr (développeurs, facture au
  tarif API, Plafond de 150 Sièges, xSOM Fleet, la console en perspective avec la mention
  « Démonstration · données illustratives »). Boucle : le premier plan revient en fondu sur
  la dernière 0,9 s et retombe sur la première image.
- `src/fleet/screen-tour.tsx` : `ScreenTour`, parcours d'une ou plusieurs captures dans une
  fenêtre de navigateur, décrit par des données
  `{src, width, height, path, steps: [{at, focus: {x, y, w, h}, zoom, callout}]}` (boîtes en
  pixels CSS de la capture) : caméra par `spring` (0,9 s), zone encadrée, pointeur, légende
  (apparitions de 250 ms), mention de démonstration dans la barre de la fenêtre. Un plan sans
  `focus` montre le haut de la page en pleine largeur : chaque film commence et finit ainsi.
- `src/fleet/HowFilm.tsx` (orgs, policy, coverage, costs) et `src/fleet/HowBlock.tsx` (le
  terminal : texte réel du catalogue `hook.*` de xSOM Fleet, jeton fictif masqué).
- `scripts/score.mjs` : la musique, synthétisée ; même instrument que les films de
  xsom.fr (`tools/film-score.mjs` du site), un accord par acte. Aucune piste sous licence.

## Licences

**Images.** Tous les clips viennent de Pexels, sous la
[licence Pexels](https://www.pexels.com/license/) : usage commercial gratuit, modification
autorisée, attribution non obligatoire. On crédite tout de même chaque auteur dans
`footage.json` et dans la fiche de chaque vidéo. Limites retenues : pas de revente ni de
redistribution d'un clip non modifié, pas de personne identifiable présentée sous un jour
défavorable ou comme soutenant xSOM. Les clips ne quittent jamais ce dossier non montés.

**Remotion.** Remotion n'est pas une licence libre classique : gratuit pour un particulier,
une organisation à but non lucratif ou une entreprise de **trois salariés au plus** ; au-delà,
une [licence entreprise](https://www.remotion.dev/license) est requise pour un usage
commercial. xSOM compte un seul salarié (son fondateur) : la licence gratuite s'applique.
À revérifier si l'effectif dépasse trois salariés.

**Dépendances.** `remotion`, `@remotion/*`, `react`, `react-dom` et `typescript` ne sont
utilisés que pour produire les fichiers vidéo ; rien de ce dossier n'est chargé par
l'application ni déployé.
