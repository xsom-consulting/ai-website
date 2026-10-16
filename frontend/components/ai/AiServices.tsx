"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SiteLink } from "@/components/site/SiteLink";
import { LinkedInMark } from "@/components/site/LinkedInMark";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site-copy";
import type { AI_COPY } from "./ai-copy";

type Copy = (typeof AI_COPY)["fr" | "en"];
type Services = Copy["services"];

/** L'ancre du formulaire : l'en-tête et l'appel final y mènent, et l'ouvrent. */
export const REQUEST_ANCHOR = "demande";

/**
 * La conclusion de la page, reprise de www.xsom.fr (« Un projet, une question ? ») :
 * plein écran, marine, le logo xSOM en filigrane, « Nous contacter » et « Nous suivre
 * sur LinkedIn ». « Nous contacter » déplie le formulaire, qui part par email
 * (`/api/contact`, Resend). C'est la cible de l'entrée « Prestations » du menu.
 */
export function AiServices({ copy, lang }: { copy: Services; lang: "fr" | "en" }) {
  return (
    <section id="prestations" className="ai-closing" aria-labelledby="ai-services-title">
      {/* eslint-disable-next-line @next/next/no-img-element -- filigrane décoratif, le logo d'origine */}
      <img className="ai-closing__mark" src="/xsom-mark.svg" alt="" width={600} height={600} aria-hidden="true" />
      <div className="guard-wrap">
        <ContactRequest section={copy} lang={lang} />
      </div>
    </section>
  );
}

type Status = "idle" | "sending" | "sent" | "invalid" | "error";

/**
 * Le formulaire de demande, replié derrière « Contactez-nous ». Champs simples, un champ
 * piège invisible contre les robots, et un repli honnête : si l'envoi échoue (ou si le
 * service d'envoi n'est pas configuré), l'adresse de contact s'affiche.
 */
function ContactRequest({ section, lang }: { section: Services; lang: "fr" | "en" }) {
  const copy = section.request;
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
    <div id={REQUEST_ANCHOR} ref={root} className="ai-request" data-open={open}>
      <header className="ai-closing__head">
        <p className="ai-eyebrow reveal"><span>{section.number}</span>{section.name}</p>
        <h2 id="ai-services-title" className="ai-closing__title reveal" data-delay="1">{section.title}</h2>
        <p className="ai-closing__lead reveal" data-delay="2">{section.lead}</p>
        <div className="ai-request__actions reveal" data-delay="3">
          <button type="button" className="ai-btn ai-btn--lg" aria-expanded={open} aria-controls="ai-request-form" onClick={() => setOpen((value) => !value)}>
            {open ? copy.close : copy.open} <span aria-hidden="true">{open ? "×" : "→"}</span>
          </button>
          <a className="ai-btn ai-btn--lg ai-btn--ghost" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <LinkedInMark />{section.linkedin} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
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
