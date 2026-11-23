"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n";
import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY, SIGNUP_URL } from "@/lib/sites";
import { SiteLink } from "@/components/site/SiteLink";
import { APARTE_COPY, type CatalogKey } from "./aparte-copy";

/** Le titre de section d'Aparté : centré, une phrase, puis une ligne d'explication. */
function Head({ id, title, lead }: { id: string; title: React.ReactNode; lead?: string }) {
  return (
    <div className="ap-head">
      <h2 id={id}>{title}</h2>
      {lead && <p className="ap-lede">{lead}</p>}
    </div>
  );
}

/** L'expurgation en quatre temps, puis ce que voit l'IA et ce qui reste sur la machine. */
export function SgExpurgation() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].expurgation;
  const tone = ["real", "tok", "tok", "ok"] as const;
  return (
    <section id="expurgation" className="ap-block" aria-labelledby="ap-exp-title">
      <div className="ap-wrap">
        <Head id="ap-exp-title" title={copy.title} lead={copy.lead} />
        <ol className="ap-exp">
          {copy.steps.map((step, i) => (
            <li key={step.title} data-tone={tone[i]}>
              <span className="ap-exp__n">{String(i + 1).padStart(2, "0")} · {step.who}</span>
              <b>{step.title}</b>
              <code>{step.code}</code>
            </li>
          ))}
        </ol>
        <div className="ap-split">
          <div><b>{copy.seen.title}</b><ul>{copy.seen.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div data-kept><b>{copy.kept.title}</b><ul>{copy.kept.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </div>
        <p className="ap-where">{copy.where}</p>
      </div>
    </section>
  );
}

/** Les chiffres mesurés du moteur, datés, avec leur source. */
export function SgProof() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].proof;
  return (
    <section id="mesures" className="ap-block" aria-labelledby="ap-proof-title">
      <div className="ap-wrap">
        <Head id="ap-proof-title" title={copy.title} lead={copy.lead} />
        <ul className="ap-stats">
          {copy.stats.map(([value, label]) => <li key={label}><b>{value}</b><span>{label}</span></li>)}
        </ul>
        <p className="ap-where">{copy.note}</p>
      </div>
    </section>
  );
}

const PREVIEW = 8;

/** Ce qu'Aparté protège : une recherche, des catégories, huit éléments puis « tout voir ». */
export function SgCatalog() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].catalog;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatalogKey | "">("");
  const [all, setAll] = useState(false);
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const list = useMemo(() => {
    const t = norm(q.trim());
    return (Object.keys(copy.items) as CatalogKey[])
      .flatMap((c) => copy.items[c].map((item) => ({ ...item, cat: c })))
      .filter((it) => (!cat || it.cat === cat) && (!t || norm(`${it.name} ${it.hint} ${copy.cats[it.cat]}`).includes(t)));
  }, [q, cat, copy]);
  const shown = all || q ? list : list.slice(0, PREVIEW);
  return (
    <section id="protege" className="ap-block" aria-labelledby="ap-cat-title">
      <div className="ap-wrap">
        <Head id="ap-cat-title" title={copy.title} lead={copy.kicker} />
        <div className="ap-cat">
          <div className="ap-cat__search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.placeholder} aria-label={copy.search} autoComplete="off" />
          </div>
          <div className="ap-cat__tabs" role="group">
            <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>{copy.all}</button>
            {(Object.keys(copy.cats) as CatalogKey[]).map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{copy.cats[c]}</button>)}
          </div>
          <p className="ap-cat__count" aria-live="polite">{copy.count(list.length)}</p>
          <ul className="ap-cat__list">
            {shown.length ? shown.map((it) => (
              <li key={`${it.cat}-${it.name}`} data-cat={it.cat}>
                <span><b>{it.name}</b><small>{it.hint}</small></span>
                <em data-soon={it.soon ? "" : undefined}>{it.soon ? copy.soon : copy.cats[it.cat]}</em>
              </li>
            )) : <li className="ap-cat__none">{copy.none} <a href={MAIN_SITE_ORIGIN}>{copy.ask}</a></li>}
          </ul>
          {!q && list.length > PREVIEW && (
            <p className="ap-cat__more"><button type="button" onClick={() => setAll(!all)}>{all ? copy.less : copy.more(list.length)}</button></p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Ce que l'indépendant montre à son client : un journal sans contenu (exemple). */
export function SgClients() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].clients;
  return (
    <section id="clients" className="ap-block" aria-labelledby="ap-clients-title">
      <div className="ap-wrap ap-clients">
        <div>
          <h2 id="ap-clients-title">{copy.title[0]}<span>{copy.title[1]}</span>{copy.title[2]}</h2>
          <p className="ap-lede">{copy.lead}</p>
        </div>
        <div className="ap-stagebox">
          <div className="ap-report">
            <p className="ap-report__top"><b>{copy.report}</b><span>{copy.month}</span></p>
            {copy.rows.map(([label, value]) => <p key={label} className="ap-report__row"><span>{label}</span><b>{value}</b></p>)}
            <p className="ap-report__foot">{copy.foot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Le bandeau final : 0 €, le téléchargement, et les quatre raisons de nous faire confiance. */
export function SgEnd() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].end;
  const hero = APARTE_COPY[lang].hero;
  const { facts } = copy;
  return (
    <div className="ap-wrap">
      <section className="ap-end" aria-labelledby="ap-end-title">
        <div>
          <span className="ap-bigp">{copy.big}</span>
          <h2 id="ap-end-title">{copy.title}</h2>
          <p>{copy.body}</p>
          <a className="ap-btn ap-btn--light ap-btn--big" href={SIGNUP_URL}>{hero.download} <span className="ap-price">{copy.big}</span></a>
        </div>
        <div className="ap-facts">
          <a href={MAIN_SITE_ORIGIN}><span className="ap-em" aria-hidden="true">🛡️</span><span><b>{facts.xsom[0]}</b>{facts.xsom[1]}</span></a>
          <div><span className="ap-em" aria-hidden="true">🇫🇷</span><span><b>{facts.france[0]}</b>{facts.france[1]}</span></div>
          <a href={SECRET_GUARD_REPOSITORY}><span className="ap-em" aria-hidden="true">🔓</span><span><b>{facts.engine[0]}</b>{facts.engine[1]}</span></a>
          <SiteLink to={{ site: "fleet" }}><span className="ap-em" aria-hidden="true">🏢</span><span><b>{facts.fleet[0]}</b>{facts.fleet[1]}</span></SiteLink>
        </div>
      </section>
    </div>
  );
}

/** Les questions franches. */
export function SgFaq() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].faq;
  return (
    <section id="questions" className="ap-block" aria-labelledby="ap-faq-title">
      <div className="ap-wrap">
        <Head id="ap-faq-title" title={copy.kicker} />
        <div className="ap-faq">
          {copy.items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}
