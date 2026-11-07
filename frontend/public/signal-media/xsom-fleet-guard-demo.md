# Captures vidéo de Fleet Guard (page fleet.xsom.fr, chapitre Sécurité)

- Source : enregistrement d'écran macOS (`screencapture -v`) d'une fenêtre Terminal où tourne Claude
  Code 2.1.318, sur un Poste équipé de l'Agent xSOM 0.9.11 et d'une Politique qui expurge à tous les
  Niveaux de risque ; 5 novembre 2026. Démarré sans les réglages de l'utilisateur
  (`--setting-sources project,local`) : aucun nom de projet ni de client à l'écran.
- `xsom-fleet-guard-demo-texte.mp4` (17 s) : prompt avec l'URL d'une base de données et un mot de
  passe inventé ; le texte envoyé porte le Substitut `XXXXXXXXXXX1`, la ligne « message expurgé »
  s'affiche, le modèle répond avec le Substitut.
- `xsom-fleet-guard-demo-capture.mp4` (22 s) : capture d'écran d'un fichier `.env` dont le jeton
  GitHub est tiré au hasard à l'exécution (jamais affiché à l'écran) ; la copie masquée est lue par
  le modèle, qui décrit le rectangle blanc et recopie les autres lignes.
- Fidélité : vidéos réencodées en H.264 (`crf 21`, 1280 px de large, sans son), coupées à la fin de
  la réponse ; aucune image retouchée. Affiches : dernière image de chaque vidéo.
