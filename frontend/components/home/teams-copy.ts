/**
 * Les trois équipes de la section « Vos équipes face à l'IA » : ce qui les expose et le
 * rôle des contrôles. Texte d'orientation, illustratif : il n'annonce aucune couverture.
 */
export const TEAMS_COPY = {
  fr: {
    title: "Chaque usage de l’IA expose à des risques cyber différents.",
    imageAlt: "Bâtiment ouvert en trois espaces : équipe métier à gauche, développeurs au centre, équipe travaillant sur les modèles et les données d’entraînement à droite.",
    exploreTeamRisks: "Explorer les risques liés à mon équipe",
    everyday: "Ce qui expose votre équipe",
    controlsTitle: "Le rôle des contrôles",
    universes: {
      development: {
        name: "Équipes de développement", subtitle: "Coder & automatiser", marker: "02",
        daily: "Les assistants et agents de code lisent vos dépôts, reçoivent des prompts et exécutent des outils. Secrets divulgués, code vulnérable et actions non autorisées deviennent des risques directs.",
        risks: ["Clés, jetons ou mots de passe envoyés à l’IA.", "Code généré vulnérable ou dépendances non vérifiées.", "Actions d’un agent au-delà des droits nécessaires."],
        safeguards: ["Repérer les secrets avant l’envoi au modèle.", "Encadrer les outils et les permissions des agents.", "Tracer les décisions et faire valider les actions sensibles."],
      },
      people: {
        name: "Équipes métier", subtitle: "Rédiger & décider", marker: "01",
        daily: "Les équipes métier confient documents et données à des assistants IA. Une information envoyée au mauvais service, une consigne cachée ou une réponse trompeuse peut peser sur leurs décisions.",
        risks: ["Données clients, RH ou stratégiques copiées dans un assistant.", "Services IA utilisés en dehors du cadre de l’entreprise.", "Réponses inventées prises pour des faits."],
        safeguards: ["Identifier les données sensibles dans les flux intégrés.", "Définir les services autorisés et les règles de partage.", "Garder une supervision humaine sur les décisions."],
      },
      data: {
        name: "Équipes modèles & données", subtitle: "Concevoir & entraîner", marker: "03",
        daily: "Conception, entraînement et déploiement exposent jeux de données, poids et pipelines. Empoisonnement, modèle compromis ou vol de poids peuvent altérer le système dès sa conception.",
        risks: ["Jeux de données d’entraînement empoisonnés.", "Modèles ou composants compromis dans la chaîne de développement.", "Poids du modèle volés ou comportement extrait par requêtes."],
        safeguards: ["Vérifier la provenance des données et des modèles.", "Contrôler les formats, composants et pipelines d’entraînement.", "Limiter les accès aux poids et aux services du modèle."],
      },
    },
  },
  en: {
    title: "Every AI use case brings its own cyber risks.",
    imageAlt: "An open building with business teams on the left, software developers in the centre, and a team working on models and training data on the right.",
    exploreTeamRisks: "Explore risks for my team",
    everyday: "What exposes your team",
    controlsTitle: "The role of controls",
    universes: {
      development: {
        name: "Development teams", subtitle: "Code & automate", marker: "02",
        daily: "Coding assistants and agents read repositories, receive prompts and run tools. Exposed secrets, vulnerable code and unauthorised actions become direct risks for development teams.",
        risks: ["Keys, tokens or passwords sent to AI.", "Vulnerable generated code or unverified dependencies.", "Agent actions beyond the permissions they need."],
        safeguards: ["Identify secrets before sending a prompt to the model.", "Govern agents’ tools and permissions.", "Trace decisions and require approval for sensitive actions."],
      },
      people: {
        name: "Business teams", subtitle: "Write & decide", marker: "01",
        daily: "Business teams share documents and data with AI assistants. Information sent to the wrong service, hidden instructions or misleading answers can affect their decisions.",
        risks: ["Customer, HR or strategic data pasted into an assistant.", "AI services used outside the organisation’s framework.", "Fabricated answers mistaken for facts."],
        safeguards: ["Identify sensitive data in integrated traffic.", "Define authorised services and sharing rules.", "Keep human oversight over decisions."],
      },
      data: {
        name: "Model & data teams", subtitle: "Design & train", marker: "03",
        daily: "Design, training and deployment expose datasets, weights and pipelines. Poisoning, compromised models or stolen weights can affect the system from the outset.",
        risks: ["Poisoned training datasets.", "Compromised models or components in the development chain.", "Stolen model weights or behaviour extracted through queries."],
        safeguards: ["Verify the provenance of data and models.", "Check formats, components and training pipelines.", "Restrict access to weights and model services."],
      },
    },
  },
} as const;

export type TeamsCopy = (typeof TEAMS_COPY)[keyof typeof TEAMS_COPY];
export type GuardUniverse = keyof TeamsCopy["universes"];
export const GUARD_UNIVERSES: GuardUniverse[] = ["people", "development", "data"];
