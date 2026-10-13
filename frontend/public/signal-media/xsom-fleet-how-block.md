# Comment ça marche xSOM Fleet : Contrôle avant envoi (FR et EN)

- Rendu avec Remotion : compositions `fleet-how-block-fr` / `fleet-how-block-en` de
  `films/src/fleet/HowBlock.tsx` (`npm --prefix films run render -- fleet-how`).
- Fichiers : `xsom-fleet-how-block-fr.mp4`, `xsom-fleet-how-block-en.mp4` et leurs affiches `.jpg`.
- Format : 10 secondes en boucle (la fin retombe sur la première image), 1920 × 1080,
  30 images/s, H.264 BT.709 (yuv420p) avec démarrage progressif (`+faststart`), sans son.
- Images : un terminal d’assistant de code dessiné par la composition (aucune capture,
  aucun assistant réel nommé). Un Développeur colle un jeton dans son prompt ; l’envoi est
  refusé sur le Poste.
- Le jeton est fictif et masqué à l’écran (`ghp_` suivi de points) ; le film le dit
  (« Clé fictive, masquée à l’écran. »). Aucune valeur de secret n’est écrite dans le code.
- Le message de blocage est le texte réel de l’Agent xSOM : clés `hook.blocked`,
  `hook.blocked_rule` (règle `github_token`, libellé `hook.rule.github_token`) et
  `hook.remedy.provider_token` du catalogue `contracts/i18n/{fr,en}.json` de xSOM Fleet,
  assemblées comme dans `agent/internal/domain/hook/messages.go`. La présentation (cadre,
  étiquette « xSOM Fleet · envoi refusé ») est celle du film, pas celle d’un assistant.
- Aucun clip, aucune musique. Remotion : licence gratuite (entreprise de trois salariés au
  plus), voir `films/README.md`.
