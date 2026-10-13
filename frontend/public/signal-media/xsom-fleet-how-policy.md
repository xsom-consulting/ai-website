# Comment ça marche xSOM Fleet : Politique (FR et EN)

- Rendu avec Remotion : compositions `fleet-how-policy-fr` / `fleet-how-policy-en` de
  `films/src/fleet/HowFilm.tsx` (`npm --prefix films run render -- fleet-how`).
- Fichiers : `xsom-fleet-how-policy-fr.mp4`, `xsom-fleet-how-policy-en.mp4` et leurs affiches `.jpg`.
- Format : 10 secondes en boucle (la fin retombe sur la première image), 1920 × 1080,
  30 images/s, H.264 BT.709 (yuv420p) avec démarrage progressif (`+faststart`), sans son.
- Images : captures de la console xSOM Fleet sur une base de démonstration jetable
  (`fleet-ops demo-data generate`, 450 Développeurs fictifs sous `demo.invalid`) ; aucune
  donnée de client. La mention « Démonstration · données illustratives » (« Demonstration ·
  illustrative data ») est à l’écran sur chaque image, dans la barre de la fenêtre. Les
  captures anglaises ont l’interface traduite ; les données restent en français.
- Parcours par `ScreenTour` (`films/src/fleet/screen-tour.tsx`) : mouvements de caméra doux,
  zone encadrée, pointeur, une légende courte par plan.
- Page : « Politique » entière (version 1 en vigueur, saisie, aperçu de la publication).
- Légendes : Une Politique signée, versionnée · Avant publication : les Postes en retard ·
  Publiée vers chaque Poste (EN : A signed, versioned Policy · Before publishing: the Postes
  behind · Published to every Poste).
- Aucun clip, aucune musique. Remotion : licence gratuite (entreprise de trois salariés au
  plus), voir `films/README.md`.
