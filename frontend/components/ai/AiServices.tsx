"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { SiteLink } from "@/components/site/SiteLink";
import { CONTACT_EMAIL } from "@/lib/site-copy";
import type { AI_COPY } from "./ai-copy";

type Copy = (typeof AI_COPY)["fr" | "en"];
type Services = Copy["services"];

/** L'ancre du formulaire : l'en-tête et l'appel final y mènent, et l'ouvrent. */
export const REQUEST_ANCHOR = "demande";

/**
 * « 02 Nos prestations », centré, dans la charte claire de www.xsom.fr : les trois
 * prestations de conseil IA, puis « Besoin d'une prestation personnalisée ? » et son
 * formulaire, qui se déplie sur demande et part par email (`/api/contact`).
 */
export function AiServices({ copy, lang }: { copy: Services; lang: "fr" | "en" }) {
  return (
    <section id="prestations" className="ai-light ai-light--white ai-services-x" aria-labelledby="ai-services-title">
      <div className="guard-wrap">
        <header className="ai-center-head">
          <p className="ai-eyebrow reveal"><span>{copy.number}</span>{copy.name}</p>
          <h2 id="ai-services-title" className="ai-h2 reveal" data-delay="1">
            {copy.title.before}<em>{copy.title.accent}</em>{copy.title.after}
          </h2>
          <p className="ai-center-head__lead reveal" data-delay="2">{copy.lead}</p>
        </header>
        <ul className="ai-services__list">
          {copy.items.map((item, index) => (
            <li key={item.name} className="ai-service reveal" data-delay={String(index + 2)} style={{ "--i": index } as CSSProperties}>
              <span className="ai-service__top">
                <span className="ai-service__n">{String(index + 1).padStart(2, "0")}</span>
                <span className="ai-service__icon" aria-hidden="true">{SERVICE_ICONS[index]}</span>
              </span>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="ai-services__more reveal" data-delay="4">
          <SiteLink to={{ href: copy.moreHref }} className="ai-link">{copy.more} <span aria-hidden="true">↗</span></SiteLink>
        </p>
        <ContactRequest copy={copy.request} lang={lang} />
      </div>
    </section>
  );
}

function Stroke({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

/** Infrastructures et cloud, données et MLOps, sécurité des pipelines. */
const SERVICE_ICONS = [
  <Stroke key="infra"><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" /></Stroke>,
  <Stroke key="data"><ellipse cx="12" cy="5.5" rx="7" ry="2.5" /><path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" /></Stroke>,
  <Stroke key="security"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z" /><rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11" /></Stroke>,
];

type Status = "idle" | "sending" | "sent" | "invalid" | "error";

/**
 * Le formulaire de demande, replié derrière « Contactez-nous ». Champs simples, un champ
 * piège invisible contre les robots, et un repli honnête : si l'envoi échoue (ou si le
 * service d'envoi n'est pas configuré), l'adresse de contact s'affiche.
 */
function ContactRequest({ copy, lang }: { copy: Services["request"]; lang: "fr" | "en" }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const root = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);

  // Un lien vers #demande (en-tête, appel final) ouvre le formulaire et y place le curseur.
  useEffect(() => {
    const reveal = () => {
      if (window.location.hash !== `#${REQUEST_ANCHOR}`) return;
      setOpen(true);
      window.requestAnimationFrame(() => {
        root.current?.scrollIntoView({ block: "center" });
        first.current?.focus({ preventScroll: true });
      });
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  useEffect(() => {
    if (open) first.current?.focus({ preventScroll: true });
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["name", "email", "company", "message", "website"].map((key) => [key, String(form.get(key) ?? "")]));
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, lang }),
    }).catch(() => null);
    if (response?.ok) setStatus("sent");
    else setStatus(response?.status === 400 ? "invalid" : "error");
  };

  return (
    <div id={REQUEST_ANCHOR} ref={root} className="ai-request reveal" data-delay="4" data-open={open}>
      <div className="ai-request__head">
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.body}</p>
        </div>
        <button type="button" className="ai-btn" aria-expanded={open} aria-controls="ai-request-form" onClick={() => setOpen((value) => !value)}>
          {open ? copy.close : copy.open} <span aria-hidden="true">{open ? "×" : "→"}</span>
        </button>
      </div>
      {open ? (
        <div className="ai-request__panel">
          {status === "sent" ? (
            <p className="ai-request__sent" role="status">{copy.sent}</p>
          ) : (
            <form id="ai-request-form" className="ai-request__form" onSubmit={submit}>
              <label>
                <span>{copy.name}</span>
                <input ref={first} name="name" autoComplete="name" required maxLength={120} />
              </label>
              <label>
                <span>{copy.email}</span>
                <input name="email" type="email" autoComplete="email" required maxLength={254} />
              </label>
              <label className="ai-request__wide">
                <span>{copy.company} <small>({copy.optional})</small></span>
                <input name="company" autoComplete="organization" maxLength={160} />
              </label>
              <label className="ai-request__wide">
                <span>{copy.message}</span>
                <textarea name="message" rows={4} required minLength={10} maxLength={4000} placeholder={copy.placeholder} />
              </label>
              {/* Le champ piège : hors de la vue et du clavier, un visiteur ne le remplit jamais. */}
              <label className="ai-request__trap" aria-hidden="true">
                Website <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <div className="ai-request__foot ai-request__wide">
                <p className="ai-request__privacy">
                  {copy.privacy} <SiteLink to={{ site: "ai", path: "/confidentialite" }} className="ai-link">{copy.privacyLink}</SiteLink>
                </p>
                <button type="submit" className="ai-btn" disabled={status === "sending"}>
                  {status === "sending" ? copy.sending : copy.submit}
                </button>
              </div>
              {status === "invalid" || status === "error" ? (
                <p className="ai-request__error ai-request__wide" role="alert">
                  {status === "invalid" ? copy.invalid : (
                    <>{copy.error} {copy.fallback} <a className="ai-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>
                  )}
                </p>
              ) : null}
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
