# Comment ça marche xSOM Fleet : Coûts (FR et EN)

- Rendu avec Remotion : compositions `fleet-how-costs-fr` / `fleet-how-costs-en` de
  `films/src/fleet/HowFilm.tsx` (`npm --prefix films run render -- fleet-how`).
- Fichiers : `xsom-fleet-how-costs-fr.mp4`, `xsom-fleet-how-costs-en.mp4` et leurs affiches `.jpg`.
- Format : 10 secondes en boucle (la fin retombe sur la première image), 1920 × 1080,
  30 images/s, H.264 BT.709 (yuv420p) avec démarrage progressif (`+faststart`), sans son.
- Images : captures de la console xSOM Fleet sur une base de démonstration jetable
  (`fleet-ops demo-data generate`, 450 Développeurs fictifs sous `demo.invalid`) ; aucune
  donnée de client. La mention « Démonstration · données illustratives » (« Demonstration ·
  illustrative data ») est à l’écran sur chaque image, dans la barre de la fenêtre. Les
  captures anglaises ont l’interface traduite ; les données restent en français.
- Parcours par `ScreenTour` (`films/src/fleet/screen-tour.tsx`) : mouvements de caméra doux,
  zone encadrée, pointeur, une légende courte par plan.
- Pages : « Coûts », onglet Groupe (septembre 2026), puis onglet Développeur. Le film montre
  la Facture réelle (Sièges et Dépassements) puis, à part, l’Équivalent API estimé avec sa
  mention « estimation » ; il ne met en avant ni le Ratio de coût ni un gain (données de
  démonstration, non représentatives).
- Légendes : Facture réelle : Sièges et Dépassements · À part : l’Équivalent API, une
  estimation · Par Développeur, Équipe ou Groupe (EN : Actual invoice: Seats and overages ·
  Separately: the API equivalent, an estimate · By developer, team or group).
- Aucun clip, aucune musique. Remotion : licence gratuite (entreprise de trois salariés au
  plus), voir `films/README.md`.
