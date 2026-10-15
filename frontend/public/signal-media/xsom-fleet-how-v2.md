# Comment ça marche xSOM Fleet, version 2 (FR et EN, voix off)

- Rendu avec Remotion : composition `fleet-how-v2-fr` / `fleet-how-v2-en` de
  `films/src/fleet/v2/HowV2.tsx` (`npm --prefix films run render -- fleet-how-v2`), après
  `node films/scripts/voiceover.mjs` (voix et minutage).
- Fichiers : `xsom-fleet-how-v2-fr.mp4` (71,6 s, 7,9 Mo), `xsom-fleet-how-v2-en.mp4`
  (79,7 s, 7,7 Mo) et leurs affiches `.jpg` (la clé bloquée sur le Poste).
- Format : 1920 × 1080, 30 images/s, H.264 BT.709 (yuv420p), `+faststart`, AAC stéréo
  128 kbit/s ; ≤ 15 Mo. Sous-titres incrustés, calés sur les temps de la voix.
- Voix off : ElevenLabs, modèle `eleven_multilingual_v2`, mp3 44,1 kHz 192 kbit/s ; FR « Nicolas -
  Narrator » (bibliothèque ElevenLabs, vitesse 0,9), EN « Daniel - Steady Broadcaster ».
  Texte : `films/src/fleet/v2/how-script.json`.
- Musique : synthétisée (`films/scripts/score.mjs`), un accord par scène, baissée sous la voix.

| Scène | Écran |
|---|---|
| 1 Choisissez vos IA | capture « Organisations fournisseur » (noms des Fournisseurs et des offres en usage nominatif), puis plan typographique « Applications API » (écran non capturé) |
| 2 Une seule Politique pour tous les Postes | capture « Politique » et aperçu de publication |
| 3 Supervisez | capture « Couverture » |
| 4 Rien ne change pour vos équipes | terminal dessiné : envoi normal, clé fictive `AKIA••••` bloquée avec le texte réel de l’Agent xSOM (`hook.blocked`, règle `aws_access_key_id`, `hook.remedy.cloud_credential`), envoi corrigé par variable d’environnement |
| 5 Maîtrisez votre facture IA | capture « Coûts » par Développeur, puis plan typographique « Recommandations de Palier de siège » (écran non capturé) |
| 6 Prouvez votre maîtrise | capture « Journal des blocages » (Dossier de preuves), puis plan typographique du Dossier (PDF ou JSON, trois Pièces probantes) |
| 7 Signature | xSOM Fleet. Les meilleures IA pour toute votre entreprise. La sécurité reste chez vous. |

- Captures : console xSOM Fleet, base de démonstration jetable ; « Démonstration · données
  illustratives » dans la barre de la fenêtre et dans la page. Les plans typographiques
  reprennent les libellés du catalogue `contracts/i18n` de xSOM Fleet.
- Aucun nom ni logo de fournisseur d’IA à l’image ni dans la voix. Remotion : licence gratuite.
