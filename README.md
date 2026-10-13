# ai-website

Les sites publics de la division IA de xSOM Consulting. Un seul déploiement sert trois adresses :

| Adresse | Site |
|---|---|
| **ai.xsom.fr** | xSOM · IA : les prestations IA, les produits IA et le glossaire des menaces IA |
| **fleet.xsom.fr** | xSOM Fleet : la plateforme des assistants de code d'une entreprise (Fleet Sièges, Fleet Guard, Fleet Gateway à venir) |
| **guard.xsom.fr** | Secret Guard : le moteur open source de détection de secrets (Apache-2.0, [dépôt public](https://github.com/xsom-consulting/secret-guard)) |

Chaque site renvoie vers [www.xsom.fr](https://www.xsom.fr), le site principal de conseil.
Toute autre adresse (localhost, prévisualisations Vercel) sert toutes les pages, pour le
développement et les tests. Ce dépôt ne contient que des pages publiques : ni console, ni
connexion, ni compte.

## Organisation

- `frontend/` : le site (Next.js 16, React 18, Tailwind). `lib/sites.ts` dit quelle adresse montre quel
  site ; `proxy.ts` l'applique (redirections, page d'accueil de `fleet` et de `guard`). Les textes vivent
  dans des fichiers `*-copy.ts` qui portent le français et l'anglais côte à côte. `design-system/` est
  le paquet de design partagé de xSOM, recopié tel quel depuis `xsom-consulting/infra-xsom_website`
  (ses règles de ton : `design-system/VOICE.md`).
- `films/` : les films du site, rendus avec [Remotion](https://www.remotion.dev) (voir
  `films/README.md`, qui note aussi la licence de Remotion). Les rendus sont versionnés dans
  `frontend/public/signal-media/` ; les ressources de rendu (séquences Pexels, captures de la console de
  démonstration, musiques) ne sont pas versionnées.

## Commandes

Node.js 24 (voir `.nvmrc`).

```sh
cd frontend
npm ci
npm run dev          # http://localhost:3000, toutes les pages
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # next build
npx playwright install chromium   # une fois
npm run test:e2e     # construit, démarre le site et lance les tests Playwright (Chromium)
```

`npm run test:e2e` vérifie d'abord le paquet de design (`design-system`), puis les trois adresses
(en-tête `Host`), les pages, les deux langues, les largeurs de 390 à 1440 px, `robots.txt`, `sitemap.xml`
et `llms.txt` de chaque adresse. `E2E_SKIP_BUILD=1` réutilise un `.next` déjà construit.

## Variables d'environnement

Aucune n'est obligatoire. Une seule est facultative : `MISTRAL_API_KEY_SEARCHFRONTEND`, qui active la
recherche par IA du glossaire (`/api/threat-search`). Sans elle, la route répond « indisponible » et le
glossaire filtre le texte dans le navigateur. La politique de confidentialité en parle.

## Déploiement

Projet Vercel : racine `frontend`, Next.js, Node 24. Les trois noms d'hôte (`ai.xsom.fr`,
`fleet.xsom.fr`, `guard.xsom.fr`) pointent vers ce même projet. Aucune variable n'est à renseigner.

## Intégration continue

`.github/workflows/ci.yml` se déclenche à chaque push et à chaque pull request : installation,
vérification de types, lint, build, tests Playwright (Chromium) et vérification de types des films.

## Droits

Tous droits réservés. © xSOM Consulting : les textes, les films, les graphismes et les marques de ces sites
restent à xSOM Consulting. Les polices du paquet de design gardent leur licence (SIL OFL, voir
`frontend/design-system/licenses/`). Secret Guard, publié dans son propre dépôt, est sous licence
Apache-2.0 ; cette licence ne s'étend pas au contenu de ce dépôt.
