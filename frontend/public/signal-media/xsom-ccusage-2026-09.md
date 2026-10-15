# Relevé ccusage de septembre 2026 (tuile Coût de fleet.xsom.fr)

- Source : sortie de l’outil libre [ccusage](https://github.com/ryoppippi/ccusage), commande
  `ccusage monthly --since 20260901 --until 20260930`, lancée sur le poste de travail de
  Julian Talou (xSOM), un seul utilisateur, à partir des journaux locaux des assistants.
- Fichiers : `xsom-ccusage-2026-09.png` (source, 2×) et `xsom-ccusage-2026-09.webp` (même
  image, sans perte, servie par la page).
- Fidélité : le texte du terminal est la sortie exacte, caractère pour caractère ; seuls la
  ligne de commande, la fenêtre et la mise en évidence des lignes Claude et Codex (et de leur
  montant) sont ajoutées. Aucun chiffre n’est réécrit.
- Lecture : Claude $7814.73, Codex $1173.27, OpenClaw $0.00, total $8988.00, aux tarifs API
  de l’outil : une estimation pour un utilisateur intensif, pas une moyenne.
- Rendu : page HTML (police Menlo 13,5 px, interligne 1,17) capturée par Chromium (Playwright)
  à l’échelle 2, puis `cwebp -lossless`.
