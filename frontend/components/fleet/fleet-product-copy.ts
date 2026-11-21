/**
 * La page produit de xSOM Fleet (`fleet.xsom.fr`) : une promesse, puis cinq sections
 * courtes (Sécurité, FinOps, Stratégie, Audit, Déploiement), chacune avec un titre, une
 * phrase et une preuve concrète, puis les questions et l'appel final. Le détail technique
 * (schéma complet, Événement, simulation, options, matrice, engagements) est rangé sur
 * `/details` (`FleetDetailsPage`).
 *
 * Mêmes règles que `fleet-copy.ts` : aucun client nommé, aucun prix publié, aucun chiffre
 * sans source ni date ; jamais « conforme », « certifié », « garanti » ; toute estimation
 * porte « estimation » et sa date ; toute simulation porte « Simulation · hypothèses
 * affichées ». Les marques des fournisseurs sont citées seulement comme services pris en
 * charge, avec la mention de marques. Vocabulaire : glossaire du PRD (§3).
 */

/** Les sections de la page, dans l'ordre de lecture (ancres du menu). */
export const FLEET_SECTIONS = ["securite", "finops", "strategie", "audit", "deploiement", "film", "questions"] as const;

export const FLEET_PRODUCT_COPY = {
  fr: {
    hero: {
      kicker: "xSOM Fleet",
      title: "Les assistants de code pour toute l’entreprise, sans fuite de secrets.",
      lead: "xSOM Fleet expurge les secrets sur chaque Poste avant l’envoi, montre le coût réel par Développeur et réunit les preuves pour l’audit.",
      demo: "Demander une démonstration",
      guard: "Essayer gratuitement Secret Guard",
      guardNote: "Gratuit jusqu’à 3 Postes",
      example: {
        label: "Exemple : un prompt sur un Poste équipé",
        typed: "Le Développeur écrit",
        sent: "Le modèle reçoit",
        before: "Connecte-toi à la base avec le mot de passe ",
        value: "••••••••••••",
        substitute: "XXXXXXXXXXX1",
        note: "Le Substitut part à la place du secret ; la vraie valeur reste sur le Poste.",
      },
    },
    supported: {
      label: "Pris en charge",
      items: [
        { name: "Claude Code" },
        { name: "Codex" },
        { name: "GitHub Copilot CLI" },
        { name: "Claude Desktop", detail: "Mode précis, macOS" },
        { name: "Le web", detail: "par extension de navigateur" },
      ],
      trademarks: "Claude, ChatGPT, Codex et GitHub Copilot sont des marques de leurs détenteurs, citées pour indiquer les services pris en charge, sans partenariat ni approbation.",
    },
    security: {
      kicker: "Sécurité · Fleet Guard",
      title: "Les secrets sont expurgés avant l’envoi, pas seulement bloqués.",
      lead: "Le Développeur continue de travailler : seul le secret est remplacé, même dans une capture d’écran.",
      points: [
        { title: "Avant l’envoi", body: "Chaque prompt et chaque fichier lu sont analysés sur le Poste, sans réseau ni modèle d’IA." },
        { title: "Transparent", body: "Le message part avec un Substitut ; une ligne l’annonce dans la conversation." },
        { title: "Même dans les images", body: "La zone d’un jeton est recouverte sur une copie de l’image." },
      ],
      more: "Voir le schéma complet et le message de blocage",
    },
    finops: {
      kicker: "FinOps · Fleet Sièges",
      title: "Le coût réel, par Développeur et par Équipe.",
      lead: "Ce que vous payez en Sièges, face à ce que vous consommez au tarif API. Jamais additionnés.",
      ratio: "× 39",
      ratioLine: "Un forfait Claude à 200 $/mois a couvert 7 815 $ d’usage au tarif API.",
      tag: "Mesure réelle",
      when: "Chez xSOM, septembre 2026",
      source: "Relevé ccusage sur un Poste, un utilisateur intensif. Tarifs API de l’outil : une estimation, septembre 2026, pas une moyenne.",
      console: "La console, sur un Groupe de démonstration",
    },
    strategy: {
      kicker: "Stratégie · Fleet Gateway",
      title: "Abonnements, API ou modèle chez vous : choisissez sur des chiffres.",
      lead: "Fleet Gateway, installée chez vous, donne un Budget API à chaque application. Aucun prompt ni aucune clé ne passe par xSOM.",
      pilot: "Disponible pour pilote",
      channels: [
        { name: "Abonnements", body: "Sièges à prix fixe, pour les Développeurs les plus actifs.", proof: "× 39 mesuré chez xSOM, septembre 2026" },
        { name: "API", body: "Payée à l’usage, plafonnée par un Budget API par application.", proof: "Budget API par application" },
        { name: "Modèle chez vous", body: "Pour les données qui ne doivent pas sortir.", proof: "Hébergé chez vous" },
      ],
      action: "Demander la simulation pour votre entreprise",
      more: "Voir une simulation",
    },
    audit: {
      kicker: "Preuves pour l’audit",
      title: "Des preuves que l’auditeur vérifie lui-même.",
      lead: "Chaque blocage et chaque expurgation laissent un Événement sans contenu. Rien d’autre ne quitte le Poste.",
      items: [
        { title: "Dossier de preuves", body: "En JSON et en PDF, journaux chaînés que vous vérifiez." },
        { title: "Journal des blocages", body: "Quel Poste, quelle règle, quand. Jamais la valeur." },
        { title: "Rien ne quitte le Poste", body: "Ni prompt, ni clé, ni valeur d’un secret chez xSOM." },
      ],
      event: "Voir l’Événement envoyé à la console",
      eventNote: "Forme du contrat, valeurs d’exemple : aucune valeur ni aucun extrait du secret.",
      licences: "Détection : Secret Guard, Apache-2.0. Expurgation : PolyForm Small Business 1.0.0.",
      source: "Lire le code de Secret Guard",
    },
    deploy: {
      kicker: "Déploiement",
      title: "En place en trois étapes.",
      steps: [
        { title: "Le Client Fleet sur chaque Poste", body: "Votre outil de gestion de flotte, Intune ou un autre, l’installe sur Windows, macOS et Linux." },
        { title: "Une Politique signée", body: "Règle par règle : bloquer ou expurger. Chaque Poste vérifie la signature avant de l’appliquer." },
        { title: "La console", body: "Postes couverts, coûts, Dossier de preuves. Hébergée dans l’Union européenne, ou chez vous." },
      ],
      pilot: "Une démonstration gratuite, puis un pilote de deux à trois mois chez vous.",
    },
    film: { kicker: "Démo vidéo" },
    faq: {
      title: "Questions fréquentes",
      items: [
        ["xSOM voit-il nos prompts ou nos clés ?", "Non. L’analyse tourne sur le Poste et la passerelle reste chez vous. Seuls remontent des métriques d’usage et des Événements sans contenu."],
        ["Les Développeurs changent-ils d’outil ?", "Non. Ils gardent l’assistant officiel, non modifié, avec leur propre connexion. Aucun identifiant n’est collecté."],
        ["Et si l’analyse échoue ?", "L’envoi est bloqué, avec un message clair. Jamais d’envoi partiel."],
        ["À partir de combien de Développeurs ?", "150 et plus. En dessous, une seule organisation Claude Team suffit."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par Développeur gouverné, sur devis. La démonstration est gratuite."],
      ],
    },
    final: {
      title: "Voyez la console sur un Groupe de démonstration.",
      lead: "Trente minutes, avec vos questions de DSI, de RSSI et d’acheteur.",
      demo: "Demander une démonstration",
      price: "Demander un tarif",
      details: "Tout le détail : schéma, options, engagements",
    },
    details: {
      title: "xSOM Fleet en détail.",
      lead: "Le schéma complet, l’Événement envoyé, la simulation, les options par niveau et les engagements.",
      back: "Retour à la présentation",
      meta: "xSOM Fleet en détail · schéma, options et engagements",
      description: "Le détail de xSOM Fleet : schéma complet, message de blocage et Événement, simulation des coûts, options sur une entreprise type, matrice de comparaison, licences et engagements.",
    },
  },
  en: {
    hero: {
      kicker: "xSOM Fleet",
      title: "Coding assistants for the whole company, without leaking secrets.",
      lead: "xSOM Fleet redacts secrets on every workstation before they are sent, shows the real cost per developer and gathers the evidence for audit.",
      demo: "Request a demo",
      guard: "Try Secret Guard for free",
      guardNote: "Free for up to 3 workstations",
      example: {
        label: "Example: a prompt on an equipped workstation",
        typed: "The developer writes",
        sent: "The model receives",
        before: "Connect to the database with the password ",
        value: "••••••••••••",
        substitute: "XXXXXXXXXXX1",
        note: "The substitute is sent instead of the secret; the real value stays on the workstation.",
      },
    },
    supported: {
      label: "Supported",
      items: [
        { name: "Claude Code" },
        { name: "Codex" },
        { name: "GitHub Copilot CLI" },
        { name: "Claude Desktop", detail: "Precise mode, macOS" },
        { name: "The web", detail: "through a browser extension" },
      ],
      trademarks: "Claude, ChatGPT, Codex and GitHub Copilot are trademarks of their owners, named to indicate the supported services, with no partnership or endorsement.",
    },
    security: {
      kicker: "Security · Fleet Guard",
      title: "Secrets are redacted before sending, not just blocked.",
      lead: "Developers keep working: only the secret is replaced, even in a screenshot.",
      points: [
        { title: "Before sending", body: "Every prompt and every file read is analysed on the workstation, with no network and no AI model." },
        { title: "Transparent", body: "The message goes out with a substitute; one line says so in the conversation." },
        { title: "Even in images", body: "A token’s area is covered on a copy of the image." },
      ],
      more: "See the full diagram and the blocking message",
    },
    finops: {
      kicker: "FinOps · Fleet Sièges",
      title: "The real cost, per developer and per team.",
      lead: "What you pay in seats, next to what you use at API rates. Never added together.",
      ratio: "× 39",
      ratioLine: "A $200/month Claude plan covered $7,815 of usage at API rates.",
      tag: "Real measurement",
      when: "At xSOM, September 2026",
      source: "ccusage report on one workstation, one heavy user. API rates are the tool’s own: an estimate, September 2026, not an average.",
      console: "The console, on a demonstration group",
    },
    strategy: {
      kicker: "Strategy · Fleet Gateway",
      title: "Subscriptions, API or a model on your side: decide on numbers.",
      lead: "Fleet Gateway, installed on your side, gives each application an API budget. No prompt and no key goes through xSOM.",
      pilot: "Available for pilot",
      channels: [
        { name: "Subscriptions", body: "Fixed-price seats, for the most active developers.", proof: "× 39 measured at xSOM, September 2026" },
        { name: "API", body: "Pay per use, capped by an API budget per application.", proof: "API budget per application" },
        { name: "Model on your side", body: "For data that must not leave.", proof: "Hosted on your side" },
      ],
      action: "Request the simulation for your company",
      more: "See a simulation",
    },
    audit: {
      kicker: "Evidence for audit",
      title: "Evidence the auditor checks for themselves.",
      lead: "Every block and every redaction leaves an event without content. Nothing else leaves the workstation.",
      items: [
        { title: "Evidence file", body: "In JSON and PDF, chained logs you verify." },
        { title: "Block log", body: "Which workstation, which rule, when. Never the value." },
        { title: "Nothing leaves the workstation", body: "No prompt, no key, no secret value at xSOM." },
      ],
      event: "See the event sent to the console",
      eventNote: "Shape of the contract, example values: no value and no excerpt of the secret.",
      licences: "Detection: Secret Guard, Apache-2.0. Redaction: PolyForm Small Business 1.0.0.",
      source: "Read the Secret Guard code",
    },
    deploy: {
      kicker: "Rollout",
      title: "Up and running in three steps.",
      steps: [
        { title: "The Fleet client on every workstation", body: "Your fleet management tool, Intune or another, installs it on Windows, macOS and Linux." },
        { title: "A signed Policy", body: "Rule by rule: block or redact. Each workstation checks the signature before applying it." },
        { title: "The console", body: "Covered workstations, costs, evidence file. Hosted in the European Union, or on your side." },
      ],
      pilot: "A free demo, then a two-to-three-month pilot on your side.",
    },
    film: { kicker: "Video demo" },
    faq: {
      title: "Frequently asked questions",
      items: [
        ["Does xSOM see our prompts or keys?", "No. Analysis runs on the workstation and the gateway stays on your side. Only usage metrics and events without content come up."],
        ["Do developers change tools?", "No. They keep the official, unmodified assistant, with their own sign-in. No credential is collected."],
        ["What if the analysis fails?", "The send is blocked, with a clear message. Never a partial send."],
        ["From how many developers?", "150 and more. Below that, a single Claude Team organisation is enough."],
        ["How much does xSOM Fleet cost?", "A yearly subscription per governed developer, on quote. The demo is free."],
      ],
    },
    final: {
      title: "See the console on a demonstration group.",
      lead: "Thirty minutes, with your CIO, CISO and buyer questions.",
      demo: "Request a demo",
      price: "Request pricing",
      details: "Everything in detail: diagram, options, commitments",
    },
    details: {
      title: "xSOM Fleet in detail.",
      lead: "The full diagram, the event sent, the simulation, options by level and commitments.",
      back: "Back to the overview",
      meta: "xSOM Fleet in detail · diagram, options and commitments",
      description: "xSOM Fleet in detail: full diagram, blocking message and event, cost simulation, options on a typical company, comparison matrix, licences and commitments.",
    },
  },
} as const;
