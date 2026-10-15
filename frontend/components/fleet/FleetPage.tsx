"use client";
import { HomeFilm } from "@/components/home/HomeFilm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import {
  FLEET_CONTACT,
  FLEET_COPY,
  FLEET_HERO_MEDIA,
  FLEET_MEASUREMENT,
  FLEET_PRICE_CONTACT,
  FLEET_SIMULATION_CONTACT,
  codexMeasureLine,
  fleetHowMedia,
} from "./fleet-copy";
import { FleetCapture } from "./FleetCapture";
import { FleetHowFilm } from "./FleetHowFilm";

export function FleetPage() {
  const { lang } = useT();
  const copy = FLEET_COPY[lang];
  const fr = lang === "fr";
  const cost = copy.why.cost;
  const flow = fr
    ? [
        [
          "Sur le Poste",
          "Le Contrôle avant envoi analyse le contenu localement.",
        ],
        [
          "Dans la console",
          "Les Sièges, la Facture réelle et les Événements sans contenu sont regroupés.",
        ],
        [
          "Pour l’audit",
          "Le Dossier de preuves documente les contrôles et leurs résultats.",
        ],
      ]
    : [
        ["On the workstation", "The pre-send check analyses content locally."],
        [
          "In the console",
          "Seats, actual invoices and content-free events are brought together.",
        ],
        [
          "For the audit",
          "The evidence dossier documents checks and their results.",
        ],
      ];
  return (
    <div className="guard-landing xhome xfl xweb">
      <SiteHeader site="fleet" />
      <main id="main" tabIndex={-1}>
        <section
          id="promesse"
          className="web-hero web-hero--fleet"
          aria-labelledby="fl-title"
        >
          <div className="guard-wrap web-hero__inner">
            <div className="web-hero__copy">
              <p className="web-status">{copy.hero.badge}</p>
              <h1 id="fl-title">{copy.hero.title.join(" ")}</h1>
              <p className="web-lead">{copy.hero.lead}</p>
              <div className="web-actions">
                <a className="web-button" href={FLEET_CONTACT}>
                  {copy.hero.contact}
                </a>
                <a className="web-text-link" href="#fonctionnement">
                  {copy.hero.how}
                </a>
              </div>
              <p className="web-note">
                {fr
                  ? "Un périmètre de pilote défini avec vos équipes, avant tout déploiement."
                  : "A pilot scope agreed with your teams before any rollout."}
              </p>
            </div>
            <div className="web-hero__art">
              <figure className="web-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="web-panel__image"
                  src="/signal-media/architecture-xsom.webp"
                  width="1536"
                  height="1024"
                  alt=""
                  fetchPriority="high"
                />
                <figcaption className="web-panel__title">
                  {fr
                    ? "Le contrôle au bon endroit."
                    : "Control where it belongs."}
                </figcaption>
                {flow.map(([title, body], i) => (
                  <div className="web-panel__row" key={title}>
                    <span className="web-panel__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </figure>
            </div>
          </div>
        </section>
        <div className="web-proofline">
          <div className="guard-wrap web-proofline__inner">
            <strong>
              {fr
                ? "Une plateforme xSOM Consulting"
                : "An xSOM Consulting platform"}
            </strong>
            <span>
              {fr
                ? "Contrôle local sur les Postes couverts"
                : "Local checks on covered workstations"}
            </span>
            <span>
              {fr ? "Événements sans contenu" : "Content-free events"}
            </span>
          </div>
        </div>
        <section
          id="modules"
          className="web-section"
          aria-labelledby="fl-platform-title"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <div>
                <p className="web-label">
                  {fr ? "Les trois modules" : "Three modules"}
                </p>
                <h2 id="fl-platform-title">
                  {copy.platform.punch} {copy.platform.rest}
                </h2>
              </div>
              <p className="web-lead">
                {fr
                  ? "Abonnements, contrôles et accès aux modèles : chaque module répond à un besoin précis de votre organisation."
                  : "Subscriptions, checks and model access: each module addresses a specific need in your organisation."}
              </p>
            </header>
            {copy.platform.modules.map((module) => (
              <article className="web-service" key={module.name}>
                <header className="web-service__name">
                  <p className="web-label">{module.name}</p>
                  <h3>{module.title}</h3>
                </header>
                <div>
                  <p>{module.line}</p>
                  <p className="web-note">{copy.platform.badge}</p>
                  {"engine" in module && module.engine ? (
                    <SiteLink className="web-text-link" to={{ site: "guard" }}>
                      {module.engine}
                    </SiteLink>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="fonctionnement"
          className="web-section web-section--white"
          aria-labelledby="fl-how-title"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <div>
                <p className="web-label">
                  {fr ? "Voir le produit" : "See the product"}
                </p>
                <h2 id="fl-how-title">{copy.how.title}</h2>
              </div>
              <p className="web-lead">
                {fr
                  ? "Parcourez la console de démonstration, du choix des assistants au Dossier de preuves. Les chapitres donnent accès à chaque étape."
                  : "Explore the demo console, from choosing assistants to the evidence dossier. Chapters take you to each step."}
              </p>
            </header>
            <FleetHowFilm
              key={lang}
              media={fleetHowMedia(lang)}
              chapters={copy.how.steps}
              labels={copy.how}
            />
            <details className="web-film-details">
              <summary>
                {fr
                  ? "La présentation en 20 secondes"
                  : "The 20-second introduction"}
              </summary>
              <HomeFilm media={FLEET_HERO_MEDIA} next="#pourquoi" />
            </details>
          </div>
        </section>
        <section
          id="pourquoi"
          className="web-section"
          aria-labelledby="fl-cost-title"
        >
          <div className="guard-wrap web-split">
            <div>
              <p className="web-label">
                {fr ? "Pilotage des coûts" : "Cost management"}
              </p>
              <h2 id="fl-cost-title">{copy.why.title}</h2>
              <p className="web-lead">{cost.line}</p>
              <p className="web-note">
                {fr
                  ? "L’Équivalent API estimé est un repère de comparaison. Il ne représente ni une facture à payer, ni une économie promise."
                  : "The estimated API equivalent is a comparison reference. It is neither an invoice to pay nor a promised saving."}
              </p>
              <div className="web-actions">
                <a className="web-button" href={FLEET_SIMULATION_CONTACT}>
                  {fr ? "Étudier vos usages" : "Review your usage"}
                </a>
              </div>
              <p className="web-note">{cost.actionNote}</p>
              <div className="web-prose">
                <h3>{copy.why.price.name}</h3>
                <p>{copy.why.price.line}</p>
                <a className="web-text-link" href={FLEET_PRICE_CONTACT}>
                  {copy.why.price.action}
                </a>
              </div>
            </div>
            <figure className="web-ledger">
              <figcaption className="web-panel__title">
                {fr
                  ? "Un relevé, pour comprendre."
                  : "A report that makes it tangible."}
              </figcaption>
              <p className="web-note">
                {fr
                  ? "Usage xSOM · septembre 2026 · un utilisateur"
                  : "xSOM usage · September 2026 · one user"}
              </p>
              <div className="web-ledger__row">
                <div>
                  Claude<span>{fr ? "Forfait mensuel" : "Monthly plan"}</span>
                </div>
                <strong>{cost.claudePlan}</strong>
              </div>
              <div className="web-ledger__row">
                <div>
                  Claude
                  <span>
                    {fr ? "Équivalent API estimé" : "Estimated API equivalent"}
                  </span>
                </div>
                <strong>{cost.claudeUsage}</strong>
              </div>
              <div className="web-ledger__row">
                <div>
                  Codex
                  <span>
                    {fr ? "Équivalent API estimé" : "Estimated API equivalent"}
                  </span>
                </div>
                <strong>{cost.codexUsage}</strong>
              </div>
              <p className="web-note">{codexMeasureLine(lang)}</p>
              <p className="web-note">{cost.measureNote}</p>
              <FleetCapture
                image={FLEET_MEASUREMENT.capture}
                alt={cost.captureAlt}
                open={cost.capture}
                close={cost.captureClose}
              />
            </figure>
          </div>
        </section>
        <section
          id="engagements"
          className="web-section web-section--white"
          aria-labelledby="fl-commitments-title"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <div>
                <p className="web-label">
                  {fr ? "Périmètre & preuves" : "Scope & evidence"}
                </p>
                <h2 id="fl-commitments-title">{copy.commitments.title}</h2>
              </div>
              <p className="web-lead">{copy.commitments.lead}</p>
            </header>
            <div className="web-domain">
              <h3>
                {fr
                  ? "Vos contenus restent chez vous."
                  : "Your content stays on your side."}
              </h3>
              <div>
                <p>
                  {fr
                    ? "Le Contrôle avant envoi s’exécute sur le Poste. La console reçoit des métriques d’usage et des Événements sans contenu. La passerelle est installée dans votre environnement."
                    : "The pre-send check runs on the workstation. The console receives usage metrics and content-free events. The gateway runs in your environment."}
                </p>
                <p className="web-note">{copy.commitments.evidence}</p>
              </div>
            </div>
            <div className="web-domain">
              <h3>
                {fr
                  ? "Un pilote au périmètre explicite."
                  : "A pilot with an explicit scope."}
              </h3>
              <div>
                <p>
                  {fr
                    ? "Claude Code et Codex sont les assistants visés sur les Postes. Fleet Gateway concerne les Applications API et les modèles hébergés chez vous. La disponibilité par système et par intégration se vérifie au cadrage du pilote."
                    : "Claude Code and Codex are the target workstation assistants. Fleet Gateway addresses API applications and models hosted in your environment. Availability by operating system and integration is checked when scoping the pilot."}
                </p>
                <p className="web-note">
                  {fr
                    ? "ChatGPT dans le navigateur, Copilot et les modèles exécutés directement sur le Poste ne font pas partie du périmètre annoncé."
                    : "ChatGPT in the browser, Copilot and models running directly on the workstation are outside the stated scope."}
                </p>
              </div>
            </div>
            <div className="web-domain">
              <h3>
                {fr ? "Des composants identifiés." : "Identified components."}
              </h3>
              <div>
                <p>
                  {fr
                    ? "Secret Guard est publié sous Apache-2.0. Le périmètre de la passerelle s’appuie sur la partie MIT de LiteLLM. Versions, licences, inventaire et modalités d’hébergement sont documentés dans le pilote."
                    : "Secret Guard is published under Apache-2.0. The gateway scope uses the MIT-licensed part of LiteLLM. Versions, licences, inventory and hosting arrangements are documented during the pilot."}
                </p>
                <a className="web-text-link" href={SECRET_GUARD_REPOSITORY}>
                  {copy.commitments.source}
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          id="questions"
          className="web-section"
          aria-labelledby="fl-faq-title"
        >
          <div className="guard-wrap web-faq">
            <h2 id="fl-faq-title">{copy.faq.title}</h2>
            <div>
              {copy.faq.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="web-contact">
          <div className="guard-wrap web-contact__inner">
            <div>
              <h2>
                {fr
                  ? "Évaluons Fleet sur vos usages."
                  : "Evaluate Fleet for your use cases."}
              </h2>
              <p>
                {fr
                  ? "Une démonstration, puis un périmètre de pilote construit avec vos équipes."
                  : "A demonstration, then a pilot scope built with your teams."}
              </p>
            </div>
            <a className="web-button" href={FLEET_CONTACT}>
              {copy.hero.contact}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter site="fleet" />
    </div>
  );
}
