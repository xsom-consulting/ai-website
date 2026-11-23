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
      kicker: "Pour les indépendants · 0 €",
      title: "Aparté masque vos secrets avant qu’ils partent vers l’IA.",
      lead: "Clés d’API, jetons, mots de passe : dans Claude Code, Codex, Claude Desktop ou ChatGPT, Aparté les remplace par un Substitut, sur votre poste. L’IA continue de travailler. Vos clients sont rassurés.",
      steps: ["Créez votre compte", "Téléchargez Aparté", "C’est actif"],
      systems: "macOS · Linux · Windows (version d’essai)",
      typed: "Vous écrivez",
      sent: "L’IA reçoit",
      before: "Déploie avec STRIPE_KEY=",
      value: "sk_live_exemple-inventé",
      substitute: substitute("fr", 1, "clé secrète Stripe"),
      local: "La vraie valeur reste sur votre poste.",
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
      kicker: "For freelancers · €0",
      title: "Aparté masks your secrets before they reach the AI.",
      lead: "API keys, tokens, passwords: in Claude Code, Codex, Claude Desktop or ChatGPT, Aparté replaces them with a Substitute, on your machine. The AI keeps working. Your clients are reassured.",
      steps: ["Create your account", "Download Aparté", "You are protected"],
      systems: "macOS · Linux · Windows (trial version)",
      typed: "You write",
      sent: "The AI receives",
      before: "Deploy with STRIPE_KEY=",
      value: "sk_live_made-up-example",
      substitute: substitute("en", 1, "Stripe secret key"),
      local: "The real value stays on your machine.",
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
