# Comment ça marche xSOM Fleet : Organisations fournisseur (FR et EN)

- Rendu avec Remotion : compositions `fleet-how-orgs-fr` / `fleet-how-orgs-en` de
  `films/src/fleet/HowFilm.tsx` (`npm --prefix films run render -- fleet-how`).
- Fichiers : `xsom-fleet-how-orgs-fr.mp4`, `xsom-fleet-how-orgs-en.mp4` et leurs affiches `.jpg`.
- Format : 10 secondes en boucle (la fin retombe sur la première image), 1920 × 1080,
  30 images/s, H.264 BT.709 (yuv420p) avec démarrage progressif (`+faststart`), sans son.
- Images : captures de la console xSOM Fleet sur une base de démonstration jetable
  (`fleet-ops demo-data generate`, 450 Développeurs fictifs sous `demo.invalid`) ; aucune
  donnée de client. La mention « Démonstration · données illustratives » (« Demonstration ·
  illustrative data ») est à l’écran sur chaque image, dans la barre de la fenêtre. Les
  captures anglaises ont l’interface traduite ; les données restent en français.
- Parcours par `ScreenTour` (`films/src/fleet/screen-tour.tsx`) : mouvements de caméra doux,
  zone encadrée, pointeur, une légende courte par plan.
- Pages : « Organisations fournisseur » (trois Claude Team à 150/150, un Espace ChatGPT
  Business à 120/200), puis la fiche d’un Développeur (ses Sièges).
- Légendes : Plusieurs Organisations fournisseur · 150/150 : le Plafond de Sièges est atteint ·
  Chaque Siège de chaque Développeur (EN : Several provider organizations · 150/150: the seat
  cap is reached · Every Seat of every developer).
- Aucun clip, aucune musique. Remotion : licence gratuite (entreprise de trois salariés au
  plus), voir `films/README.md`.
