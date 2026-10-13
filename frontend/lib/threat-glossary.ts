import type { Lang } from "@/lib/lang-types";

/**
 * Le glossaire opérationnel des menaces cyber de l'IA (`/menaces`).
 *
 * Chaque ligne croise quatre axes indépendants, et c'est ce qui la rend filtrable :
 * **l'usage** (qui est exposé), **la surface d'attaque** (par où l'attaque entre),
 * **l'impact** (ce qu'elle produit) et **l'état de l'art** (ce que le marché sait en
 * faire).
 *
 * Le glossaire décrit les menaces et les parades de référence du marché ; il ne
 * revendique la couverture d'aucun produit, sauf une : `secretGuard` marque la menace
 * de fuite de secrets, sur laquelle le moteur open source Secret Guard détecte les
 * secrets d'un texte avant son envoi. Il ne dit rien de plus.
 *
 * Les exemples sont illustratifs ; les outils cités sont libres ou open source.
 */

export const GLOSSARY_USES = ["development", "workplace", "agents", "models"] as const;
export type GlossaryUse = (typeof GLOSSARY_USES)[number];

export const GLOSSARY_CATEGORIES = [
  "prompt",
  "agents",
  "rag",
  "model",
  "adversarial",
  "output",
  "privacy",
  "supply",
  "infra",
  "availability",
  "integrity",
  "human",
  "governance",
] as const;
export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number];

/** Par où l'attaque entre : ce qui est tapé, lu, appris, exécuté, cru ou hébergé. */
export const GLOSSARY_SURFACES = ["prompt", "data", "model", "actions", "people", "infra"] as const;
export type GlossarySurface = (typeof GLOSSARY_SURFACES)[number];

export const GLOSSARY_IMPACTS = [
  "leak",
  "manipulation",
  "action",
  "compromise",
  "cost",
  "fraud",
  "oversight",
] as const;
export type GlossaryImpact = (typeof GLOSSARY_IMPACTS)[number];

/** Du plus ouvert au mieux maîtrisé : cet ordre est aussi celui du tri « non résolu d'abord ». */
export const GLOSSARY_STATUSES = ["unsolved", "mitigated", "mixed", "solved"] as const;
export type GlossaryStatus = (typeof GLOSSARY_STATUSES)[number];

type Localised = Record<Lang, string>;

/** Un nom d'outil est un nom propre, imprimé tel quel ; un contrôle générique se traduit. */
export type GlossaryTool = string | Localised;

export const OWASP = {
  LLM01: { title: "Prompt Injection", href: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/" },
  LLM02: { title: "Sensitive Information Disclosure", href: "https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/" },
  LLM03: { title: "Supply Chain", href: "https://genai.owasp.org/llmrisk/llm032025-supply-chain/" },
  LLM04: { title: "Data and Model Poisoning", href: "https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/" },
  LLM05: { title: "Improper Output Handling", href: "https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/" },
  LLM06: { title: "Excessive Agency", href: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/" },
  LLM07: { title: "System Prompt Leakage", href: "https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/" },
  LLM08: { title: "Vector and Embedding Weaknesses", href: "https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/" },
  LLM09: { title: "Misinformation", href: "https://genai.owasp.org/llmrisk/llm092025-misinformation/" },
  LLM10: { title: "Unbounded Consumption", href: "https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/" },
} as const;
export type OwaspCode = keyof typeof OWASP;

type GlossaryText = {
  title: string;
  /** L'attaque type et sa conséquence. */
  attack: string;
  /** La parade de référence du marché. */
  mitigation: string;
  /** La nuance de l'état de l'art, quand le statut seul ne la dit pas. */
  statusNote?: string;
};

/** Définition, exemple et premier réflexe : les fiches historiques du glossaire. */
type GlossaryExplainer = {
  definition: string;
  example: string;
  reflex: string;
};

export type GlossaryEntry = {
  id: string;
  category: GlossaryCategory;
  uses: readonly GlossaryUse[];
  surface: GlossarySurface;
  impact: GlossaryImpact;
  status: GlossaryStatus;
  tools: readonly GlossaryTool[];
  owasp?: OwaspCode;
  /** Vrai pour la fuite de secrets, où le moteur Secret Guard détecte les secrets d'un texte avant son envoi. */
  secretGuard?: true;
  copy: Record<Lang, GlossaryText>;
  explainer?: Record<Lang, GlossaryExplainer>;
};

const CONTAINERS: Localised = { fr: "Conteneurs", en: "Containers" };

export const THREAT_GLOSSARY: readonly GlossaryEntry[] = [
  // --- Prompts & instructions ------------------------------------------------
  {
    id: "injection-directe",
    category: "prompt",
    uses: ["development", "workplace", "agents"],
    surface: "prompt",
    impact: "manipulation",
    status: "mitigated",
    tools: ["NeMo Guardrails", "garak", "Promptfoo", "PyRIT", "Giskard"],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Injection de prompt directe",
        attack: "Un utilisateur demande au modèle d’ignorer les règles du développeur ou du système.",
        mitigation: "Frontières d’instructions strictes, filtrage des entrées, moindre privilège, validation des sorties, red teaming.",
        statusNote: "Atténué, pas résolu",
      },
      en: {
        title: "Direct prompt injection",
        attack: "A user instructs the model to ignore developer or system rules.",
        mitigation: "Strong instruction boundaries, input filtering, least privilege, output validation, red teaming.",
        statusNote: "Mitigated, not solved",
      },
    },
  },
  {
    id: "injection-de-prompt",
    category: "prompt",
    uses: ["development", "workplace", "agents", "models"],
    surface: "data",
    impact: "action",
    status: "unsolved",
    tools: ["NeMo Guardrails", "Promptfoo", "garak"],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Injection de prompt indirecte",
        attack: "Une consigne malveillante est cachée dans une page web, un e-mail, un PDF, un enregistrement de base ou un document RAG.",
        mitigation: "Traiter les données récupérées comme non fiables ; séparer instructions et contenu ; permissions d’outils ; confirmation.",
        statusNote: "Problème difficile, non résolu",
      },
      en: {
        title: "Indirect prompt injection",
        attack: "A malicious instruction is hidden in a web page, email, PDF, database record or RAG document.",
        mitigation: "Treat retrieved data as untrusted; separate instructions from content; tool permissions; confirmation.",
        statusNote: "Hard unsolved problem",
      },
    },
    explainer: {
      fr: {
        definition: "Des instructions introduites dans un message, une page ou un document tentent de détourner l’IA de sa tâche.",
        example: "Un document à résumer contient une consigne demandant à l’assistant d’envoyer des informations internes ailleurs.",
        reflex: "Traiter les contenus externes comme non fiables et limiter les actions accessibles à l’agent.",
      },
      en: {
        definition: "Instructions placed in a message, webpage or document attempt to divert the AI from its intended task.",
        example: "A document being summarised tells the assistant to send internal information to another destination.",
        reflex: "Treat external content as untrusted and limit the actions available to the agent.",
      },
    },
  },
  {
    id: "injection-persistante",
    category: "prompt",
    uses: ["workplace", "agents", "models"],
    surface: "data",
    impact: "manipulation",
    status: "mitigated",
    tools: ["Promptfoo", { fr: "Filtres RAG sur mesure", en: "Custom RAG filters" }],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Injection de prompt persistante",
        attack: "Un texte malveillant stocké en mémoire ou dans une base vectorielle influence les sessions suivantes.",
        mitigation: "Provenance, assainissement à l’ingestion, zones de confiance, ACL sur la recherche.",
      },
      en: {
        title: "Stored prompt injection",
        attack: "Malicious text stored in memory or a vector database affects future sessions.",
        mitigation: "Provenance, sanitised ingestion, trust zones, retrieval ACLs.",
      },
    },
  },
  {
    id: "jailbreak",
    category: "prompt",
    uses: ["development", "workplace", "agents"],
    surface: "prompt",
    impact: "manipulation",
    status: "unsolved",
    tools: ["garak", "PyRIT", "Promptfoo", "DeepTeam"],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Jailbreak",
        attack: "Des prompts adverses contournent les protections du modèle.",
        mitigation: "Alignement de sécurité, classifieurs, garde-fous à l’exécution et tests continus.",
        statusNote: "Pas de solution universelle",
      },
      en: {
        title: "Jailbreaking",
        attack: "Adversarial prompts get around the model’s safety controls.",
        mitigation: "Safety tuning, classifiers, runtime guardrails and continuous testing.",
        statusNote: "No universal solution",
      },
    },
  },
  {
    id: "extraction-prompt-systeme",
    category: "prompt",
    uses: ["development", "agents"],
    surface: "prompt",
    impact: "leak",
    status: "mitigated",
    tools: ["garak", "Promptfoo", "PyRIT"],
    owasp: "LLM07",
    copy: {
      fr: {
        title: "Extraction du prompt système",
        attack: "Le modèle est amené à révéler ses instructions cachées ou sa configuration.",
        mitigation: "Ne jamais placer de vrai secret dans un prompt ; isoler les secrets ; filtrer les sorties.",
      },
      en: {
        title: "System-prompt extraction",
        attack: "The model is tricked into revealing its hidden instructions or configuration.",
        mitigation: "Never put real secrets in prompts; isolate secrets; filter outputs.",
      },
    },
  },
  {
    id: "detournement-de-contexte",
    category: "prompt",
    uses: ["workplace", "agents"],
    surface: "data",
    impact: "manipulation",
    status: "mitigated",
    tools: ["Guardrails", { fr: "Moteur de policy maison", en: "Custom policy engine" }],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Détournement de contexte",
        attack: "Un contenu moins fiable prend le pas sur les instructions de confiance.",
        mitigation: "Hiérarchie des instructions et segmentation du contexte.",
      },
      en: {
        title: "Context hijacking",
        attack: "Lower-trust content comes to dominate higher-trust instructions.",
        mitigation: "Instruction hierarchy and context segmentation.",
      },
    },
  },
  {
    id: "obfuscation",
    category: "prompt",
    uses: ["development", "agents"],
    surface: "prompt",
    impact: "manipulation",
    status: "mitigated",
    tools: ["PyRIT", "Promptfoo", { fr: "Bibliothèques de sécurité Unicode", en: "Unicode security libraries" }],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Attaques par encodage et obfuscation",
        attack: "Base64, Unicode, homoglyphes, ROT ou caractères invisibles déjouent les filtres.",
        mitigation: "Canoniser et normaliser les entrées ; décoder avant d’analyser.",
      },
      en: {
        title: "Encoding and obfuscation attacks",
        attack: "Base64, Unicode, homoglyphs, ROT or invisible characters defeat filters.",
        mitigation: "Canonicalise and normalise input; decode before scanning.",
      },
    },
  },
  {
    id: "jailbreak-multilingue",
    category: "prompt",
    uses: ["workplace", "agents"],
    surface: "prompt",
    impact: "manipulation",
    status: "mitigated",
    tools: ["garak", "Promptfoo"],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Jailbreak multilingue",
        attack: "L’attaque est formulée dans une langue peu dotée pour échapper aux filtres de sécurité.",
        mitigation: "Classifieurs de sécurité multilingues et tests adverses.",
      },
      en: {
        title: "Multilingual jailbreak",
        attack: "The attack is written in a low-resource language to slip past safety filters.",
        mitigation: "Multilingual safety classifiers and adversarial tests.",
      },
    },
  },
  {
    id: "injection-multimodale",
    category: "prompt",
    uses: ["workplace", "agents", "models"],
    surface: "data",
    impact: "manipulation",
    status: "unsolved",
    tools: [{ fr: "Outils de recherche", en: "Research tooling" }, { fr: "Red teaming multimodal", en: "Multimodal red teaming" }],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Injection de prompt multimodale",
        attack: "Des instructions sont cachées dans une image, un son ou une vidéo.",
        mitigation: "Séparer perception et exécution ; OCR et inspection du contenu ; pas d’usage autonome des outils.",
        statusNote: "Émergent",
      },
      en: {
        title: "Multimodal prompt injection",
        attack: "Instructions are hidden in an image, audio or video.",
        mitigation: "Separate perception from execution; OCR and content inspection; no autonomous tool use.",
        statusNote: "Emerging",
      },
    },
  },

  // --- Agents ---------------------------------------------------------------
  {
    id: "autonomie-excessive",
    category: "agents",
    uses: ["development", "workplace", "agents"],
    surface: "actions",
    impact: "action",
    status: "solved",
    tools: ["Open Policy Agent (OPA)", CONTAINERS],
    owasp: "LLM06",
    copy: {
      fr: {
        title: "Autonomie excessive",
        attack: "L’agent dispose de plus de droits que sa tâche n’en exige.",
        mitigation: "Moindre privilège, portées par outil, approbation humaine, bac à sable.",
        statusNote: "Parades solides",
      },
      en: {
        title: "Excessive agency",
        attack: "The agent holds more permissions than its task requires.",
        mitigation: "Least privilege, per-tool scopes, human approval, sandboxing.",
        statusNote: "Strong mitigations",
      },
    },
    explainer: {
      fr: {
        definition: "Un agent dispose de trop de droits ou de liberté pour agir. Une erreur peut alors modifier, publier ou supprimer des informations.",
        example: "Un assistant chargé de préparer une réponse peut aussi l’envoyer, sans validation du collaborateur.",
        reflex: "Accorder uniquement les droits nécessaires et faire valider les actions à fort impact.",
      },
      en: {
        definition: "An agent has more permissions or freedom than it needs. A mistake can then change, publish or delete information.",
        example: "An assistant asked to draft a reply can also send it without the employee’s approval.",
        reflex: "Grant only necessary permissions and require approval for high-impact actions.",
      },
    },
  },
  {
    id: "injection-appel-outil",
    category: "agents",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "action",
    status: "mitigated",
    tools: ["OPA", "Guardrails"],
    owasp: "LLM06",
    copy: {
      fr: {
        title: "Injection d’appels d’outils",
        attack: "Un prompt pousse le modèle à appeler des fonctions dangereuses.",
        mitigation: "Schémas explicites, validation, contrôle de policy autour de chaque appel.",
      },
      en: {
        title: "Tool and function-call injection",
        attack: "A prompt steers the model into calling dangerous functions.",
        mitigation: "Explicit schemas, validation, policy checks around every call.",
      },
    },
  },
  {
    id: "depute-confus",
    category: "agents",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "action",
    status: "solved",
    tools: ["OPA", { fr: "Portées OAuth", en: "OAuth scopes" }],
    owasp: "LLM06",
    copy: {
      fr: {
        title: "Député confus",
        attack: "L’IA met son autorité légitime au service d’un attaquant.",
        mitigation: "Lier l’autorisation à l’utilisateur, pas au modèle ; jetons de capacité.",
        statusNote: "Schéma de sécurité établi",
      },
      en: {
        title: "Confused deputy",
        attack: "The AI uses its legitimate authority on an attacker’s behalf.",
        mitigation: "Bind authorisation to the user, not the model; capability tokens.",
        statusNote: "Established security pattern",
      },
    },
  },
  {
    id: "escalade-privileges-agent",
    category: "agents",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "action",
    status: "solved",
    tools: ["OPA", "SELinux", "AppArmor", CONTAINERS],
    owasp: "LLM06",
    copy: {
      fr: {
        title: "Élévation de privilèges d’un agent",
        attack: "L’agent atteint des API d’administration, des fichiers ou des ressources cloud.",
        mitigation: "RBAC ou ABAC, bac à sable, comptes de service distincts.",
      },
      en: {
        title: "Agent privilege escalation",
        attack: "The agent reaches admin APIs, files or cloud resources.",
        mitigation: "RBAC or ABAC, sandboxing, separate service accounts.",
      },
    },
  },
  {
    id: "transactions-non-autorisees",
    category: "agents",
    uses: ["workplace", "agents"],
    surface: "actions",
    impact: "action",
    status: "solved",
    tools: [{ fr: "Moteurs de workflow", en: "Workflow engines" }, "OPA"],
    owasp: "LLM06",
    copy: {
      fr: {
        title: "Transactions non autorisées",
        attack: "L’IA envoie un e-mail ou de l’argent, supprime des données ou modifie l’infrastructure.",
        mitigation: "Approbation humaine des opérations lourdes de conséquences ; plafonds de transaction.",
      },
      en: {
        title: "Unauthorised transactions",
        attack: "The AI sends email or money, deletes data or changes infrastructure.",
        mitigation: "Human approval for consequential operations; transaction limits.",
      },
    },
  },
  {
    id: "boucle-agent",
    category: "agents",
    uses: ["agents"],
    surface: "actions",
    impact: "cost",
    status: "solved",
    tools: [{ fr: "Contrôles applicatifs", en: "Application controls" }],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Boucle d’agent incontrôlée",
        attack: "Un agent récursif consomme des ressources ou répète ses actions sans fin.",
        mitigation: "Nombre maximal d’étapes, budgets d’exécution, délais, coupe-circuits.",
      },
      en: {
        title: "Agent loop and runaway automation",
        attack: "A recursive agent consumes resources or acts over and over.",
        mitigation: "Step limits, execution budgets, timeouts, circuit breakers.",
      },
    },
  },
  {
    id: "injection-inter-agents",
    category: "agents",
    uses: ["agents"],
    surface: "data",
    impact: "manipulation",
    status: "mitigated",
    tools: ["OPA", { fr: "Validation sur mesure", en: "Custom validation" }],
    owasp: "LLM01",
    copy: {
      fr: {
        title: "Injection entre agents",
        attack: "Un agent compromis transmet des instructions malveillantes à un autre agent.",
        mitigation: "Authentifier les messages entre agents ; protocoles structurés ; séparation des niveaux de confiance.",
      },
      en: {
        title: "Cross-agent injection",
        attack: "A compromised agent sends malicious instructions to another agent.",
        mitigation: "Authenticate agent messages; structured protocols; trust separation.",
      },
    },
  },
  {
    id: "memoire-empoisonnee",
    category: "agents",
    uses: ["agents"],
    surface: "data",
    impact: "manipulation",
    status: "mitigated",
    tools: [{ fr: "ACL de base vectorielle", en: "Vector DB ACLs" }, { fr: "Contrôles sur mesure", en: "Custom controls" }],
    copy: {
      fr: {
        title: "Mémoire d’agent empoisonnée",
        attack: "Un attaquant implante de faux souvenirs ou des consignes malveillantes dans la mémoire longue de l’agent.",
        mitigation: "Provenance, autorisation d’écriture, expiration, journaux immuables.",
      },
      en: {
        title: "Agent memory poisoning",
        attack: "An attacker implants false or malicious long-term memories in the agent.",
        mitigation: "Provenance, write authorisation, expiry, immutable logs.",
      },
    },
  },
  {
    id: "outil-piege",
    category: "agents",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "action",
    status: "mitigated",
    tools: ["mcp-scan", { fr: "Épinglage des outils", en: "Tool pinning" }],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Outil piégé (tool poisoning, rug pull)",
        attack: "Un serveur d’outils cache des consignes dans sa description, ou la modifie discrètement après validation.",
        mitigation: "Épingler et relire les définitions d’outils ; détecter leurs changements ; liste blanche de serveurs.",
      },
      en: {
        title: "Tool poisoning and rug pull",
        attack: "A tool server hides instructions in its description, or quietly changes it after approval.",
        mitigation: "Pin and review tool definitions; detect changes; allowlist servers.",
      },
    },
  },
  {
    id: "identite-empruntee",
    category: "agents",
    uses: ["workplace", "agents"],
    surface: "actions",
    impact: "oversight",
    status: "mitigated",
    tools: ["SPIFFE/SPIRE", { fr: "Comptes de service dédiés", en: "Dedicated service accounts" }],
    copy: {
      fr: {
        title: "Agent sous identité humaine",
        attack: "L’agent emprunte les accès d’une personne ; après coup, rien ne distingue ce qu’il a fait de ce qu’elle a fait.",
        mitigation: "Identités propres aux agents, accès de courte durée, journaux attribués.",
      },
      en: {
        title: "Agent acting under a human identity",
        attack: "The agent uses a person’s credentials; afterwards nothing separates what it did from what the person did.",
        mitigation: "Dedicated agent identities, short-lived credentials, attributed logs.",
      },
    },
  },
  {
    id: "delegation-en-cascade",
    category: "agents",
    uses: ["agents"],
    surface: "actions",
    impact: "action",
    status: "unsolved",
    tools: ["OPA", { fr: "Échange de jetons OAuth", en: "OAuth token exchange" }],
    copy: {
      fr: {
        title: "Délégation en cascade entre agents",
        attack: "Un agent en appelle un autre, qui en appelle un troisième ; plus personne ne vérifie au nom de qui agit le dernier.",
        mitigation: "Propager le mandat d’origine et le vérifier à chaque étape.",
        statusNote: "Émergent",
      },
      en: {
        title: "Cascading delegation between agents",
        attack: "One agent calls another, which calls a third; nobody checks any more on whose behalf the last one acts.",
        mitigation: "Propagate the original mandate and check it at every hop.",
        statusNote: "Emerging",
      },
    },
  },

  // --- RAG ------------------------------------------------------------------
  {
    id: "empoisonnement-rag",
    category: "rag",
    uses: ["workplace", "agents", "models"],
    surface: "data",
    impact: "manipulation",
    status: "mitigated",
    tools: ["Promptfoo", "Giskard"],
    owasp: "LLM08",
    copy: {
      fr: {
        title: "Empoisonnement du RAG",
        attack: "Un attaquant dépose des documents malveillants que l’IA ira ensuite chercher.",
        mitigation: "Sources de confiance en liste blanche, signature des documents, provenance, détection d’anomalies.",
      },
      en: {
        title: "RAG poisoning",
        attack: "An attacker plants malicious documents that the AI later retrieves.",
        mitigation: "Trusted-source allowlists, document signing, provenance, anomaly detection.",
      },
    },
  },
  {
    id: "empoisonnement-vectoriel",
    category: "rag",
    uses: ["agents", "models"],
    surface: "data",
    impact: "manipulation",
    status: "mixed",
    tools: ["Qdrant (ACL)", "Milvus (ACL)"],
    owasp: "LLM08",
    copy: {
      fr: {
        title: "Empoisonnement de la base vectorielle",
        attack: "Des embeddings ou des contenus altérés faussent la recherche.",
        mitigation: "Authentification, validation des documents, contrôles d’intégrité.",
      },
      en: {
        title: "Vector DB poisoning",
        attack: "Tampered embeddings or content skew retrieval.",
        mitigation: "Authentication, document validation, integrity controls.",
      },
    },
  },
  {
    id: "inversion-embeddings",
    category: "rag",
    uses: ["models"],
    surface: "data",
    impact: "leak",
    status: "mitigated",
    tools: [{ fr: "Chiffrement et contrôle d’accès standard", en: "Standard crypto and access control" }],
    owasp: "LLM08",
    copy: {
      fr: {
        title: "Inversion d’embeddings",
        attack: "Des informations sensibles sont reconstituées à partir des embeddings.",
        mitigation: "Limiter les embeddings sensibles ; chiffrement et contrôle d’accès.",
      },
      en: {
        title: "Embedding inversion",
        attack: "Sensitive information is reconstructed from embeddings.",
        mitigation: "Minimise sensitive embeddings; encryption and access control.",
      },
    },
  },
  {
    id: "acces-rag",
    category: "rag",
    uses: ["workplace", "models"],
    surface: "data",
    impact: "leak",
    status: "solved",
    tools: ["OPA", { fr: "ACL de base vectorielle", en: "Vector-store ACLs" }],
    owasp: "LLM08",
    copy: {
      fr: {
        title: "Accès indu aux documents du RAG",
        attack: "Un utilisateur obtient des documents qu’il n’a pas le droit de consulter.",
        mitigation: "Autorisation avant la recherche ; ACL par document.",
      },
      en: {
        title: "Retrieval data leakage",
        attack: "A user retrieves documents they are not allowed to see.",
        mitigation: "Authorisation before retrieval; per-document ACLs.",
      },
    },
    explainer: {
      fr: {
        definition: "Un assistant enrichi par une base documentaire (RAG) récupère des contenus sans respecter les droits de la personne qui l’interroge.",
        example: "L’assistant interne cite un dossier RH à un collaborateur qui ne peut pas ouvrir ce dossier.",
        reflex: "Appliquer les droits d’accès lors de la recherche et cloisonner les bases documentaires.",
      },
      en: {
        definition: "An assistant using a knowledge base (RAG) retrieves documents without respecting the requesting user’s permissions.",
        example: "An internal assistant quotes an HR file to an employee who cannot open that file.",
        reflex: "Enforce access permissions during retrieval and separate document collections appropriately.",
      },
    },
  },
  {
    id: "fuite-inter-clients-rag",
    category: "rag",
    uses: ["workplace", "models"],
    surface: "data",
    impact: "leak",
    status: "solved",
    tools: [{ fr: "ACL de base de données et vectorielle", en: "Database and vector DB ACLs" }],
    owasp: "LLM08",
    copy: {
      fr: {
        title: "Fuite entre clients dans le RAG",
        attack: "Le client A récupère les données du client B.",
        mitigation: "Cloisonnement strict des espaces de noms et authentification liée au client.",
      },
      en: {
        title: "Cross-tenant RAG leakage",
        attack: "Tenant A retrieves tenant B’s data.",
        mitigation: "Strong namespace isolation and tenant-bound authentication.",
      },
    },
  },

  // --- Modèle & entraînement -------------------------------------------------
  {
    id: "empoisonnement",
    category: "model",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: [{ fr: "Frameworks de validation de données", en: "Data validation frameworks" }, "ART"],
    owasp: "LLM04",
    copy: {
      fr: {
        title: "Empoisonnement des données d’entraînement",
        attack: "Un attaquant injecte des échantillons manipulés dans les données d’entraînement.",
        mitigation: "Provenance des jeux de données, assainissement, détection d’anomalies, écriture restreinte.",
      },
      en: {
        title: "Training-data poisoning",
        attack: "An attacker injects manipulated samples into the training data.",
        mitigation: "Dataset provenance, sanitisation, anomaly detection, restricted write access.",
      },
    },
    explainer: {
      fr: {
        definition: "Des données d’apprentissage ou un modèle sont altérés pour influencer les résultats ou introduire un comportement caché.",
        example: "Un jeu de données modifié apprend au modèle à favoriser systématiquement une réponse choisie par l’attaquant.",
        reflex: "Tracer la provenance des données, contrôler leurs modifications et évaluer le modèle avant déploiement.",
      },
      en: {
        definition: "Training data or a model is tampered with to influence results or introduce hidden behaviour.",
        example: "A modified dataset teaches the model to consistently favour an answer selected by an attacker.",
        reflex: "Track data provenance, review changes and evaluate the model before deployment.",
      },
    },
  },
  {
    id: "empoisonnement-fine-tuning",
    category: "model",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["garak", "Giskard", "ART"],
    owasp: "LLM04",
    copy: {
      fr: {
        title: "Empoisonnement du fine-tuning",
        attack: "Des exemples malveillants modifient délibérément le comportement du modèle.",
        mitigation: "Jeux de données de confiance, tests différentiels, évaluation du modèle.",
      },
      en: {
        title: "Fine-tuning poisoning",
        attack: "Malicious examples deliberately shift the model’s behaviour.",
        mitigation: "Trusted datasets, differential testing, model evaluation.",
      },
    },
  },
  {
    id: "modele-piege",
    category: "model",
    uses: ["development", "models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["ModelScan", "Fickling", "garak"],
    owasp: "LLM04",
    copy: {
      fr: { title: "Modèle piégé (backdoor)", attack: "Un déclencheur caché active un comportement malveillant.", mitigation: "Provenance du modèle, analyse, tests comportementaux." },
      en: { title: "Backdoored model", attack: "A hidden trigger switches on malicious behaviour.", mitigation: "Model provenance, scanning, behavioural testing." },
    },
  },
  {
    id: "alteration-source-modele",
    category: "model",
    uses: ["development", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["Sigstore/cosign", { fr: "Signature Git", en: "Git signing" }],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Altération du modèle avant déploiement",
        attack: "Le modèle ou son code est modifié avant le déploiement.",
        mitigation: "Empreintes, signatures, chaînes de build reproductibles.",
      },
      en: {
        title: "Model source tampering",
        attack: "The model or its code is modified before deployment.",
        mitigation: "Hashes, signatures, reproducible pipelines.",
      },
    },
  },
  {
    id: "modele-serialise-malveillant",
    category: "model",
    uses: ["development", "models"],
    surface: "model",
    impact: "compromise",
    status: "solved",
    tools: ["ModelScan", "Fickling"],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Modèle sérialisé malveillant",
        attack: "Un modèle pickle ou PyTorch exécute du code au chargement.",
        mitigation: "Préférer des formats sûrs comme safetensors ; bac à sable ; analyser les modèles.",
        statusNote: "Parade solide",
      },
      en: {
        title: "Malicious serialised model",
        attack: "A pickle or PyTorch model runs code when it is loaded.",
        mitigation: "Prefer safe formats such as safetensors; sandbox; scan models.",
        statusNote: "Strong mitigation",
      },
    },
  },
  {
    id: "vol-de-modele",
    category: "model",
    uses: ["models"],
    surface: "infra",
    impact: "leak",
    status: "mixed",
    tools: [{ fr: "Pile IAM et sécurité open source", en: "Open-source IAM and security stack" }],
    copy: {
      fr: {
        title: "Vol ou exfiltration de poids",
        attack: "Un attaquant dérobe les poids du modèle sur disque ou dans le cloud.",
        mitigation: "IAM, chiffrement, isolement réseau, journalisation.",
      },
      en: {
        title: "Model theft and exfiltration",
        attack: "An attacker steals the model’s weights from disk or the cloud.",
        mitigation: "IAM, encryption, network isolation, audit logging.",
      },
    },
  },
  {
    id: "extraction-par-api",
    category: "model",
    uses: ["models"],
    surface: "model",
    impact: "leak",
    status: "mitigated",
    tools: [{ fr: "Passerelles d’API", en: "API gateways" }, { fr: "Limitation de débit", en: "Rate limiting" }],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Extraction de modèle par l’API",
        attack: "Des requêtes répétées permettent d’approcher un modèle propriétaire.",
        mitigation: "Limites de débit, contrôle des sorties, détection, recherche sur le tatouage.",
      },
      en: {
        title: "Model extraction via API",
        attack: "Repeated queries approximate a proprietary model.",
        mitigation: "Rate limits, output controls, detection, watermarking research.",
      },
    },
  },
  {
    id: "inversion-de-modele",
    category: "model",
    uses: ["models"],
    surface: "model",
    impact: "leak",
    status: "mitigated",
    tools: ["Opacus", "TensorFlow Privacy"],
    copy: {
      fr: {
        title: "Inversion de modèle",
        attack: "Des propriétés ou des exemples sont retrouvés à partir des sorties du modèle.",
        mitigation: "Confidentialité différentielle ; sorties moins détaillées, sans scores de confiance.",
      },
      en: {
        title: "Model inversion",
        attack: "Properties or examples are recovered from the model’s outputs.",
        mitigation: "Differential privacy; less detailed outputs without confidence scores.",
      },
    },
  },
  {
    id: "inference-appartenance",
    category: "model",
    uses: ["models"],
    surface: "model",
    impact: "leak",
    status: "mitigated",
    tools: ["ART", "Opacus"],
    copy: {
      fr: {
        title: "Inférence d’appartenance",
        attack: "Un attaquant détermine si les données d’une personne ont servi à l’entraînement.",
        mitigation: "Confidentialité différentielle, régularisation, sorties limitées.",
      },
      en: {
        title: "Membership inference",
        attack: "An attacker works out whether someone’s data was in the training set.",
        mitigation: "Differential privacy, regularisation, limited model outputs.",
      },
    },
  },

  // --- Attaques adverses -----------------------------------------------------
  {
    id: "exemples-adverses",
    category: "adversarial",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "unsolved",
    tools: ["IBM Adversarial Robustness Toolbox (ART)"],
    copy: {
      fr: {
        title: "Exemples adverses (évasion)",
        attack: "Une infime perturbation de l’entrée change la classification.",
        mitigation: "Entraînement adverse, prétraitement robuste, ensembles de modèles.",
        statusNote: "Dépend du domaine",
      },
      en: {
        title: "Adversarial examples and evasion",
        attack: "A tiny input perturbation changes the classification.",
        mitigation: "Adversarial training, robust preprocessing, ensembles.",
        statusNote: "Domain-dependent",
      },
    },
  },
  {
    id: "attaque-adverse-physique",
    category: "adversarial",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["ART"],
    copy: {
      fr: {
        title: "Attaque adverse physique",
        attack: "Un autocollant, un patch ou un panneau trompe une caméra ou un modèle.",
        mitigation: "Fusion de capteurs, entraînement adverse, contrôles de robustesse.",
      },
      en: {
        title: "Physical adversarial attack",
        attack: "A sticker, patch or sign fools a camera or model.",
        mitigation: "Sensor fusion, adversarial training, robustness checks.",
      },
    },
  },
  {
    id: "patchs-adverses",
    category: "adversarial",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["ART"],
    copy: {
      fr: {
        title: "Patchs adverses",
        attack: "Un motif ajouté à l’image renverse la décision d’un détecteur ou d’un classifieur.",
        mitigation: "Détection et entraînement robuste.",
      },
      en: {
        title: "Adversarial patches",
        attack: "An image patch flips an object detector’s or classifier’s decision.",
        mitigation: "Detection plus robust training.",
      },
    },
  },
  {
    id: "attaques-par-transfert",
    category: "adversarial",
    uses: ["models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["ART"],
    copy: {
      fr: {
        title: "Attaques par transfert",
        attack: "Une attaque conçue contre un modèle fonctionne aussi sur un autre.",
        mitigation: "Évaluation adverse et ingénierie de la robustesse.",
      },
      en: {
        title: "Transfer attacks",
        attack: "An attack crafted against one model also works on another.",
        mitigation: "Adversarial evaluation plus robustness engineering.",
      },
    },
  },

  // --- Sorties ---------------------------------------------------------------
  {
    id: "sorties-non-maitrisees",
    category: "output",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: ["Semgrep", { fr: "Bibliothèques OWASP", en: "OWASP libraries" }],
    owasp: "LLM05",
    copy: {
      fr: {
        title: "Traitement non sécurisé des sorties",
        attack: "La sortie de l’IA devient directement du SQL, du HTML ou une commande shell.",
        mitigation: "Traiter la sortie du modèle comme une entrée non fiable ; paramétrer ; encoder et valider.",
      },
      en: {
        title: "Improper output handling",
        attack: "AI output is used directly as SQL, HTML or shell commands.",
        mitigation: "Treat model output as untrusted input; parameterise; encode and validate.",
      },
    },
  },
  {
    id: "code-vulnerable",
    category: "output",
    uses: ["development"],
    surface: "people",
    impact: "compromise",
    status: "mitigated",
    tools: ["Semgrep", "Bandit"],
    owasp: "LLM05",
    copy: {
      fr: {
        title: "Code généré vulnérable",
        attack: "Du code ou des commandes générés par l’IA partent sans relecture suffisante et introduisent une faille.",
        mitigation: "Relecture, analyse statique (SAST) en CI, maintien des contrôles de sécurité du projet.",
      },
      en: {
        title: "Vulnerable generated code",
        attack: "AI-generated code or commands ship without adequate review and introduce a flaw.",
        mitigation: "Code review, static analysis (SAST) in CI, keep the project’s security checks.",
      },
    },
    explainer: {
      fr: {
        definition: "Du code ou une commande proposés par l’IA sont intégrés sans validation suffisante et introduisent une faille dans l’application.",
        example: "Une requête SQL générée assemble directement la saisie utilisateur et ouvre la voie à une injection.",
        reflex: "Relire le code, valider les sorties et conserver les contrôles de sécurité du projet.",
      },
      en: {
        definition: "AI-generated code or commands are integrated without adequate validation, introducing an application vulnerability.",
        example: "A generated SQL query directly joins user input, allowing an injection attack.",
        reflex: "Review code, validate outputs and retain the project’s security checks.",
      },
    },
  },
  {
    id: "injection-sql-via-llm",
    category: "output",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: ["SQLAlchemy", { fr: "Droits de base de données", en: "Database permissions" }],
    owasp: "LLM05",
    copy: {
      fr: {
        title: "Injection SQL via le LLM",
        attack: "Le SQL généré par le modèle embarque la saisie de l’attaquant.",
        mitigation: "Requêtes paramétrées et interface de requête restreinte.",
      },
      en: {
        title: "SQL injection via LLM",
        attack: "Model-generated SQL carries the attacker’s input.",
        mitigation: "Parameterised queries and a constrained query interface.",
      },
    },
  },
  {
    id: "injection-de-commande",
    category: "output",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: ["seccomp", CONTAINERS],
    owasp: "LLM05",
    copy: {
      fr: {
        title: "Injection de commande",
        attack: "L’IA génère et exécute des commandes shell.",
        mitigation: "Éviter le shell ; API en liste blanche ; bac à sable.",
      },
      en: {
        title: "Command injection",
        attack: "The AI generates and runs shell commands.",
        mitigation: "Avoid shells; allowlisted APIs; sandboxing.",
      },
    },
  },
  {
    id: "xss-contenu-genere",
    category: "output",
    uses: ["development"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: ["DOMPurify", "OWASP Java Encoder"],
    owasp: "LLM05",
    copy: {
      fr: {
        title: "XSS par contenu généré",
        attack: "Le HTML ou le Markdown généré contient du JavaScript malveillant.",
        mitigation: "Encodage et assainissement des sorties selon leur contexte.",
      },
      en: {
        title: "XSS from generated content",
        attack: "Generated HTML or Markdown carries malicious JavaScript.",
        mitigation: "Context-aware output encoding and sanitisation.",
      },
    },
  },
  {
    id: "ssrf-via-agent",
    category: "output",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: [{ fr: "Pare-feu et proxys", en: "Firewalls and proxies" }, "OPA"],
    copy: {
      fr: {
        title: "SSRF par un agent",
        attack: "Un navigateur ou un outil de l’IA atteint des adresses internes ou le service de métadonnées cloud.",
        mitigation: "Liste blanche de sortie, isolement réseau, validation des URL.",
      },
      en: {
        title: "SSRF through agents",
        attack: "An AI browser or tool reaches internal addresses or the cloud metadata service.",
        mitigation: "Egress allowlist, network isolation, URL validation.",
      },
    },
  },
  {
    id: "traversee-de-chemin",
    category: "output",
    uses: ["development", "agents"],
    surface: "actions",
    impact: "compromise",
    status: "solved",
    tools: [{ fr: "Codage sécurisé standard", en: "Standard secure coding" }],
    copy: {
      fr: {
        title: "Traversée de répertoire",
        attack: "Un nom de fichier produit par l’agent atteint un fichier non prévu.",
        mitigation: "Canonisation des chemins et répertoires cloisonnés.",
      },
      en: {
        title: "Path traversal",
        attack: "An agent-generated file name reaches an unintended file.",
        mitigation: "Canonicalisation plus sandboxed directories.",
      },
    },
  },

  // --- Confidentialité ---------------------------------------------------------
  {
    id: "fuite-de-donnees",
    category: "privacy",
    uses: ["development", "workplace", "agents", "models"],
    surface: "data",
    impact: "leak",
    status: "mixed",
    tools: ["Microsoft Presidio"],
    owasp: "LLM02",
    copy: {
      fr: {
        title: "Divulgation d’informations sensibles",
        attack: "L’IA divulgue des données personnelles, des identifiants ou des secrets.",
        mitigation: "Minimisation des données, DLP, filtrage, contrôle d’accès.",
      },
      en: {
        title: "Sensitive information disclosure",
        attack: "The AI discloses personal data, credentials or secrets.",
        mitigation: "Data minimisation, DLP, filtering, access control.",
      },
    },
    explainer: {
      fr: {
        definition: "Une information confidentielle est transmise à un service IA non autorisé ou ressort dans une réponse accessible à une personne non autorisée.",
        example: "Un collaborateur joint un fichier client à un assistant non autorisé ; un assistant cite les coordonnées d’un client à une personne qui n’a pas à les connaître.",
        reflex: "Réduire les données transmises et vérifier les destinataires autorisés.",
      },
      en: {
        definition: "Confidential information is sent to an unauthorised AI service or appears in a response available to someone without permission.",
        example: "An employee attaches a customer file to an unapproved assistant; an assistant quotes a customer’s details to someone who has no need to know them.",
        reflex: "Minimise shared data and check who is allowed to receive it.",
      },
    },
  },
  {
    id: "fuite-dans-les-journaux",
    category: "privacy",
    uses: ["development", "agents"],
    surface: "infra",
    impact: "leak",
    status: "solved",
    tools: ["Presidio", { fr: "Filtres OpenTelemetry", en: "OpenTelemetry filters" }],
    owasp: "LLM02",
    copy: {
      fr: {
        title: "Prompts et secrets dans les journaux",
        attack: "Des prompts et des secrets finissent stockés dans les outils d’observabilité ou de traces.",
        mitigation: "Masquage, journalisation restreinte, chiffrement.",
      },
      en: {
        title: "Prompt leakage in logs",
        attack: "Prompts and secrets end up stored in observability or tracing systems.",
        mitigation: "Redaction, restricted logging, encryption.",
      },
    },
  },
  {
    id: "fuite-de-secrets",
    secretGuard: true,
    category: "privacy",
    uses: ["development", "workplace"],
    surface: "prompt",
    impact: "leak",
    status: "solved",
    tools: ["Gitleaks", "TruffleHog"],
    owasp: "LLM02",
    copy: {
      fr: {
        title: "Fuite de secrets",
        attack: "Des utilisateurs collent des clés d’API, des mots de passe ou du code source dans un prompt.",
        mitigation: "Détection des secrets avant l’envoi.",
      },
      en: {
        title: "Secret leakage",
        attack: "Users paste API keys, passwords or source code into a prompt.",
        mitigation: "Secret detection before submission.",
      },
    },
  },
  {
    id: "memorisation-entrainement",
    category: "privacy",
    uses: ["models"],
    surface: "model",
    impact: "leak",
    status: "mitigated",
    tools: ["Opacus", "Presidio"],
    owasp: "LLM02",
    copy: {
      fr: {
        title: "Mémorisation des données d’entraînement",
        attack: "Le modèle recrache des exemples confidentiels vus à l’entraînement.",
        mitigation: "Dédoublonnage, entraînement confidentiel, confidentialité différentielle, filtres de sortie.",
      },
      en: {
        title: "Training-data memorisation",
        attack: "The model repeats confidential examples seen during training.",
        mitigation: "Deduplication, private training, differential privacy, output filters.",
      },
    },
  },
  {
    id: "inference-attributs-sensibles",
    category: "privacy",
    uses: ["workplace", "models"],
    surface: "model",
    impact: "leak",
    status: "mitigated",
    tools: ["ART", { fr: "Outils de confidentialité", en: "Privacy tooling" }],
    owasp: "LLM02",
    copy: {
      fr: {
        title: "Inférence d’attributs sensibles",
        attack: "L’IA déduit des attributs qui n’ont jamais été communiqués.",
        mitigation: "Minimisation des données, sorties restreintes, tests de confidentialité.",
      },
      en: {
        title: "Inference of sensitive attributes",
        attack: "The AI infers attributes that were never disclosed.",
        mitigation: "Data minimisation, restricted outputs, privacy testing.",
      },
    },
  },

  // --- Chaîne d'approvisionnement ----------------------------------------------
  {
    id: "depot-de-modeles-compromis",
    category: "supply",
    uses: ["development", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["ModelScan", "Fickling", "Sigstore"],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Dépôt de modèles compromis",
        attack: "Un modèle malveillant est publié sur un hub de modèles.",
        mitigation: "Vérifier l’éditeur, l’empreinte et la signature ; analyser l’artefact.",
      },
      en: {
        title: "Compromised model repository",
        attack: "A malicious model is uploaded to a model hub.",
        mitigation: "Verify publisher, hash and signature; scan the artefact.",
      },
    },
  },
  {
    id: "dependances-compromises",
    category: "supply",
    uses: ["development", "agents", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["Syft", "Grype", "Trivy", "osv-scanner"],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Dépendances compromises",
        attack: "Une dépendance Python ou npm malveillante atteint la pile IA.",
        mitigation: "Fichiers de verrouillage, SBOM, signature, analyse.",
      },
      en: {
        title: "Dependency compromise",
        attack: "A malicious Python or npm dependency reaches the AI stack.",
        mitigation: "Lockfiles, SBOM, signing, scanning.",
      },
    },
    explainer: {
      fr: {
        definition: "Une bibliothèque, un modèle ou un composant tiers introduit une vulnérabilité ou un comportement malveillant dans la chaîne IA.",
        example: "Une équipe importe un modèle depuis un dépôt imitant celui de son fournisseur habituel.",
        reflex: "Vérifier l’origine et l’intégrité des composants, puis suivre leurs versions et vulnérabilités.",
      },
      en: {
        definition: "A third-party library, model or component introduces a vulnerability or malicious behaviour into the AI supply chain.",
        example: "A team imports a model from a repository impersonating its usual supplier.",
        reflex: "Check component provenance and integrity, then track versions and vulnerabilities.",
      },
    },
  },
  {
    id: "typosquatting",
    category: "supply",
    uses: ["development"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: [{ fr: "Contrôles pip et npm", en: "pip and npm controls" }, { fr: "Analyseurs de dépendances", en: "Dependency scanners" }],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Typosquatting et confusion de dépendances",
        attack: "Un attaquant publie une bibliothèque IA au nom presque identique.",
        mitigation: "Registre interne, contrôle des espaces de noms, fichiers de verrouillage.",
      },
      en: {
        title: "Typosquatting and dependency confusion",
        attack: "An attacker publishes an AI library with a near-identical name.",
        mitigation: "Internal registry, namespace controls, lockfiles.",
      },
    },
  },
  {
    id: "framework-compromis",
    category: "supply",
    uses: ["development", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["Sigstore", { fr: "Outillage SLSA", en: "SLSA tooling" }],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Framework d’entraînement compromis",
        attack: "PyTorch, une bibliothèque ou la chaîne d’outils sont altérés.",
        mitigation: "Builds de confiance, empreintes, SBOM, artefacts signés.",
      },
      en: {
        title: "Compromised training framework",
        attack: "PyTorch, a library or the toolchain is altered.",
        mitigation: "Trusted builds, hashes, SBOM, signed artefacts.",
      },
    },
  },
  {
    id: "format-de-modele-dangereux",
    category: "supply",
    uses: ["development", "models"],
    surface: "model",
    impact: "compromise",
    status: "solved",
    tools: ["ModelScan", "Fickling"],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Format de modèle dangereux",
        attack: "Un format de type pickle embarque une charge exécutable.",
        mitigation: "Safetensors ou une autre représentation non exécutable.",
      },
      en: {
        title: "Unsafe model format",
        attack: "A pickle-like format embeds an executable payload.",
        mitigation: "Safetensors or another non-executable representation.",
      },
    },
  },

  // --- Infrastructure --------------------------------------------------------
  {
    id: "vol-identifiants-cloud",
    category: "infra",
    uses: ["development", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["OpenBao / Vault", { fr: "Outillage des secrets Kubernetes", en: "Kubernetes secrets tooling" }],
    copy: {
      fr: {
        title: "Vol d’identifiants GPU ou cloud",
        attack: "Un notebook compromis expose des identifiants cloud.",
        mitigation: "Identité de charge de travail, identifiants de courte durée, coffre à secrets.",
      },
      en: {
        title: "GPU and cloud credential theft",
        attack: "A compromised notebook exposes cloud credentials.",
        mitigation: "Workload identity, short-lived credentials, a secret vault.",
      },
    },
  },
  {
    id: "vol-cle-api-ia",
    category: "infra",
    uses: ["development", "agents"],
    surface: "infra",
    impact: "leak",
    status: "solved",
    tools: ["OpenBao / Vault", "Gitleaks", "TruffleHog"],
    copy: {
      fr: {
        title: "Vol de clé d’API IA",
        attack: "Une clé fuit par le code, les journaux ou le modèle.",
        mitigation: "Gestion des secrets, rotation des clés, portées limitées.",
      },
      en: {
        title: "AI API key theft",
        attack: "A key leaks through code, logs or the model.",
        mitigation: "Secret management, key rotation, scope limits.",
      },
    },
  },
  {
    id: "serveur-inference-compromis",
    category: "infra",
    uses: ["models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["Trivy", "Falco", "Kubernetes"],
    copy: {
      fr: {
        title: "Serveur d’inférence compromis",
        attack: "Une vulnérabilité de la pile de service du modèle est exploitée.",
        mitigation: "Gestion des correctifs, isolement des conteneurs, authentification.",
      },
      en: {
        title: "Inference-server compromise",
        attack: "A vulnerability in the model-serving stack is exploited.",
        mitigation: "Patch management, container isolation, authentication.",
      },
    },
  },
  {
    id: "evasion-de-conteneur",
    category: "infra",
    uses: ["agents", "models"],
    surface: "infra",
    impact: "compromise",
    status: "mixed",
    tools: ["Docker", "Kata Containers", "gVisor"],
    copy: {
      fr: {
        title: "Évasion de conteneur",
        attack: "Un modèle ou du code malveillant s’échappe de son bac à sable.",
        mitigation: "seccomp, espaces de noms, isolement par VM.",
      },
      en: {
        title: "Container escape and runtime exploit",
        attack: "A malicious model or code escapes its sandbox.",
        mitigation: "seccomp, namespaces, VM isolation.",
      },
    },
  },
  {
    id: "notebook-compromis",
    category: "infra",
    uses: ["development", "models"],
    surface: "infra",
    impact: "compromise",
    status: "solved",
    tools: ["JupyterHub", CONTAINERS],
    copy: {
      fr: {
        title: "Notebook compromis",
        attack: "Un serveur Jupyter permet d’exécuter du code arbitraire.",
        mitigation: "Authentification, isolement réseau, bac à sable par utilisateur.",
      },
      en: {
        title: "Notebook compromise",
        attack: "A Jupyter server allows arbitrary code execution.",
        mitigation: "Authentication, network isolation, per-user sandbox.",
      },
    },
  },

  // --- Disponibilité & coûts -------------------------------------------------
  {
    id: "deni-de-service-modele",
    category: "availability",
    uses: ["agents", "models"],
    surface: "prompt",
    impact: "cost",
    status: "solved",
    tools: ["NGINX", "Envoy", "Kong"],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Déni de service du modèle",
        attack: "Des prompts extrêmement coûteux saturent le modèle.",
        mitigation: "Quotas, limites de débit, plafonds de taille et de jetons.",
      },
      en: {
        title: "Model denial of service",
        attack: "Extremely costly prompts saturate the model.",
        mitigation: "Quotas, rate limits, request-size and token limits.",
      },
    },
  },
  {
    id: "deni-de-portefeuille",
    category: "availability",
    uses: ["workplace", "agents", "models"],
    surface: "prompt",
    impact: "cost",
    status: "solved",
    tools: [{ fr: "Passerelles d’API", en: "API gateways" }, { fr: "Suivi de facturation", en: "Billing monitors" }],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Déni de portefeuille",
        attack: "Un attaquant fait délibérément exploser la facture d’API ou de cloud.",
        mitigation: "Budgets et limites par utilisateur ; alertes de dépense.",
      },
      en: {
        title: "Denial of wallet",
        attack: "An attacker deliberately runs up a large API or cloud bill.",
        mitigation: "Per-user budgets and rate limits; spend alerts.",
      },
    },
  },
  {
    id: "complexite-algorithmique",
    category: "availability",
    uses: ["models"],
    surface: "prompt",
    impact: "cost",
    status: "solved",
    tools: [{ fr: "Contrôles de passerelle standard", en: "Standard gateway controls" }],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Attaques par complexité algorithmique",
        attack: "Des entrées sont conçues pour maximiser la charge d’inférence.",
        mitigation: "Plafonds de jetons et de taille d’entrée, délais.",
      },
      en: {
        title: "Algorithmic complexity attacks",
        attack: "Inputs are crafted to maximise the inference workload.",
        mitigation: "Token and input limits, timeouts.",
      },
    },
  },
  {
    id: "epuisement-gpu",
    category: "availability",
    uses: ["models"],
    surface: "infra",
    impact: "cost",
    status: "solved",
    tools: ["Kubernetes"],
    owasp: "LLM10",
    copy: {
      fr: {
        title: "Épuisement des ressources GPU",
        attack: "Des tâches malveillantes accaparent tous les accélérateurs.",
        mitigation: "Quotas Kubernetes et limites d’ordonnancement.",
      },
      en: {
        title: "GPU resource exhaustion",
        attack: "Malicious jobs grab every accelerator.",
        mitigation: "Kubernetes quotas and scheduling limits.",
      },
    },
  },

  // --- Intégrité & confiance -------------------------------------------------
  {
    id: "hallucinations",
    category: "integrity",
    uses: ["development", "workplace", "agents", "models"],
    surface: "model",
    impact: "manipulation",
    status: "mitigated",
    tools: ["Giskard", { fr: "Frameworks d’évaluation", en: "Eval frameworks" }],
    owasp: "LLM09",
    copy: {
      fr: {
        title: "Hallucinations exploitées",
        attack: "Un attaquant compte sur la confiance accordée à une information inventée.",
        mitigation: "Ancrage dans des sources, recherche, vérification, approbation avant d’agir.",
        statusNote: "Pas entièrement résolu",
      },
      en: {
        title: "Hallucination exploitation",
        attack: "An attacker counts on fabricated information being trusted.",
        mitigation: "Grounding, retrieval, verification, approval before acting.",
        statusNote: "Not fully solved",
      },
    },
    explainer: {
      fr: {
        definition: "L’IA produit une réponse convaincante mais inexacte. Le risque augmente si cette réponse est utilisée sans vérification.",
        example: "Une synthèse invente un chiffre que le collaborateur reprend dans une présentation client.",
        reflex: "Vérifier les faits dans les sources et faire relire les décisions importantes par une personne compétente.",
      },
      en: {
        definition: "AI produces a convincing but inaccurate answer. The risk grows when that answer is used without verification.",
        example: "A summary invents a number that an employee copies into a customer presentation.",
        reflex: "Check facts against their sources and have important decisions reviewed by a qualified person.",
      },
    },
  },
  {
    id: "fausses-citations",
    category: "integrity",
    uses: ["development", "workplace"],
    surface: "model",
    impact: "manipulation",
    status: "mixed",
    tools: [{ fr: "Validateurs sur mesure", en: "Custom validators" }],
    owasp: "LLM09",
    copy: {
      fr: {
        title: "Fausses citations",
        attack: "Le modèle invente des URL ou des sources.",
        mitigation: "Résoudre et vérifier les sources citées par programme.",
      },
      en: {
        title: "Fake citations",
        attack: "The model invents URLs or sources.",
        mitigation: "Resolve and verify cited sources programmatically.",
      },
    },
  },
  {
    id: "manipulation-base-de-connaissances",
    category: "integrity",
    uses: ["workplace", "models"],
    surface: "data",
    impact: "manipulation",
    status: "solved",
    tools: ["Sigstore", { fr: "Contrôles sur mesure", en: "Custom controls" }],
    copy: {
      fr: {
        title: "Manipulation de la base de connaissances",
        attack: "Un attaquant modifie une source d’information qui fait autorité.",
        mitigation: "Données signées, provenance, pondération des sources.",
      },
      en: {
        title: "Knowledge-base manipulation",
        attack: "An attacker changes an authoritative source of information.",
        mitigation: "Signed data, provenance, source weighting.",
      },
    },
  },

  // --- Abus humains ------------------------------------------------------------
  {
    id: "phishing-augmente",
    category: "human",
    uses: ["workplace", "agents"],
    surface: "people",
    impact: "fraud",
    status: "mitigated",
    tools: ["SpamAssassin"],
    copy: {
      fr: {
        title: "Phishing augmenté par l’IA",
        attack: "L’IA produit à grande échelle une ingénierie sociale personnalisée.",
        mitigation: "Sécurité de la messagerie, DMARC, vérification des utilisateurs, détection d’anomalies.",
      },
      en: {
        title: "AI-enhanced phishing",
        attack: "AI produces personalised social engineering at scale.",
        mitigation: "Email security, DMARC, user verification, anomaly detection.",
      },
    },
  },
  {
    id: "usurpation-deepfake",
    category: "human",
    uses: ["workplace"],
    surface: "people",
    impact: "fraud",
    status: "mitigated",
    tools: ["C2PA"],
    copy: {
      fr: {
        title: "Usurpation par deepfake",
        attack: "Un faux audio ou une fausse vidéo sert à frauder ou à contourner une authentification.",
        mitigation: "Authentification hors bande, détection du vivant, provenance cryptographique.",
      },
      en: {
        title: "Deepfake impersonation",
        attack: "Fake audio or video is used for fraud or to bypass authentication.",
        mitigation: "Out-of-band authentication, liveness checks, cryptographic provenance.",
      },
    },
  },
  {
    id: "fraude-voix-clonee",
    category: "human",
    uses: ["workplace"],
    surface: "people",
    impact: "fraud",
    status: "solved",
    tools: [{ fr: "MFA standard", en: "Standard MFA" }],
    copy: {
      fr: {
        title: "Fraude à la voix clonée",
        attack: "Une voix de synthèse imite un collaborateur ou un proche.",
        mitigation: "Ne jamais accepter une voix seule comme authentification.",
      },
      en: {
        title: "Voice cloning fraud",
        attack: "A synthetic voice impersonates an employee or a relative.",
        mitigation: "Never accept a voice alone as authentication.",
      },
    },
  },
  {
    id: "malware-genere",
    category: "human",
    uses: ["development"],
    surface: "infra",
    impact: "compromise",
    status: "mitigated",
    tools: ["YARA", "Sigma", "Suricata", "ClamAV"],
    copy: {
      fr: {
        title: "Malware généré par IA",
        attack: "L’IA réduit l’effort nécessaire pour écrire ou modifier du code malveillant.",
        mitigation: "Détection endpoint et réseau existante, surveillance des abus.",
      },
      en: {
        title: "AI-generated malware",
        attack: "AI lowers the effort needed to write or modify malicious code.",
        mitigation: "Existing endpoint and network detection, plus abuse monitoring.",
      },
    },
  },
  {
    id: "decouverte-vulnerabilites",
    category: "human",
    uses: ["development"],
    surface: "infra",
    impact: "compromise",
    status: "mitigated",
    tools: ["Nuclei", "Wazuh", "Suricata"],
    copy: {
      fr: {
        title: "Découverte automatisée de vulnérabilités",
        attack: "L’IA accélère la reconnaissance et l’exploitation.",
        mitigation: "Gestion de la surface d’attaque, IDS, correctifs.",
      },
      en: {
        title: "Automated vulnerability discovery abuse",
        attack: "AI speeds up reconnaissance and exploitation.",
        mitigation: "Attack-surface management, IDS, patching.",
      },
    },
  },

  // --- Gouvernance -----------------------------------------------------------
  {
    id: "shadow-ai",
    category: "governance",
    uses: ["development", "workplace"],
    surface: "people",
    impact: "leak",
    status: "solved",
    tools: [{ fr: "Surveillance DNS et proxy", en: "DNS and proxy monitoring" }, "DLP"],
    copy: {
      fr: {
        title: "Shadow AI",
        attack: "Des collaborateurs envoient des données de l’entreprise vers des outils IA non autorisés.",
        mitigation: "Inventaire des applications, contrôles sur les postes, services approuvés.",
      },
      en: {
        title: "Shadow AI",
        attack: "Employees send company data to unapproved AI tools.",
        mitigation: "Application inventory, endpoint controls, approved services.",
      },
    },
  },
  {
    id: "provenance-modele-inconnue",
    category: "governance",
    uses: ["development", "models"],
    surface: "model",
    impact: "oversight",
    status: "solved",
    tools: ["CycloneDX"],
    owasp: "LLM03",
    copy: {
      fr: {
        title: "Provenance de modèle inconnue",
        attack: "L’organisation ignore l’origine, les données ou la version de ses modèles.",
        mitigation: "Inventaire IA et ML, provenance, SBOM et ML-BOM.",
      },
      en: {
        title: "Unknown model provenance",
        attack: "The organisation cannot tell where a model comes from, what data it saw or which version runs.",
        mitigation: "AI and ML inventory, provenance, SBOM and ML-BOM.",
      },
    },
  },
  {
    id: "red-teaming-insuffisant",
    category: "governance",
    uses: ["development", "models"],
    surface: "model",
    impact: "oversight",
    status: "solved",
    tools: ["garak", "PyRIT", "Promptfoo", "Giskard"],
    copy: {
      fr: {
        title: "Red teaming IA insuffisant",
        attack: "Les vulnérabilités ne sont découvertes qu’après le déploiement.",
        mitigation: "Évaluation adverse continue dans la CI/CD.",
      },
      en: {
        title: "Insufficient AI red teaming",
        attack: "Vulnerabilities are found only after deployment.",
        mitigation: "Continuous adversarial evaluation in CI/CD.",
      },
    },
  },
  {
    id: "derive-de-modele",
    category: "governance",
    uses: ["development", "agents", "models"],
    surface: "model",
    impact: "manipulation",
    status: "solved",
    tools: ["Promptfoo", "garak", "Giskard"],
    copy: {
      fr: {
        title: "Dérive ou régression de sécurité du modèle",
        attack: "Une nouvelle version du modèle ou du prompt réintroduit des vulnérabilités.",
        mitigation: "Suite de non-régression de sécurité avant chaque mise en production.",
      },
      en: {
        title: "Model drift and security regression",
        attack: "A new model or prompt version brings vulnerabilities back.",
        mitigation: "A security regression suite before every release.",
      },
    },
  },
  {
    id: "actions-non-tracables",
    category: "governance",
    uses: ["workplace", "agents"],
    surface: "actions",
    impact: "oversight",
    status: "solved",
    tools: ["Sigstore Rekor", "OpenTelemetry"],
    copy: {
      fr: {
        title: "Actions d’agent non traçables",
        attack: "Personne ne peut prouver après coup ce que l’agent a fait, pourquoi, ni qui l’a approuvé ; les journaux sont réécrivables.",
        mitigation: "Journaux en ajout seul et infalsifiables, décisions signées, preuves exportables.",
      },
      en: {
        title: "Untraceable agent actions",
        attack: "Nobody can prove afterwards what the agent did, why, or who approved it; logs can be rewritten.",
        mitigation: "Append-only, tamper-evident logs; signed decisions; exportable evidence.",
      },
    },
  },
];

export const GLOSSARY_COPY = {
  fr: {
    title: "Glossaire des menaces IA",
    description: "Le glossaire opérationnel des menaces cyber de l’IA : attaque type, parade de référence, outils libres et état de l’art, filtrables par usage, surface d’attaque et impact.",
    kicker: "COMPRENDRE LES RISQUES",
    intro: "Trouvez la menace IA qui vous concerne et découvrez la réponse adaptée : l’attaque type, la parade de référence et les outils libres.",
    home: "Accueil",
    search: "Rechercher une menace",
    placeholder: "Ex. : injection, secrets, garak, RAG…",
    sort: "Trier par",
    sorts: { category: "Catégorie", risk: "Non résolu d’abord", name: "Nom (A → Z)" },
    filterHint: "Commencez par votre usage de l’IA. Le reste est facultatif.",
    filter: "Filtrer par usage IA",
    all: "Tous les usages",
    uses: { development: "Équipes de développement", workplace: "Équipes métier", agents: "Agents", models: "Équipes modèles & données" },
    moreFilters: "Plus de filtres",
    moreFiltersHint: "Catégorie, surface, impact, état de l’art, Secret Guard",
    threatFilters: "Nature de la menace",
    category: "Catégorie",
    categoryAll: "Toutes les catégories",
    categories: {
      prompt: "Prompts & instructions",
      agents: "Agents",
      rag: "RAG",
      model: "Modèle & entraînement",
      adversarial: "Attaques adverses",
      output: "Sorties",
      privacy: "Confidentialité",
      supply: "Chaîne d’approvisionnement",
      infra: "Infrastructure",
      availability: "Disponibilité & coûts",
      integrity: "Intégrité & confiance",
      human: "Abus humains",
      governance: "Gouvernance",
    },
    surface: "Surface d’attaque",
    surfaceAll: "Toutes les surfaces",
    surfaces: {
      prompt: "Prompt",
      data: "Données & contexte",
      model: "Modèle & poids",
      actions: "Actions & outils",
      people: "Humains",
      infra: "Infra & dépendances",
    },
    impact: "Impact",
    impactAll: "Tous les impacts",
    impacts: {
      leak: "Fuite de données",
      manipulation: "Réponse manipulée",
      action: "Action non autorisée",
      compromise: "Compromission technique",
      cost: "Panne & coûts",
      fraud: "Fraude",
      oversight: "Perte de contrôle",
    },
    status: "État de l’art",
    statusAll: "Tous les états",
    statuses: { unsolved: "Non résolu", mitigated: "Atténué", mixed: "Selon le contexte", solved: "Maîtrisé" },
    engineFilters: "Secret Guard · moteur open source",
    engineFiltersNote: "Les menaces sur lesquelles le moteur Secret Guard détecte les secrets d’un texte avant son envoi.",
    engine: "Produit",
    engineAll: "Toutes les menaces",
    engineOnly: "Secret Guard",
    activeFilters: "Filtres actifs",
    removeFilter: "Retirer le filtre",
    columns: {
      threat: "Menace",
      visual: "Aperçu",
      attack: "Attaque type · conséquence",
      mitigation: "Parade de référence",
    },
    tableHeading: "Tableau des menaces",
    caption: "Menaces cyber de l’IA : attaque type, parade de référence, outils libres et état de l’art. Chaque nom de menace ouvre son détail.",
    count: "menaces affichées",
    countOne: "menace affichée",
    of: "sur",
    emptyTitle: "Aucune menace trouvée",
    emptyText: "Essayez un autre mot ou élargissez les filtres.",
    reset: "Réinitialiser les filtres",
    engineHeading: "Secret Guard",
    engineBody: "Le moteur open source détecte les secrets (clés, jetons, mots de passe) d’un texte avant son envoi. Il ne couvre pas le reste de cette menace.",
    engineLink: "Découvrir Secret Guard",
    usesHeading: "Usages exposés",
    toolsHeading: "Outils libres",
    statusHeading: "État de l’art",
    definition: "Définition",
    example: "Exemple illustratif",
    reflex: "Premier réflexe",
    reference: "Référence OWASP",
    scope: "Les exemples sont illustratifs. Les outils cités sont libres ou open source, à titre indicatif : ce glossaire décrit les menaces, il ne dit pas qu’un produit les couvre.",
    nextTitle: "Passer des risques à vos usages.",
    nextText: "Découvrez les prestations et les produits de la division IA de xSOM.",
    nextLink: "Retour à l’accueil IA",
    cabinet: "Le cabinet xSOM",
    display: "Affichage",
    skip: "Aller au tableau des menaces",
  },
  en: {
    title: "AI threat glossary",
    description: "The operational glossary of AI cyber threats: typical attack, reference mitigation, open-source tools and state of the art, filterable by use, attack surface and impact.",
    kicker: "UNDERSTAND THE RISKS",
    intro: "Find the AI threat that concerns you and discover the appropriate response: the typical attack, the reference mitigation and open-source tools.",
    home: "Home",
    search: "Search for a threat",
    placeholder: "E.g. injection, secrets, garak, RAG…",
    sort: "Sort by",
    sorts: { category: "Category", risk: "Unsolved first", name: "Name (A → Z)" },
    filterHint: "Start with your AI use. Everything else is optional.",
    filter: "Filter by AI use",
    all: "All uses",
    uses: { development: "Development teams", workplace: "Business teams", agents: "Agents", models: "Model & data teams" },
    moreFilters: "More filters",
    moreFiltersHint: "Category, surface, impact, state of the art, Secret Guard",
    threatFilters: "Nature of the threat",
    category: "Category",
    categoryAll: "All categories",
    categories: {
      prompt: "Prompts & instructions",
      agents: "Agents",
      rag: "RAG",
      model: "Model & training",
      adversarial: "Adversarial ML",
      output: "Output",
      privacy: "Privacy",
      supply: "Supply chain",
      infra: "Infrastructure",
      availability: "Availability & cost",
      integrity: "Integrity & trust",
      human: "Human abuse",
      governance: "Governance",
    },
    surface: "Attack surface",
    surfaceAll: "All surfaces",
    surfaces: {
      prompt: "Prompt",
      data: "Data & context",
      model: "Model & weights",
      actions: "Actions & tools",
      people: "People",
      infra: "Infra & dependencies",
    },
    impact: "Impact",
    impactAll: "All impacts",
    impacts: {
      leak: "Data leak",
      manipulation: "Manipulated output",
      action: "Unauthorised action",
      compromise: "System compromise",
      cost: "Outage & cost",
      fraud: "Fraud",
      oversight: "Loss of oversight",
    },
    status: "State of the art",
    statusAll: "All states",
    statuses: { unsolved: "Unsolved", mitigated: "Mitigated", mixed: "Context-dependent", solved: "Controlled" },
    engineFilters: "Secret Guard · open-source engine",
    engineFiltersNote: "The threats where the Secret Guard engine detects the secrets of a text before it is sent.",
    engine: "Product",
    engineAll: "All threats",
    engineOnly: "Secret Guard",
    activeFilters: "Active filters",
    removeFilter: "Remove filter",
    columns: {
      threat: "Threat",
      visual: "Preview",
      attack: "Typical attack · consequence",
      mitigation: "Reference mitigation",
    },
    tableHeading: "Threat table",
    caption: "AI cyber threats: typical attack, reference mitigation, open-source tools and state of the art. Each threat name opens its details.",
    count: "threats shown",
    countOne: "threat shown",
    of: "of",
    emptyTitle: "No threats found",
    emptyText: "Try another word or broaden the filters.",
    reset: "Reset filters",
    engineHeading: "Secret Guard",
    engineBody: "The open-source engine detects the secrets (keys, tokens, passwords) of a text before it is sent. It does not cover the rest of this threat.",
    engineLink: "Discover Secret Guard",
    usesHeading: "Exposed uses",
    toolsHeading: "Open-source tools",
    statusHeading: "State of the art",
    definition: "Definition",
    example: "Illustrative example",
    reflex: "First step",
    reference: "OWASP reference",
    scope: "Examples are illustrative. The tools listed are free or open source, for guidance only: this glossary describes threats, it does not say that a product covers them.",
    nextTitle: "Connect the risks to your AI use.",
    nextText: "Discover the services and products of xSOM’s AI division.",
    nextLink: "Back to the AI home",
    cabinet: "About xSOM",
    display: "Display",
    skip: "Skip to the threat table",
  },
} as const;
