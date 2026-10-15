"use client";
import Link from "next/link";
import { HomeFilm } from "@/components/home/HomeFilm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { AI_CONTACT, AI_COPY, AI_HERO_MEDIA } from "./ai-copy";

export function AiHome() {
  const { lang } = useT();
  const copy = AI_COPY[lang];
  const fr = lang === "fr";
  const teams = fr
    ? [
        [
          "workplace",
          "Équipes métier",
          "Données confidentielles, réponses erronées, actions d’agents.",
        ],
        [
          "development",
          "Équipes de développement",
          "Secrets, code généré et accès aux outils.",
        ],
        [
          "models",
          "Équipes modèles & données",
          "Sources de données, modèles et chaînes de traitement.",
        ],
      ]
    : [
        [
          "workplace",
          "Business teams",
          "Confidential data, incorrect answers and agent actions.",
        ],
        [
          "development",
          "Development teams",
          "Secrets, generated code and access to tools.",
        ],
        [
          "models",
          "Model & data teams",
          "Data sources, models and processing pipelines.",
        ],
      ];
  return (
    <div className="guard-landing xhome xai xweb">
      <SiteHeader site="ai" />
      <main id="main" tabIndex={-1}>
        <section id="intro" className="web-hero" aria-labelledby="ai-title">
          <div className="guard-wrap web-hero__inner">
            <div className="web-hero__copy">
              <p className="web-label">
                {fr ? "Conseil & produits IA" : "AI services & products"}
              </p>
              <h1 id="ai-title">{copy.intro.title}</h1>
              <p className="web-lead">{copy.intro.lead}</p>
              <div className="web-actions">
                <a className="web-button" href={AI_CONTACT}>
                  {copy.services.contact}
                </a>
                <a className="web-text-link" href="#produits">
                  {copy.intro.products}
                </a>
              </div>
            </div>
            <figure className="web-hero__art">
              {/* Brand artwork, not a product screenshot or a client installation. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/signal-media/architecture-xsom.webp"
                width="1536"
                height="1024"
                alt=""
                fetchPriority="high"
              />
              <figcaption className="web-hero__caption">
                {fr
                  ? "Infrastructure, données, sécurité. Une même vision du système."
                  : "Infrastructure, data, security. One view of the whole system."}
              </figcaption>
            </figure>
          </div>
        </section>
        <div className="web-proofline">
          <div className="guard-wrap web-proofline__inner">
            <strong>
              {fr
                ? "Une expertise xSOM Consulting"
                : "An xSOM Consulting practice"}
            </strong>
            <span>
              {fr
                ? "Cabinet indépendant depuis 2007"
                : "Independent consulting since 2007"}
            </span>
            <span>
              {fr
                ? "Du cadrage à la mise en production"
                : "From scoping to production"}
            </span>
          </div>
        </div>
        <section
          id="prestations"
          className="web-section"
          aria-labelledby="ai-services-title"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <div>
                <p className="web-label">
                  {fr ? "Nos prestations" : "Our services"}
                </p>
                <h2 id="ai-services-title">{copy.services.title}</h2>
              </div>
              <p className="web-lead">{copy.services.lead}</p>
            </header>
            {copy.services.items.map((item) => (
              <article key={item.name} className="web-service">
                <h3>{item.name}</h3>
                <div>
                  <p>{item.body}</p>
                  <ul>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <a
                  className="web-service__link"
                  href={copy.services.moreHref}
                  aria-label={`${fr ? "En savoir plus" : "Learn more"} : ${item.name}`}
                >
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
            <a className="web-text-link" href={copy.services.moreHref}>
              {copy.services.more}
            </a>
          </div>
        </section>
        <section
          id="produits"
          className="web-section web-section--white"
          aria-labelledby="ai-products-title"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <div>
                <p className="web-label">
                  {fr ? "Les produits xSOM" : "xSOM products"}
                </p>
                <h2 id="ai-products-title">{copy.products.title}</h2>
              </div>
              <p className="web-lead">{copy.products.lead}</p>
            </header>
            <div className="web-products">
              <article className="web-product web-product--feature">
                <p className="web-status">{copy.products.fleet.badge}</p>
                <h3>{copy.products.fleet.name}</h3>
                <p>{copy.products.fleet.body}</p>
                <ul className="web-product-modules">
                  {copy.products.fleet.modules.map(([name, body]) => (
                    <li key={name}>
                      <strong>{name}</strong>
                      <span>{body}</span>
                    </li>
                  ))}
                </ul>
                <SiteLink to={{ site: "fleet" }} className="web-button">
                  {copy.products.fleet.action}
                </SiteLink>
              </article>
              <article className="web-product">
                <p className="web-status">{copy.products.guard.badge}</p>
                <h3>{copy.products.guard.name}</h3>
                <p>{copy.products.guard.body}</p>
                <ul>
                  {copy.products.guard.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="web-actions">
                  <SiteLink to={{ site: "guard" }} className="web-button">
                    {copy.products.guard.action}
                  </SiteLink>
                  <a className="web-text-link" href={SECRET_GUARD_REPOSITORY}>
                    {copy.products.guard.source}
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section
          id="usages"
          className="web-section"
          aria-labelledby="usages-heading"
        >
          <div className="guard-wrap">
            <header className="web-section-head">
              <h2 id="usages-heading">
                {fr
                  ? "Comprendre les risques de vos usages."
                  : "Understand the risks in your use cases."}
              </h2>
              <p className="web-lead">{copy.glossary.body}</p>
            </header>
            {teams.map(([use, name, body]) => (
              <article className="web-service" key={use}>
                <h3>{name}</h3>
                <div>
                  <p>{body}</p>
                </div>
                <Link
                  className="web-service__link"
                  href={`/menaces?use=${use}#definitions`}
                  aria-label={`${fr ? "Explorer les risques" : "Explore risks"} : ${name}`}
                >
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
            <Link className="web-text-link" href="/menaces">
              {copy.glossary.action}
            </Link>
            <details className="web-film-details">
              <summary>
                {fr
                  ? "Voir le film de présentation"
                  : "Watch the introduction film"}
              </summary>
              <HomeFilm media={AI_HERO_MEDIA} next="#contact" />
            </details>
          </div>
        </section>
        <section id="contact" className="web-contact">
          <div className="guard-wrap web-contact__inner">
            <div>
              <h2>{copy.contact.title}</h2>
              <p>{copy.contact.body}</p>
            </div>
            <a className="web-button" href={AI_CONTACT}>
              {copy.contact.button}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter site="ai" />
    </div>
  );
}
