import { substitute } from "./secret-guard-copy";

/**
 * Les sections ajoutées à guard.xsom.fr pour Aparté : la démonstration dans le navigateur
 * (le vrai moteur, en WebAssembly), l'expurgation en quatre temps, ce qui est protégé et les
 * questions. Les chiffres, s'il y en a, sont mesurés et datés ; aucune promesse de couverture
 * totale.
 */

export type CatalogKey = "sec" | "perso" | "ent" | "act" | "app";
type Item = { readonly name: string; readonly hint: string; readonly soon?: boolean };

export const APARTE_COPY = {
  fr: {
    hero: {
      title: ["Gardez votre IA.", "Rassurez vos clients."],
      lead: "Claude Code, Codex, ChatGPT : vous ne codez plus sans. Aparté masque vos secrets avant chaque envoi, sur votre poste, pour que vos clients vous disent oui.",
      download: "Télécharger",
      try: "Essayer sur un Mac",
      sub: "macOS · Linux · Windows (version d’essai) · sans carte bancaire",
      perks: {
        free: { big: "0 €", title: "pour les indépendants", body: "Protection complète, sans limite de durée." },
        xsom: { title: "xSOM Consulting", body: "Télécoms et cybersécurité depuis 2007." },
        france: { title: "Conçu en France", body: "Une équipe joignable, en français." },
        local: { title: "Rien chez xSOM", body: "Ni vos prompts, ni vos clés ne passent par nos serveurs." },
      },
    },
    header: {
      home: "Aparté, accueil",
      by: "par xSOM",
      nav: [["#essayer", "Essayer"], ["#expurgation", "Expurgation"], ["#protege", "Ce qu’on protège"], ["#installer", "Installer"], ["#fleet", "Entreprises"]] as const,
      docs: "Docs",
      xsom: "xSOM Consulting",
      menu: "Menu",
    },
    trust: ["xSOM Consulting, cybersécurité depuis 2007", "Conçu en France", "Moteur open source"],
    actions: { signup: "Créer mon compte · 0 €", github: "GitHub" },
    tryIt: {
      kicker: "Démonstration · moteur réel",
      title: "Testez dans votre navigateur.",
      lead: "Un poste fictif : ouvrez les applications du Dock, déplacez les fenêtres, collez une clé. Le moteur d’Aparté tourne ici, dans votre navigateur ; rien n’est envoyé. Les réponses des IA sont simulées.",
      guided: "Ou laissez-vous guider :",
      tries: [
        ["claudeKey", "Une clé dans Claude Code"],
        ["readEnv", "Codex veut lire le .env"],
        ["push", "Un push forcé"],
        ["pkg", "Un paquet inventé"],
        ["desktop", "Une config dans Claude Desktop"],
        ["web", "Un journal dans ChatGPT"],
      ] as const,
      after: "Convaincu ?",
      cta: "Créer mon compte · 0 €",
    },
    expurgation: {
      kicker: "L’expurgation",
      title: "L’IA travaille sans voir la clé.",
      lead: "Bloquer casse votre élan. Aparté remplace le secret par un Substitut, laisse l’IA faire son travail, puis remet la vraie valeur sur votre machine.",
      steps: [
        { who: "Vous", title: "Vous écrivez comme d’habitude", code: "Déploie avec API_KEY=exemple-inventé-0000" },
        { who: "Aparté", title: "Le secret devient un Substitut", code: `Déploie avec API_KEY=${substitute("fr", 1, "clé d’API")}` },
        { who: "L’IA", title: "L’IA répond avec le Substitut", code: "Bash(./deploy.sh [secret masqué n°1])" },
        { who: "Votre machine", title: "La vraie valeur est remise à l’exécution", code: "./deploy.sh •••• · déployé" },
      ],
      seen: { title: "Ce que voit l’IA", items: ["Votre code, vos questions", "Des Substituts qui disent ce qu’ils remplacent, jamais la valeur"] },
      kept: { title: "Ce qui reste sur votre machine", items: ["La valeur des clés, jetons et mots de passe", "La correspondance entre Substitut et valeur"] },
      where: "Expurgation réversible avec Claude Code. Dans ChatGPT et Claude par l’extension, le secret est masqué avant l’envoi. Avec Codex et Claude Desktop, l’envoi est bloqué.",
    },
    catalog: {
      kicker: "Ce qu’Aparté protège",
      title: "Cherchez ce qui vous inquiète.",
      placeholder: "AWS, .env, IBAN, git push, Claude Desktop…",
      search: "Rechercher dans ce qu’Aparté protège",
      all: "Tout",
      more: (n: number) => `Voir les ${n} éléments`,
      less: "Réduire",
      none: "Rien pour cette recherche.",
      ask: "Dites-nous ce qu’il vous faut",
      soon: "Bientôt",
      count: (n: number) => `${n} élément${n > 1 ? "s" : ""}`,
      cats: { sec: "Secrets", perso: "Données clients", ent: "Entrées de l’IA", act: "Actions d’agent", app: "Outils" } as Record<CatalogKey, string>,
      items: {
        sec: [
          { name: "Clé d’accès AWS", hint: "AKIA… · identifiants cloud" }, { name: "Jeton GitHub", hint: "ghp_… · github_pat_…" }, { name: "Clé secrète Stripe", hint: "sk_live_… · rk_live_…" },
          { name: "Clé privée", hint: "PEM, SSH, certificats" }, { name: "Jeton JWT", hint: "eyJ… · jetons de session" }, { name: "Jetons de fournisseurs", hint: "paiement, IA, messagerie, cloud" },
          { name: "Clé d’API générique", hint: "api_key=… · token=…" }, { name: "Secret à forte entropie", hint: "chaîne aléatoire longue" }, { name: "URL avec identifiants", hint: "https://utilisateur:motdepasse@…" },
          { name: "Mot de passe de base de données", hint: "postgres://, mongodb://, mysql://" }, { name: "Mot de passe dans une affectation", hint: "password = … · DB_PASS=…" }, { name: "Code à usage unique", hint: "codes de vérification" },
        ],
        perso: [
          { name: "IBAN et RIB", hint: "clé de contrôle vérifiée" }, { name: "Carte bancaire", hint: "numéro et cryptogramme" }, { name: "Numéro de sécurité sociale", hint: "NIR, avec sa clé" },
          { name: "SIREN, SIRET, TVA", hint: "numéros vérifiés" }, { name: "Passeport et identifiants nationaux", hint: "DE, ES, IT, PL, SE, FI, UK" }, { name: "Numéro de téléphone", hint: "formats européens" },
          { name: "Adresse e-mail", hint: "à activer dans vos réglages" }, { name: "Adresse postale", hint: "à activer dans vos réglages" }, { name: "Adresse IP interne", hint: "10.…, 192.168.…" },
        ],
        ent: [
          { name: "Prompt", hint: "ce que vous tapez ou collez" }, { name: "Fichier lu par l’agent", hint: ".env, configuration, clés" }, { name: "Fichier cité par @", hint: "dans le prompt de Claude Code" },
          { name: "Commande shell", hint: "arguments de Bash" }, { name: "Appel d’outil MCP", hint: "arguments envoyés à l’outil" }, { name: "Instructions cachées", hint: "texte invisible dans un fichier lu" },
          { name: "Capture d’écran", hint: "zone masquée sur une copie" }, { name: "Message dans un chat web", hint: "ChatGPT, Claude, par l’extension" },
        ],
        act: [
          { name: "git push --force", hint: "sur une branche partagée" }, { name: "git reset --hard", hint: "sur une branche poussée" }, { name: "rm -rf hors du projet", hint: "suppression récursive" },
          { name: "Envoi de fichier vers un hôte inconnu", hint: "curl, scp…" }, { name: "Paquet inexistant", hint: "nom inventé par l’IA" }, { name: "Paquet de moins de 7 jours", hint: "npm, pnpm, pip, uv, Go, Cargo" },
          { name: "Paquet avec faille connue", hint: "base OSV" }, { name: "Serveur MCP ou compétence modifié", hint: "empreinte épinglée" },
        ],
        app: [
          { name: "Claude Code", hint: "terminal et VS Code · expurgation réversible" }, { name: "Codex", hint: "bloque" }, { name: "GitHub Copilot CLI", hint: "Windows, version d’essai" },
          { name: "Claude Desktop", hint: "Mode précis, macOS · bloque" }, { name: "ChatGPT, Claude", hint: "par l’extension · bientôt en boutique" },
          { name: "Cursor", hint: "bientôt", soon: true }, { name: "VS Code · Copilot", hint: "bientôt", soon: true },
        ],
      } as Record<CatalogKey, readonly Item[]>,
    },
    clients: {
      title: ["Vos clients disent ", "oui", " à l’IA."],
      lead: "Quand ils demandent comment vous utilisez l’IA avec leurs accès, vous montrez votre journal : ce qui a été masqué ou bloqué. Jamais leur code.",
      report: "Journal · mission client",
      month: "novembre",
      rows: [["Secrets masqués avant l’envoi", "14"], ["Lectures de fichiers bloquées", "3"], ["Commandes soumises à accord", "2"], ["Contenu transmis à xSOM", "aucun"]] as const,
      foot: "Exemple. Attestation mensuelle à transmettre : bientôt.",
    },
    proof: {
      title: "Mesuré, pas promis.",
      lead: "Le moteur d’Aparté passe un banc de test avant chaque version. Les chiffres de la dernière mesure :",
      stats: [
        ["100 %", "des 2 859 secrets du corpus de test détectés, tels qu’ils sont écrits"],
        ["92,1 %", "détectés quand le contexte est défavorable"],
        ["99,8 %", "des secrets détectés sont masqués plutôt que bloqués : l’IA continue"],
        ["6,2 %", "au plus des fichiers de dépôts sains signalés à tort"],
      ] as const,
      note: "Mesure du 22/11/2026, moteur v0.10.4, corpus de test de xSOM. Méthode détaillée sur demande.",
    },
    end: {
      big: "0 €",
      title: "pour les indépendants.",
      body: "Protection complète sur votre poste, sans limite de durée, sans carte bancaire.",
      facts: {
        xsom: ["xSOM Consulting", "Télécoms et cybersécurité depuis 2007"],
        france: ["Conçu en France", "Une équipe joignable, en français"],
        engine: ["Moteur de détection open source", "Celui qui tourne dans la démonstration"],
        fleet: ["Entreprises : xSOM Fleet", "Toute une équipe, une console, des preuves"],
      },
    },
    faq: {
      kicker: "Questions",
      title: "Des réponses franches.",
      items: [
        ["Vous lisez mes prompts ?", "Non. L’analyse se fait sur votre machine. Votre espace ne reçoit que des Événements : quel type de secret, quand, quelle décision. Jamais le contenu."],
        ["Ça empêche toute fuite ?", "Non, personne ne peut le promettre. Aparté couvre les outils listés plus haut ; il ne voit pas les agents qui tournent dans le cloud ni un secret de forme inconnue."],
        ["Et si Aparté plante ?", "L’envoi est bloqué, avec le motif. Un contrôle qui laisse passer quand il échoue ne protège de rien."],
        ["La démonstration est-elle truquée ?", "Non : elle utilise le moteur de détection d’Aparté, compilé en WebAssembly, dans votre navigateur. Seules les réponses des IA sont simulées."],
        ["Pourquoi 0 € ?", "xSOM vit du conseil et de xSOM Fleet pour les entreprises. Pour un indépendant, jusqu’à 3 Postes, c’est 0 €."],
      ] as const,
    },
  },
  en: {
    hero: {
      title: ["Keep your AI.", "Reassure your clients."],
      lead: "Claude Code, Codex, ChatGPT: you no longer code without them. Aparté masks your secrets before every send, on your machine, so your clients say yes.",
      download: "Download",
      try: "Try it on a Mac",
      sub: "macOS · Linux · Windows (trial version) · no credit card",
      perks: {
        free: { big: "€0", title: "for freelancers", body: "Full protection, with no time limit." },
        xsom: { title: "xSOM Consulting", body: "Telecoms and cybersecurity since 2007." },
        france: { title: "Designed in France", body: "A team you can reach, in French or English." },
        local: { title: "Nothing at xSOM", body: "Neither your prompts nor your keys go through our servers." },
      },
    },
    header: {
      home: "Aparté, home",
      by: "by xSOM",
      nav: [["#essayer", "Try it"], ["#expurgation", "Redaction"], ["#protege", "What we protect"], ["#installer", "Install"], ["#fleet", "Companies"]] as const,
      docs: "Docs",
      xsom: "xSOM Consulting",
      menu: "Menu",
    },
    trust: ["xSOM Consulting, cybersecurity since 2007", "Designed in France", "Open source engine"],
    actions: { signup: "Create my account · €0", github: "GitHub" },
    tryIt: {
      kicker: "Demo · real engine",
      title: "Try it in your browser.",
      lead: "A sample workstation: open the apps in the Dock, move the windows, paste a key. Aparté’s engine runs here, in your browser; nothing is sent. The AI replies are simulated.",
      guided: "Or follow a guided example:",
      tries: [
        ["claudeKey", "A key in Claude Code"],
        ["readEnv", "Codex wants to read .env"],
        ["push", "A forced push"],
        ["pkg", "A made-up package"],
        ["desktop", "A config in Claude Desktop"],
        ["web", "A log in ChatGPT"],
      ] as const,
      after: "Convinced?",
      cta: "Create my account · €0",
    },
    expurgation: {
      kicker: "Redaction",
      title: "The AI works without seeing the key.",
      lead: "Blocking breaks your flow. Aparté replaces the secret with a Substitute, lets the AI do its job, then puts the real value back on your machine.",
      steps: [
        { who: "You", title: "You write as usual", code: "Deploy with API_KEY=made-up-example-0000" },
        { who: "Aparté", title: "The secret becomes a Substitute", code: `Deploy with API_KEY=${substitute("en", 1, "API key")}` },
        { who: "The AI", title: "The AI answers with the Substitute", code: "Bash(./deploy.sh [secret masked #1])" },
        { who: "Your machine", title: "The real value is put back when it runs", code: "./deploy.sh •••• · deployed" },
      ],
      seen: { title: "What the AI sees", items: ["Your code, your questions", "Substitutes that say what they replace, never the value"] },
      kept: { title: "What stays on your machine", items: ["The value of keys, tokens and passwords", "The mapping between Substitute and value"] },
      where: "Reversible redaction with Claude Code. In ChatGPT and Claude with the extension, the secret is masked before sending. With Codex and Claude Desktop, the send is blocked.",
    },
    catalog: {
      kicker: "What Aparté protects",
      title: "Search for what worries you.",
      placeholder: "AWS, .env, IBAN, git push, Claude Desktop…",
      search: "Search what Aparté protects",
      all: "All",
      more: (n: number) => `Show all ${n} items`,
      less: "Show less",
      none: "Nothing for this search.",
      ask: "Tell us what you need",
      soon: "Soon",
      count: (n: number) => `${n} item${n > 1 ? "s" : ""}`,
      cats: { sec: "Secrets", perso: "Client data", ent: "AI inputs", act: "Agent actions", app: "Tools" } as Record<CatalogKey, string>,
      items: {
        sec: [
          { name: "AWS access key", hint: "AKIA… · cloud credentials" }, { name: "GitHub token", hint: "ghp_… · github_pat_…" }, { name: "Stripe secret key", hint: "sk_live_… · rk_live_…" },
          { name: "Private key", hint: "PEM, SSH, certificates" }, { name: "JWT", hint: "eyJ… · session tokens" }, { name: "Provider tokens", hint: "payments, AI, messaging, cloud" },
          { name: "Generic API key", hint: "api_key=… · token=…" }, { name: "High-entropy secret", hint: "long random string" }, { name: "URL with credentials", hint: "https://user:password@…" },
          { name: "Database password", hint: "postgres://, mongodb://, mysql://" }, { name: "Password in an assignment", hint: "password = … · DB_PASS=…" }, { name: "One-time code", hint: "verification codes" },
        ],
        perso: [
          { name: "IBAN", hint: "check digits verified" }, { name: "Payment card", hint: "number and security code" }, { name: "French social security number", hint: "NIR, with its key" },
          { name: "SIREN, SIRET, VAT", hint: "verified numbers" }, { name: "Passport and national IDs", hint: "DE, ES, IT, PL, SE, FI, UK" }, { name: "Phone number", hint: "European formats" },
          { name: "Email address", hint: "to turn on in your settings" }, { name: "Postal address", hint: "to turn on in your settings" }, { name: "Internal IP address", hint: "10.…, 192.168.…" },
        ],
        ent: [
          { name: "Prompt", hint: "what you type or paste" }, { name: "File read by the agent", hint: ".env, config, keys" }, { name: "File cited with @", hint: "in a Claude Code prompt" },
          { name: "Shell command", hint: "Bash arguments" }, { name: "MCP tool call", hint: "arguments sent to the tool" }, { name: "Hidden instructions", hint: "invisible text in a file read" },
          { name: "Screenshot", hint: "area masked on a copy" }, { name: "Web chat message", hint: "ChatGPT, Claude, with the extension" },
        ],
        act: [
          { name: "git push --force", hint: "on a shared branch" }, { name: "git reset --hard", hint: "on a pushed branch" }, { name: "rm -rf outside the project", hint: "recursive delete" },
          { name: "File upload to an unknown host", hint: "curl, scp…" }, { name: "Non-existent package", hint: "name made up by the AI" }, { name: "Package under 7 days old", hint: "npm, pnpm, pip, uv, Go, Cargo" },
          { name: "Package with a known flaw", hint: "OSV database" }, { name: "Changed MCP server or skill", hint: "pinned fingerprint" },
        ],
        app: [
          { name: "Claude Code", hint: "terminal and VS Code · reversible redaction" }, { name: "Codex", hint: "blocks" }, { name: "GitHub Copilot CLI", hint: "Windows, trial version" },
          { name: "Claude Desktop", hint: "precise mode, macOS · blocks" }, { name: "ChatGPT, Claude", hint: "with the extension · soon in the stores" },
          { name: "Cursor", hint: "soon", soon: true }, { name: "VS Code · Copilot", hint: "soon", soon: true },
        ],
      } as Record<CatalogKey, readonly Item[]>,
    },
    clients: {
      title: ["Your clients say ", "yes", " to AI."],
      lead: "When they ask how you use AI with their access, you show your log: what was masked or blocked. Never their code.",
      report: "Log · client engagement",
      month: "November",
      rows: [["Secrets masked before sending", "14"], ["File reads blocked", "3"], ["Commands held for approval", "2"], ["Content sent to xSOM", "none"]] as const,
      foot: "Example. Monthly attestation to share: soon.",
    },
    proof: {
      title: "Measured, not promised.",
      lead: "Aparté’s engine runs a test bench before every release. The figures from the latest run:",
      stats: [
        ["100 %", "of the 2,859 secrets in the test corpus detected, as written"],
        ["92.1 %", "detected when the context is unfavourable"],
        ["99.8 %", "of detected secrets are masked rather than blocked: the AI keeps going"],
        ["6.2 %", "at most of clean repository files flagged by mistake"],
      ] as const,
      note: "Measured on 22/11/2026, engine v0.10.4, xSOM test corpus. Detailed method on request.",
    },
    end: {
      big: "€0",
      title: "for freelancers.",
      body: "Full protection on your machine, with no time limit and no credit card.",
      facts: {
        xsom: ["xSOM Consulting", "Telecoms and cybersecurity since 2007"],
        france: ["Designed in France", "A team you can reach, in French or English"],
        engine: ["Open source detection engine", "The one running in the demo"],
        fleet: ["Companies: xSOM Fleet", "A whole team, one console, evidence"],
      },
    },
    faq: {
      kicker: "Questions",
      title: "Straight answers.",
      items: [
        ["Do you read my prompts?", "No. The analysis happens on your machine. Your space only receives Events: which type of secret, when, which decision. Never the content."],
        ["Does it stop every leak?", "No, nobody can promise that. Aparté covers the tools listed above; it does not see agents running in the cloud or a secret of an unknown shape."],
        ["What if Aparté crashes?", "The send is blocked, with the reason. A check that lets things through when it fails protects nothing."],
        ["Is the demo rigged?", "No: it uses Aparté’s detection engine, compiled to WebAssembly, in your browser. Only the AI replies are simulated."],
        ["Why €0?", "xSOM lives from consulting and from xSOM Fleet for companies. For a freelancer, up to 3 workstations, it is €0."],
      ] as const,
    },
  },
};
