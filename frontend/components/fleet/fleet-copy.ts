import type { Lang } from "@/lib/i18n";

/**
 * La page xSOM Fleet, lue comme un dossier de présentation : une idée par écran, des
 * chapitres numérotés. La couverture (la plateforme en un mot et son schéma), puis trois
 * piliers (sécurité, FinOps, stratégie), le film, les licences et engagements, les
 * questions et le contact.
 *
 * Règles : aucun client nommé, aucun prix de licence publié, aucun chiffre sans source
 * (la mesure FinOps est datée, sourcée et montrée, `FLEET_MEASUREMENT`) ; jamais
 * « conforme », « certifié », « garanti » ni « orchestrateur » ; toute simulation porte
 * « Simulation · hypothèses affichées » ; toute capture de la console porte
 * « Démonstration · données illustratives ». Les marques Claude et ChatGPT sont citées
 * en usage nominatif seulement (« pris en charge »). Aucun fournisseur d'API ni modèle
 * n'est nommé tant que la version de LiteLLM n'est pas épinglée, sauf sur la carte du
 * chapitre Options (décision de Julian du 2026-10-24) : l'île des Fournisseurs d'IA et le
 * texte de sa zone citent Azure OpenAI, Microsoft Copilot, Gemini, Mistral et Bedrock pour
 * décrire, comme marques de leurs détenteurs. Le message bloquant
 * reprend mot pour mot le catalogue `hook.*` de l'Agent xSOM. Vocabulaire : glossaire
 * du PRD (§3).
 */

export const FLEET_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet";
/** La demande de simulation des coûts : même adresse, objet distinct. */
export const FLEET_SIMULATION_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20simulation";
/** La demande de tarif : le prix ne se publie pas, il se demande. */
export const FLEET_PRICE_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20tarif";
export const FLEET_ORIGIN = "https://fleet.xsom.fr";
/** La console de xSOM Fleet, où les Administrateurs se connectent. */
export const FLEET_CONSOLE_URL = "https://plateforme.xsom.fr";

const MEDIA = "/signal-media";

/** L'image Open Graph : la couverture de la page (titre et schéma), un fichier par langue. */
export const fleetOgImage = (lang: Lang) => `${MEDIA}/xsom-fleet-og-${lang}.jpg`;

/**
 * Le film de présentation (Remotion : `films/src/fleet/v2/HowV2.tsx`), avec voix off.
 * Durées mesurées sur les fichiers : 71,6 s en français, 79,7 s en anglais (arrondies
 * à la seconde supérieure dans le titre du chapitre).
 */
export const fleetHowMedia = (lang: Lang) => ({
  mp4: `${MEDIA}/xsom-fleet-how-v2-${lang}.mp4`,
  poster: `${MEDIA}/xsom-fleet-how-v2-${lang}.jpg`,
});

/**
 * Le prix du forfait Codex de xSOM (septembre 2026), dans sa devise : 103 € TTC par
 * mois. Jamais converti, jamais additionné aux dollars : aucun ratio n'est calculé pour
 * Codex.
 */
export const CODEX_PLAN = { amount: 103, currency: "EUR", taxIncluded: true } as const;

/**
 * La mesure FinOps : l'usage réel de xSOM en septembre 2026, relevé par l'outil libre
 * ccusage (`ccusage monthly --since 20260901 --until 20260930`) sur les journaux d'un
 * seul Poste, aux tarifs API de l'outil (capture `xsom-ccusage-2026-09.png`, texte
 * exact) : Claude 7814,73 $, Codex 1173,27 $, total 8988,00 $. Forfait Claude : 200 $
 * par mois (216 € TTC). Montants en cents ; les longueurs des barres en viennent
 * (Claude : 1 pour 39).
 */
export const FLEET_MEASUREMENT = {
  totalUsageCents: 898_800,
  claude: { planCents: 20_000, usageCents: 781_473 },
  codex: { usageCents: 117_327 },
  capture: { webp: `${MEDIA}/xsom-ccusage-2026-09.webp`, png: `${MEDIA}/xsom-ccusage-2026-09.png`, width: 2362, height: 1200 },
} as const;

/**
 * Les deux captures de la console (Groupe de démonstration, `fleet-ops demo-data
 * generate`, septembre 2026), recadrées sur la zone qui prouve, chiffres intacts. La
 * console est en français : la page anglaise le dit.
 */
export const FLEET_CONSOLE = {
  costs: { src: `${MEDIA}/fleet-console-costs.webp`, width: 3200, height: 1700, url: "plateforme.xsom.fr/couts" },
  seats: { src: `${MEDIA}/fleet-console-seats.webp`, width: 3200, height: 1220, url: "plateforme.xsom.fr/organisations-fournisseur" },
} as const;

/** Les chapitres, dans l'ordre de lecture : leur ancre et leur numéro. */
export const FLEET_CHAPTERS = ["securite", "finops", "strategie", "options", "film", "engagements", "questions"] as const;
export type FleetChapter = (typeof FLEET_CHAPTERS)[number];

type FilmChapter = { readonly id: string; readonly at: number; readonly title: string; readonly body: string };

export const FLEET_COPY = {
  fr: {
    meta: {
      title: "xSOM Fleet · la gestion de l’IA d’entreprise",
      description: "La gestion de l’IA d’entreprise : abonnements Claude et ChatGPT, clés API et modèles hébergés chez vous, gouvernés depuis une seule console. Sécurité sur chaque Poste, pilotage FinOps, stratégie IA.",
      ogAlt: "xSOM Fleet : la gestion de l’IA d’entreprise. Vos IA, xSOM Fleet, vos équipes.",
    },
    chapters: {
      securite: "Sécurité",
      finops: "FinOps",
      strategie: "Stratégie",
      options: "Options",
      film: "Démo vidéo",
      engagements: "Engagements",
      questions: "Questions",
    } satisfies Record<FleetChapter, string>,
    progress: "Chapitres de la page",
    demo: "Démonstration · données illustratives",
    simulation: "Simulation · hypothèses affichées",
    signIn: "Se connecter",
    hero: {
      title: "La gestion de l’IA d’entreprise.",
      lead: "Vos abonnements, vos clés API et vos modèles, gouvernés depuis une seule console.",
      contact: "Demander une démonstration",
      film: "Voir le film",
      pilot: "Programme pilote 2026",
      flow: {
        label: "Schéma : vos IA (abonnements Claude Code et Codex, modèles par API avec vos clés, vos modèles hébergés chez vous) passent par xSOM Fleet (Fleet Guard pour la sécurité, Fleet Sièges pour le FinOps, Fleet Gateway pour la stratégie, une Politique signée vérifiée sur chaque Poste) vers vos équipes : Postes, Développeurs et Équipes, Facture réelle, Dossier de preuves.",
        sources: "Vos IA",
        teams: "Vos équipes",
        claude: { name: "Claude Code", detail: "abonnement Claude" },
        codex: { name: "Codex", detail: "abonnement ChatGPT" },
        api: { name: "Modèles par API", detail: "vos clés" },
        hosted: { name: "Vos modèles", detail: "hébergés chez vous" },
        console: "une console",
        modules: [
          { key: "guard", tag: "Sécurité", name: "Fleet Guard", detail: "Contrôle avant envoi sur le Poste" },
          { key: "seats", tag: "FinOps", name: "Fleet Sièges", detail: "Sièges, Facture réelle, Équivalent API estimé" },
          { key: "gateway", tag: "Stratégie", name: "Fleet Gateway", detail: "Passerelle chez vous, Budgets API" },
        ],
        seal: "Politique signée, vérifiée sur chaque Poste",
        outputs: [
          { name: "Postes", detail: "Agent xSOM" },
          { name: "Développeurs et Équipes", detail: "Sièges, Paliers" },
          { name: "Facture réelle", detail: "par Équipe, par mois" },
          { name: "Dossier de preuves", detail: "pour l’audit" },
        ],
        schematic: "Schéma de principe",
        supported: "Pris en charge",
        trademarks: "Claude et ChatGPT sont des marques de leurs détenteurs, citées pour indiquer les services pris en charge, sans partenariat ni approbation.",
      },
    },
    guard: {
      title: "Les meilleures IA, accessibles en toute sécurité.",
      lead: "Chaque prompt et chaque fichier lu sont analysés sur le Poste, avant l’envoi. La valeur d’un secret ne sort jamais.",
      label: "Schéma de Fleet Guard : sur le Poste du Développeur, le prompt ou le fichier lu est analysé localement par l’Agent xSOM avec le moteur Secret Guard ; un secret détecté bloque l’envoi, avec le message réel de l’Agent xSOM ; l’assistant ne reçoit rien ; seul un Événement de blocage sans contenu part vers la console. La valeur du secret ne quitte jamais le Poste.",
      zone: "Poste du Développeur",
      never: "La valeur ne sort jamais de cette zone",
      input: { step: "Prompt ou fichier lu", code: ["Déploie avec", "AWS_ACCESS_KEY_ID=AKIA••••••••"], note: "Claude Code ou Codex, juste avant l’envoi." },
      scan: { step: "Analyse locale", points: ["Moteur Secret Guard, Apache-2.0", "Sans réseau ni modèle d’IA", "Pack de règles signé"] },
      stop: {
        step: "Bloqué avant envoi",
        message: "Envoi bloqué par xSOM Fleet : un secret a été détecté sur ce Poste. Sa valeur n’est ni affichée ni transmise.",
        rule: "Règle aws_access_key_id : Identifiant de clé d’accès AWS",
      },
      assistant: { where: "Assistant IA", what: "Ne reçoit rien", note: "Ni le prompt, ni le fichier, tant que le secret y est." },
      event: { where: "Console xSOM Fleet", what: "Un Événement sans contenu", note: "Forme du contrat, valeurs d’exemple." },
      policy: "Une Politique signée, vérifiée puis appliquée sur chaque Poste.",
      failClosed: "Analyse incomplète ou délai dépassé : l’envoi est bloqué aussi.",
      caption: "Schéma de principe. Message : texte exact de l’Agent xSOM.",
      source: "Lire le code de Secret Guard",
    },
    finops: {
      title: "Pilotage FinOps : réduisez fortement votre budget IA.",
      measure: {
        tag: "Mesure réelle",
        when: "Chez xSOM, septembre 2026",
        ratio: "× 39",
        ratioLine: "Le forfait Claude à 200 $ par mois (216 € TTC) a couvert 7 815 $ d’usage au tarif API.",
        claude: "Claude Code",
        codex: "Codex",
        plan: "Forfait",
        usage: "Usage au tarif API",
        claudePlan: "200 $",
        claudeUsage: "7 815 $",
        codexPlan: "103 € TTC",
        codexPlanNote: "en euros, jamais converti",
        codexUsage: "1 173 $",
        source: "Relevé avec ccusage (outil libre), sur les journaux d’un seul Poste, un utilisateur intensif. Tarifs API de l’outil : une estimation, pas une moyenne.",
        command: "ccusage monthly --since 20260901 --until 20260930",
        capture: "Voir le relevé ccusage",
        captureAlt: "Sortie de ccusage dans un terminal, commande ccusage monthly --since 20260901 --until 20260930 : rapport mensuel 2026-09 de Claude, Codex et OpenClaw ; Cost (USD) $7814.73 pour Claude et $1173.27 pour Codex, mis en évidence, $0.00 pour OpenClaw, total $8988.00.",
        captureClose: "Fermer le relevé",
      },
      sankey: {
        title: "Voyez où part chaque euro.",
        lead: "Du budget aux canaux, des canaux aux usages. Ce qui n’est rattaché à aucune Équipe reste visible.",
        label: "Simulation : un budget IA mensuel fictif de 100 k€ réparti en Sièges d’assistants (58 k€), API par la passerelle (30 k€) et modèles hébergés (12 k€), puis par usage : développement logiciel 55 k€, applications métier 25 k€, agents internes 12 k€, non attribué 8 k€.",
        columns: ["Budget", "Canaux", "Usages"],
        budget: { name: "Budget IA mensuel", value: "100 k€", note: "montant fictif" },
        channels: [
          { name: "Sièges d’assistants", value: "58 k€", detail: "Claude Code, Codex" },
          { name: "API par la passerelle", value: "30 k€", detail: "vos clés" },
          { name: "Modèles hébergés", value: "12 k€", detail: "chez vous" },
        ],
        uses: [
          { name: "Développement logiciel", value: "55 k€" },
          { name: "Applications métier", value: "25 k€" },
          { name: "Agents internes", value: "12 k€" },
          { name: "Non attribué", value: "8 k€" },
        ],
        legendChannels: "Canaux",
        legendUses: "Usages",
        hypotheses: "Hypothèses : budget mensuel fictif de 100 k€, montants arrondis, répartition illustrative. Aucune donnée client. Dans la console, les montants viennent des Sièges, des Dépassements saisis et, avec la passerelle, des Traces de passerelle.",
        action: "Demander la simulation pour votre entreprise",
      },
      console: {
        title: "Ce que vous payez, face à ce que vous consommez.",
        tabs: "Vues de la console",
        consoleLanguage: null as string | null,
        costs: {
          tab: "Coûts",
          alt: "Page Coûts de la console xSOM Fleet, vue Groupe, septembre 2026 : Facture réelle 25 476,00 $ (Sièges 23 636,00 $ et Dépassements 1 840,00 $) et, à part, Équivalent API estimé 44 043,62 $, estimation partielle. Données de démonstration.",
          real: "Facture réelle",
          realValue: "25 476,00 $",
          realNote: "Sièges et Dépassements, payés",
          estimate: "Équivalent API estimé",
          estimateValue: "44 043,62 $",
          estimateNote: "estimation, Catalogue de prix du 2026-07-01",
          never: "Jamais additionnés.",
          markReal: "Facture réelle (payée)",
          markEstimate: "Équivalent API estimé",
        },
        seats: {
          tab: "Sièges",
          alt: "Page Organisations fournisseur de la console xSOM Fleet : trois organisations Claude Team à 150 Sièges sur 150 et un Espace ChatGPT Business à 120 sur 200. Données de démonstration.",
          line: "Un Siège au-delà du Plafond est refusé.",
          value: "150/150",
          valueNote: "Sièges actifs / Plafond, par organisation",
          history: "Historique daté, au jour près, par Développeur.",
          mark: "Sièges / Plafond",
        },
      },
    },
    strategy: {
      title: "Une vraie stratégie IA, optimisée.",
      lead: "Le bon modèle pour chaque cas métier, par une passerelle installée chez vous.",
      pilot: "Fleet Gateway · disponible pour pilote",
      illustration: "Illustration",
      label: "Illustration de Fleet Gateway : une Politique de sélection associe à chaque cas métier un modèle, par API ou hébergé chez vous, avec son Budget API ; la passerelle est installée chez vous ; le déploiement se fait par étapes, d’un pilote à une Équipe puis au Groupe.",
      table: { title: "Politique de sélection", use: "Cas métier", model: "Modèle", budget: "Budget API" },
      rows: [
        { use: "Revue de code", model: "Modèle de pointe", where: "par API", budget: 0.72 },
        { use: "Support client", model: "Modèle rapide", where: "par API", budget: 0.46 },
        { use: "Documents RH", model: "Votre modèle", where: "hébergé chez vous", budget: 0.3, local: true },
        { use: "Recherche interne", model: "Modèle économique", where: "par API", budget: 0.2 },
      ],
      gateway: { name: "Passerelle chez vous", detail: "Aucun prompt ni aucune clé ne passe par xSOM : seules remontent des Traces de passerelle sans contenu." },
      rollout: { title: "Déploiement progressif", steps: ["Pilote", "Une Équipe", "Le Groupe"] },
      points: ["Budgets API par application", "Politique de sélection des modèles", "Déploiement Équipe par Équipe"],
    },
    options: {
      title: "Ce que fait xSOM Fleet, à chaque endroit de l’entreprise.",
      lead: "Choisissez une zone de cette entreprise type : ce qui s’installe, ce qui demande du conseil, et ce que chaque option ne couvre pas.",
      map: {
        map: "Carte isométrique d’une entreprise type : les métiers et les Externes dans leur navigateur, les Développeurs et leurs Postes, le proxy d’entreprise, les serveurs et agents internes, les Fournisseurs d’IA et la console xSOM Fleet, reliés par les demandes envoyées aux IA et leurs réponses, les échanges avec les Externes et, sous contrôle, l’usage et les coûts qui remontent à la console.",
        zones: "Zones de l’entreprise",
        overview: "Vue d’ensemble",
        zoom: "Zoomer sur la zone",
        hint: "Choisissez une zone sur la carte ou ci-dessous (flèches du clavier, Entrée pour zoomer, Échap pour revenir).",
        count: (n: number) => `${n} option${n > 1 ? "s" : ""}`,
        modes: { label: "État de l’entreprise", blind: "Angle mort", control: "Sous contrôle" },
        legend: { label: "Lecture des flux", request: "Demande envoyée à une IA", secret: "Secret dans la demande", stopped: "Secret remplacé au point de contrôle", reply: "Réponse du modèle, en retour", exchange: "Échange entre vos agents et les Externes", cost: "Usage et coûts vers la console, sous contrôle", reports: "Événements sans contenu vers la console", group: "Pointillés : le Groupe" },
        places: {
          metiers: { name: "Métiers", sub: "claude.ai, chatgpt.com" },
          externes: { name: "Externes", sub: "hors du Groupe" },
          "postes-dev": { name: "Développeurs", sub: "Claude Code, Codex" },
          proxy: { name: "Proxy d’entreprise" },
          serveurs: { name: "Serveurs et agents", sub: "applications, API" },
          cloud: { name: "Fournisseurs d’IA" },
          console: { name: "Console xSOM Fleet", sub: "Dans l’UE ou chez vous" },
        },
        shields: {
          "postes-dev": "Agent xSOM",
          proxy: "Contrôle web",
          serveurs: "Passerelle API",
          externes: "Extension",
          cloud: "Serveur de verdict",
          console: "Preuves et coûts",
        },
        module: "Module",
        states: {
          metiers: {
            blind: "Un contrat, un fichier client ou un mot de passe collé dans une conversation part tel quel. Personne ne sait quels comptes sont utilisés, ni lesquels sont personnels.",
            control: "Le proxy limite l’accès aux espaces de l’entreprise et refuse les comptes personnels. Le contrôle web arrête les secrets avant l’envoi, sans lire ni stocker les conversations.",
            module: "Fleet Guard",
          },
          externes: {
            blind: "Hors du proxy, hors de vos Postes : leurs envois ne passent par aucun contrôle.",
            control: "Une extension de navigateur, installée d’office sur les navigateurs gérés, analyse chaque message dans la page avec le même moteur que sur le Poste.",
            module: "Fleet Guard",
          },
          "postes-dev": {
            blind: "L’assistant de code lit le dépôt, les fichiers .env et les captures d’écran, puis envoie au modèle ce qu’il a lu.",
            control: "L’Agent xSOM contrôle chaque envoi sur le Poste. Les secrets sont remplacés par des Substituts avant de partir, et rendus seulement là où ils doivent servir. Rien ne quitte le Poste en clair.",
            module: "Fleet Guard",
          },
          proxy: {
            blind: "Il voit passer le trafic, mais pas ce que contient une conversation chiffrée avec un assistant.",
            control: "Restriction aux espaces de l’entreprise, inspection des flux d’IA, et un service d’analyse branché derrière le proxy qui arrête les secrets avant qu’ils n’atteignent le modèle.",
            module: "Fleet Guard",
          },
          serveurs: {
            blind: "Des clés d’API partagées, des dépenses sans budget, des agents qui appellent des outils sans que personne ne valide.",
            control: "La Passerelle API, installée chez vous, donne une Clé virtuelle et un Budget API à chaque Application API, tient la liste des outils autorisés et demande une approbation humaine pour les actions sensibles. Aucun prompt ne passe par xSOM.",
            module: "Fleet Gateway",
          },
          cloud: {
            blind: "Claude, ChatGPT, Azure OpenAI, Microsoft Copilot ou un autre : une fois le message arrivé chez un Fournisseur, il est trop tard pour le reprendre. Et chacun facture de son côté.",
            control: "Chez les Fournisseurs qui proposent des Inference hooks, chaque message passe d’abord par votre Serveur de verdict : refusé, il n’est jamais lu par le modèle. Leurs coûts remontent à la console : Sièges, Dépassements et dépenses API.",
            module: "Fleet Guard",
          },
          console: {
            blind: "Des Sièges payés sans savoir qui les utilise, un coût par Équipe inconnu, et rien à montrer le jour de l’audit.",
            control: "Les Sièges et leurs Plafonds par organisation, le coût réel de chaque Développeur face à son Équivalent API estimé, la couverture des Postes, et un Dossier de preuves signé pour l’audit.",
            module: "Fleet Sièges",
          },
        },
        product: { title: "Produit installable", hint: "S’installe et s’exploite chez vous ; certaines options demandent une mise en place en conseil." },
        consulting: { title: "Conseil et intégration", hint: "Paramétrage de vos outils et de ceux des Fournisseurs, essais, accompagnement : sans code xSOM." },
        none: "Aucune option de ce type ici.",
        more: "Plus de détails",
        fields: { covers: "Couvre", limits: "Ne couvre pas", prerequisites: "Prérequis", productPart: "Part produit", consultingPart: "Part conseil", state: "État réel", module: "Module", sources: "Sources", read: "lue le" },
        inMatrix: "Voir dans la matrice",
        compare: "Comparer toutes les options",
      },
      matrix: {
        title: "Toutes les options, côte à côte.",
        lead: "Par niveau, FinOps compris : où chaque option agit, en partie ou pas du tout, ce qui s’installe et ce qui relève du conseil, et son état réel.",
        region: "Matrice de comparaison des options",
        caption: "Options par niveau et par surface",
        option: "Option",
        nature: "Nature",
        state: "État réel",
        scroll: "Sur un petit écran, faites défiler le tableau dans son cadre.",
        legend: "Lecture des cellules",
        kinds: "Natures",
      },
      provenance: (date: string, research: string) => `Catalogue d’options du ${date}. Capacités des outils tiers selon leur documentation, lue le ${research} ; « selon le vendeur » : affirmation non vérifiée par xSOM.`,
      trademarks: "Les produits et éditeurs tiers cités sont des marques de leurs détenteurs, nommés pour décrire des options, sans partenariat ni approbation.",
      schematic: "Schéma de principe",
    },
    film: {
      title: "Voyez-le en 72 secondes.",
      lead: "La console et le Poste, avec voix off. Activez le son.",
      film: "Film de présentation de xSOM Fleet, avec voix off et sous-titres incrustés : choisir ses IA, une Politique signée pour tous les Postes, la supervision de chaque Poste, un secret arrêté sur le Poste, la facture IA, puis le Dossier de preuves. Captures de la console sur des données de démonstration.",
      play: "Lire le film",
      pause: "Mettre le film en pause",
      unmute: "Activer le son",
      mute: "Couper le son",
      chapters: "Chapitres du film",
      steps: [
        { id: "choose", at: 0, title: "Choisissez vos IA", body: "Abonnements et API au même endroit." },
        { id: "policy", at: 10.55, title: "Une Politique pour tous les Postes", body: "Signée, vérifiée, appliquée." },
        { id: "coverage", at: 19.55, title: "Supervisez", body: "L’état de chaque Poste." },
        { id: "invisible", at: 28.55, title: "Rien ne change pour vos équipes", body: "Un secret arrêté sur le Poste." },
        { id: "costs", at: 41.07, title: "Maîtrisez votre facture IA", body: "Facture réelle et Équivalent API estimé." },
        { id: "proof", at: 53.78, title: "Prouvez votre maîtrise", body: "Le Dossier de preuves, en un clic." },
      ] satisfies readonly FilmChapter[],
    },
    commitments: {
      title: "Licences, sources et engagements.",
      lead: "Des pièces qu’un auditeur peut vérifier, pas des promesses.",
      badges: [
        { id: "apache", value: "Apache-2.0", caption: "Secret Guard, le moteur de détection, en code ouvert", link: true },
        { id: "mit", value: "MIT", caption: "LiteLLM, sa seule partie MIT, à une version épinglée" },
        { id: "sbom", value: "SBOM", caption: "Inventaire CycloneDX, licences en liste fermée" },
        { id: "eu", value: "UE ou chez vous", caption: "Console hébergée dans l’Union européenne, ou installée chez vous" },
        { id: "zero", value: "0 prompt", caption: "Ni prompt, ni clé, ni code, ni valeur d’un secret chez xSOM" },
        { id: "dossier", value: "Dossier de preuves", caption: "En JSON et en PDF, journaux chaînés que vous vérifiez" },
      ],
      source: "Code source de Secret Guard",
    },
    faq: {
      title: "Questions fréquentes.",
      items: [
        ["xSOM voit-il nos prompts ou nos clés ?", "Non. Le Contrôle avant envoi tourne sur le Poste, sans réseau ni modèle d’IA, et la passerelle reste chez vous. Seuls remontent des métriques d’usage et des Événements sans contenu."],
        ["Est-ce permis par les fournisseurs ?", "Vos développeurs gardent l’outil officiel, non modifié, avec leur propre connexion ; aucun identifiant n’est collecté, aucun compte n’est revendu. L’agent écrit seulement les réglages que chaque fournisseur documente pour les entreprises."],
        ["Quels assistants sont couverts ?", "Claude Code et Codex, sur les Postes Windows, macOS et Linux ; par la passerelle Fleet Gateway, vos applications API et vos modèles hébergés chez vous. ChatGPT sur le web, Copilot et les modèles lancés sur le Poste lui-même ne le sont pas encore : d’autres assistants suivront, sans date annoncée."],
        ["À partir de combien de développeurs ?", "150 et plus. En dessous, une seule organisation Claude Team suffit."],
        ["Et si le contrôle échoue ?", "L’envoi est bloqué, avec un message clair. Un contenu trop gros, une analyse incomplète ou un délai dépassé ne laissent jamais partir un envoi partiel. Le contrôle ne fait aucun appel réseau vers xSOM."],
        ["Comment se déroule le déploiement ?", "Votre outil de gestion de flotte, Intune ou un autre, installe l’agent xSOM. D’abord une démonstration gratuite sur nos propres comptes, puis un pilote de deux à trois mois chez vous, puis le Groupe entier."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par développeur gouverné, sur devis : demandez un tarif. La démonstration est gratuite."],
      ],
    },
    final: {
      title: "Voyez la console sur un Groupe de démonstration.",
      lead: "Trente minutes, avec vos questions de DSI, de RSSI et d’acheteur.",
      demo: "Demander une démonstration",
      price: "Demander un tarif",
      note: "Abonnement annuel par développeur gouverné, sur devis.",
    },
  },
  en: {
    meta: {
      title: "xSOM Fleet · enterprise AI management",
      description: "Enterprise AI management: Claude and ChatGPT subscriptions, API keys and models hosted on your side, governed from a single console. Security on every workstation, FinOps steering, AI strategy.",
      ogAlt: "xSOM Fleet: enterprise AI management. Your AI, xSOM Fleet, your teams.",
    },
    chapters: {
      securite: "Security",
      finops: "FinOps",
      strategie: "Strategy",
      options: "Options",
      film: "Video demo",
      engagements: "Commitments",
      questions: "Questions",
    } satisfies Record<FleetChapter, string>,
    progress: "Page chapters",
    demo: "Demonstration · illustrative data",
    simulation: "Simulation · assumptions shown",
    signIn: "Sign in",
    hero: {
      title: "Enterprise AI management.",
      lead: "Your subscriptions, API keys and models, governed from a single console.",
      contact: "Request a demo",
      film: "Watch the film",
      pilot: "2026 pilot programme",
      flow: {
        label: "Diagram: your AI (Claude Code and Codex subscriptions, API models with your keys, your models hosted on your side) goes through xSOM Fleet (Fleet Guard for security, Fleet Sièges for FinOps, Fleet Gateway for strategy, a signed Policy checked on every workstation) to your teams: workstations, developers and teams, actual invoice, evidence dossier.",
        sources: "Your AI",
        teams: "Your teams",
        claude: { name: "Claude Code", detail: "Claude subscription" },
        codex: { name: "Codex", detail: "ChatGPT subscription" },
        api: { name: "API models", detail: "your keys" },
        hosted: { name: "Your models", detail: "hosted on your side" },
        console: "one console",
        modules: [
          { key: "guard", tag: "Security", name: "Fleet Guard", detail: "Pre-send check on the workstation" },
          { key: "seats", tag: "FinOps", name: "Fleet Sièges", detail: "Seats, actual invoice, estimated API equivalent" },
          { key: "gateway", tag: "Strategy", name: "Fleet Gateway", detail: "Gateway on your side, API budgets" },
        ],
        seal: "Signed Policy, checked on every workstation",
        outputs: [
          { name: "Workstations", detail: "xSOM agent" },
          { name: "Developers and teams", detail: "seats, tiers" },
          { name: "Actual invoice", detail: "per team, per month" },
          { name: "Evidence dossier", detail: "for audit" },
        ],
        schematic: "Schematic",
        supported: "Supported",
        trademarks: "Claude and ChatGPT are trademarks of their owners, cited to name the supported services, with no partnership or endorsement.",
      },
    },
    guard: {
      title: "The best AI, made safe to use.",
      lead: "Every prompt and every file read is checked on the workstation before it is sent. A secret’s value never leaves it.",
      label: "Fleet Guard diagram: on the developer’s workstation, the prompt or file read is checked locally by the xSOM agent with the Secret Guard engine; a detected secret blocks the send, with the xSOM agent’s real message; the assistant receives nothing; only a block event without content goes to the console. The secret’s value never leaves the workstation.",
      zone: "Developer’s workstation",
      never: "The value never leaves this zone",
      input: { step: "Prompt or file read", code: ["Deploy with", "AWS_ACCESS_KEY_ID=AKIA••••••••"], note: "Claude Code or Codex, just before sending." },
      scan: { step: "Local check", points: ["Secret Guard engine, Apache-2.0", "No network, no AI model", "Signed rule pack"] },
      stop: {
        step: "Blocked before sending",
        message: "Sending blocked by xSOM Fleet: a secret was detected on this Poste. Its value is neither displayed nor transmitted.",
        rule: "Rule aws_access_key_id: AWS access key ID",
      },
      assistant: { where: "AI assistant", what: "Receives nothing", note: "Neither the prompt nor the file, while the secret is in it." },
      event: { where: "xSOM Fleet console", what: "An event without content", note: "Contract shape, example values." },
      policy: "One signed Policy, checked then applied on every workstation.",
      failClosed: "Incomplete scan or timeout: the send is blocked too.",
      caption: "Schematic. Message: the xSOM agent’s exact text.",
      source: "Read the Secret Guard code",
    },
    finops: {
      title: "FinOps steering: cut your AI budget sharply.",
      measure: {
        tag: "Real measurement",
        when: "At xSOM, September 2026",
        ratio: "× 39",
        ratioLine: "The Claude plan at $200 per month (€216 incl. VAT) covered $7,815 of usage at API rates.",
        claude: "Claude Code",
        codex: "Codex",
        plan: "Plan",
        usage: "Usage at API rates",
        claudePlan: "$200",
        claudeUsage: "$7,815",
        codexPlan: "€103 incl. VAT",
        codexPlanNote: "in euros, never converted",
        codexUsage: "$1,173",
        source: "Read with ccusage (a free tool) from the logs of a single workstation, one heavy user. API rates are the tool’s own: an estimate, not an average.",
        command: "ccusage monthly --since 20260901 --until 20260930",
        capture: "See the ccusage report",
        captureAlt: "ccusage output in a terminal, command ccusage monthly --since 20260901 --until 20260930: monthly report for 2026-09 of Claude, Codex and OpenClaw; Cost (USD) $7814.73 for Claude and $1173.27 for Codex, highlighted, $0.00 for OpenClaw, total $8988.00.",
        captureClose: "Close the report",
      },
      sankey: {
        title: "See where every euro goes.",
        lead: "From budget to channels, from channels to uses. Whatever is tied to no team stays visible.",
        label: "Simulation: a fictitious monthly AI budget of €100k split into assistant seats (€58k), APIs through the gateway (€30k) and hosted models (€12k), then by use: software development €55k, business applications €25k, internal agents €12k, unattributed €8k.",
        columns: ["Budget", "Channels", "Uses"],
        budget: { name: "Monthly AI budget", value: "€100k", note: "fictitious amount" },
        channels: [
          { name: "Assistant seats", value: "€58k", detail: "Claude Code, Codex" },
          { name: "APIs via the gateway", value: "€30k", detail: "your keys" },
          { name: "Hosted models", value: "€12k", detail: "on your side" },
        ],
        uses: [
          { name: "Software development", value: "€55k" },
          { name: "Business applications", value: "€25k" },
          { name: "Internal agents", value: "€12k" },
          { name: "Unattributed", value: "€8k" },
        ],
        legendChannels: "Channels",
        legendUses: "Uses",
        hypotheses: "Assumptions: fictitious monthly budget of €100k, rounded amounts, illustrative split. No customer data. In the console, amounts come from seats, entered overages and, with the gateway, gateway traces.",
        action: "Request the simulation for your company",
      },
      console: {
        title: "What you pay, next to what you use.",
        tabs: "Console views",
        consoleLanguage: "The console is shown in French." as string | null,
        costs: {
          tab: "Costs",
          alt: "Costs page of the xSOM Fleet console, group view, September 2026: actual invoice $25,476.00 (seats $23,636.00 and overages $1,840.00) and, separately, estimated API equivalent $44,043.62, partial estimate. Demonstration data.",
          real: "Actual invoice",
          realValue: "$25,476.00",
          realNote: "seats and overages, paid",
          estimate: "Estimated API equivalent",
          estimateValue: "$44,043.62",
          estimateNote: "estimate, price catalogue of 2026-07-01",
          never: "Never added together.",
          markReal: "Actual invoice (paid)",
          markEstimate: "Estimated API equivalent",
        },
        seats: {
          tab: "Seats",
          alt: "Provider organisations page of the xSOM Fleet console: three Claude Team organisations at 150 seats out of 150 and one ChatGPT Business workspace at 120 out of 200. Demonstration data.",
          line: "A seat beyond the cap is refused.",
          value: "150/150",
          valueNote: "active seats / cap, per organisation",
          history: "Dated history, to the day, per developer.",
          mark: "Seats / cap",
        },
      },
    },
    strategy: {
      title: "A real AI strategy, optimised.",
      lead: "The right model for every business case, through a gateway installed on your side.",
      pilot: "Fleet Gateway · available for pilot",
      illustration: "Illustration",
      label: "Fleet Gateway illustration: a selection Policy gives every business case a model, by API or hosted on your side, with its API budget; the gateway is installed on your side; rollout happens in stages, from a pilot to a team, then to the group.",
      table: { title: "Selection Policy", use: "Business case", model: "Model", budget: "API budget" },
      rows: [
        { use: "Code review", model: "Frontier model", where: "by API", budget: 0.72 },
        { use: "Customer support", model: "Fast model", where: "by API", budget: 0.46 },
        { use: "HR documents", model: "Your model", where: "hosted on your side", budget: 0.3, local: true },
        { use: "Internal search", model: "Low-cost model", where: "by API", budget: 0.2 },
      ],
      gateway: { name: "Gateway on your side", detail: "No prompt and no key goes through xSOM: only gateway traces without content are sent." },
      rollout: { title: "Progressive rollout", steps: ["Pilot", "One team", "The group"] },
      points: ["API budgets per application", "Model selection Policy", "Rollout team by team"],
    },
    options: {
      title: "What xSOM Fleet does, at every point of the company.",
      lead: "Pick an area of this typical company: what gets installed, what takes consulting, and what each option does not cover.",
      map: {
        map: "Isometric map of a typical company: business teams and Externals in their browser, Developers and their workstations, the corporate proxy, internal servers and agents, the AI Providers and the xSOM Fleet console, linked by the requests sent to AI and their responses, the exchanges with Externals and, under control, the usage and costs reported to the console.",
        zones: "Areas of the company",
        overview: "Overview",
        zoom: "Zoom on the area",
        hint: "Pick an area on the map or below (arrow keys, Enter to zoom, Escape to go back).",
        count: (n: number) => `${n} option${n > 1 ? "s" : ""}`,
        modes: { label: "State of the company", blind: "Blind spot", control: "Under control" },
        legend: { label: "Reading the flows", request: "Request sent to an AI", secret: "Secret in the request", stopped: "Secret replaced at the checkpoint", reply: "Model response, coming back", exchange: "Exchange between your agents and Externals", cost: "Usage and costs to the console, under control", reports: "Events without content to the console", group: "Dashed line: the Group" },
        places: {
          metiers: { name: "Business teams", sub: "claude.ai, chatgpt.com" },
          externes: { name: "Externals", sub: "outside the Group" },
          "postes-dev": { name: "Developers", sub: "Claude Code, Codex" },
          proxy: { name: "Corporate proxy" },
          serveurs: { name: "Servers and agents", sub: "applications, APIs" },
          cloud: { name: "AI Providers" },
          console: { name: "xSOM Fleet console", sub: "In the EU or on your side" },
        },
        shields: {
          "postes-dev": "xSOM agent",
          proxy: "Web check",
          serveurs: "API Gateway",
          externes: "Extension",
          cloud: "Verdict Server",
          console: "Evidence and costs",
        },
        module: "Module",
        states: {
          metiers: {
            blind: "A contract, a customer file or a password pasted into a conversation leaves as is. Nobody knows which accounts are used, nor which ones are personal.",
            control: "The proxy limits access to the company’s workspaces and refuses personal accounts. The web check stops secrets before sending, without reading or storing conversations.",
            module: "Fleet Guard",
          },
          externes: {
            blind: "Outside the proxy, outside your workstations: what they send goes through no check at all.",
            control: "A browser extension, force-installed on managed browsers, analyses every message in the page with the same engine as on the workstation.",
            module: "Fleet Guard",
          },
          "postes-dev": {
            blind: "The coding assistant reads the repository, the .env files and the screenshots, then sends what it read to the model.",
            control: "The xSOM agent checks every send on the workstation. Secrets are replaced by substitutes before leaving, and restored only where they are needed. Nothing leaves the workstation in clear text.",
            module: "Fleet Guard",
          },
          proxy: {
            blind: "It sees the traffic go by, but not what an encrypted conversation with an assistant contains.",
            control: "Restriction to the company’s workspaces, inspection of AI flows, and an analysis service plugged in behind the proxy that stops secrets before they reach the model.",
            module: "Fleet Guard",
          },
          serveurs: {
            blind: "Shared API keys, spending without a budget, agents calling tools with nobody approving.",
            control: "The API Gateway, installed on your side, gives every API application a virtual key and an API budget, keeps the list of allowed tools and asks for human approval on sensitive actions. No prompt goes through xSOM.",
            module: "Fleet Gateway",
          },
          cloud: {
            blind: "Claude, ChatGPT, Azure OpenAI, Microsoft Copilot or another: once the message has reached a Provider, it is too late to take it back. And each one bills on its own.",
            control: "With the Providers that offer Inference hooks, every message first goes through your Verdict Server: refused, it is never read by the model. Their costs are reported to the console: seats, overages and API spending.",
            module: "Fleet Guard",
          },
          console: {
            blind: "Seats paid for without knowing who uses them, an unknown cost per team, and nothing to show on audit day.",
            control: "Seats and their caps per organisation, the actual cost of every developer next to their estimated API equivalent, workstation coverage, and a signed evidence dossier for the audit.",
            module: "Fleet Sièges",
          },
        },
        product: { title: "Installable product", hint: "Installed and run on your side; some options need a consulting setup." },
        consulting: { title: "Consulting and integration", hint: "Configuration of your tools and the Providers’ tools, tests, support: no xSOM code." },
        none: "No option of this kind here.",
        more: "More details",
        fields: { covers: "Covers", limits: "Does not cover", prerequisites: "Prerequisites", productPart: "Product part", consultingPart: "Consulting part", state: "Actual state", module: "Module", sources: "Sources", read: "read on" },
        inMatrix: "See in the matrix",
        compare: "Compare all options",
      },
      matrix: {
        title: "All options, side by side.",
        lead: "By level, FinOps included: where each option acts, partly or not at all, what gets installed and what is consulting, and its actual state.",
        region: "Option comparison matrix",
        caption: "Options by level and by surface",
        option: "Option",
        nature: "Kind",
        state: "Actual state",
        scroll: "On a small screen, scroll the table inside its frame.",
        legend: "Reading the cells",
        kinds: "Kinds",
      },
      provenance: (date: string, research: string) => `Option catalogue of ${date}. Third-party capabilities according to their documentation, read on ${research}; “according to the vendor”: claim not verified by xSOM.`,
      trademarks: "Third-party products and vendors cited are trademarks of their owners, named to describe options, with no partnership or endorsement.",
      schematic: "Schematic diagram",
    },
    film: {
      title: "See it in 80 seconds.",
      lead: "The console and the workstation, with voice-over. Turn the sound on.",
      film: "xSOM Fleet presentation film, with voice-over and burned-in subtitles: choosing your AI, one signed Policy for every workstation, supervising every workstation, a secret stopped on the workstation, the AI bill, then the evidence dossier. Console captures on demonstration data.",
      play: "Play the film",
      pause: "Pause the film",
      unmute: "Turn sound on",
      mute: "Turn sound off",
      chapters: "Film chapters",
      steps: [
        { id: "choose", at: 0, title: "Choose your AI", body: "Subscriptions and APIs in one place." },
        { id: "policy", at: 13.71, title: "One Policy for every workstation", body: "Signed, checked, applied." },
        { id: "coverage", at: 23.3, title: "Supervise", body: "The status of every workstation." },
        { id: "invisible", at: 32.3, title: "Nothing changes for your teams", body: "A secret stopped on the workstation." },
        { id: "costs", at: 46.25, title: "Control your AI bill", body: "Actual invoice and estimated API equivalent." },
        { id: "proof", at: 60.36, title: "Prove you are in control", body: "The evidence dossier, in one click." },
      ] satisfies readonly FilmChapter[],
    },
    commitments: {
      title: "Licences, sources and commitments.",
      lead: "Documents an auditor can check, not promises.",
      badges: [
        { id: "apache", value: "Apache-2.0", caption: "Secret Guard, the detection engine, as open code", link: true },
        { id: "mit", value: "MIT", caption: "LiteLLM, its MIT part only, at a pinned version" },
        { id: "sbom", value: "SBOM", caption: "CycloneDX inventory, licences in a closed list" },
        { id: "eu", value: "EU or on your side", caption: "Console hosted in the European Union, or installed on your side" },
        { id: "zero", value: "0 prompts", caption: "No prompt, key, code or secret value at xSOM" },
        { id: "dossier", value: "Evidence dossier", caption: "As JSON and PDF, chained logs you can check" },
      ],
      source: "Secret Guard source code",
    },
    faq: {
      title: "Frequently asked questions.",
      items: [
        ["Does xSOM see our prompts or keys?", "No. The pre-send check runs on the workstation, with no network and no AI model, and the gateway stays on your side. Only usage metrics and events without content are sent."],
        ["Do the providers allow it?", "Your developers keep the official, unmodified tool with their own sign-in; no credential is collected and no account is resold. The agent only writes the settings each provider documents for enterprises."],
        ["Which assistants are covered?", "Claude Code and Codex, on Windows, macOS and Linux workstations; through the Fleet Gateway, your API applications and your models hosted on your side. ChatGPT on the web, Copilot and models run on the workstation itself are not covered yet: other assistants will follow, with no date announced."],
        ["From how many developers?", "150 and more. Below that, a single Claude Team organization is enough."],
        ["What if the check fails?", "The send is blocked, with a clear message. Oversized content, an incomplete scan or a timeout never lets a partial send through. The check makes no network call to xSOM."],
        ["How does the rollout work?", "Your fleet management tool, Intune or another, installs the xSOM agent. First a free demo on our own accounts, then a two-to-three-month pilot on your side, then the whole group."],
        ["How much does xSOM Fleet cost?", "An annual subscription per governed developer, on quotation: request pricing. The demo is free."],
      ],
    },
    final: {
      title: "See the console on a demonstration group.",
      lead: "Thirty minutes, with your CIO, CISO and buyer questions.",
      demo: "Request a demo",
      price: "Request pricing",
      note: "Annual subscription per governed developer, on quotation.",
    },
  },
} as const;
