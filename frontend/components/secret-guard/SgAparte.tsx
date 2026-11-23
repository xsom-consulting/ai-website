"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import { APARTE_COPY, type CatalogKey } from "./aparte-copy";

const chars = (text: string) => ({ "--chars": text.length }) as CSSProperties;

/** L'expurgation en quatre temps, puis ce que voit l'IA et ce qui reste sur la machine. */
export function SgExpurgation() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].expurgation;
  return (
    <section id="expurgation" className="sg-panel sg-panel--tint" aria-labelledby="sg-exp-title">
      <div className="guard-wrap">
        <header className="sg-head">
          <p className="home-kicker" data-reveal>{copy.kicker}</p>
          <h2 id="sg-exp-title" className="home-title" data-reveal style={chars(copy.title)}>{copy.title}</h2>
          <p className="sg-head__lead" data-reveal>{copy.lead}</p>
        </header>
        <ol className="sg-steps ap-exp">
          {copy.steps.map((step, i) => (
            <li key={step.title} data-reveal data-step={i}>
              <p className="ap-exp__who">{String(i + 1).padStart(2, "0")} · {step.who}</p>
              <h3>{step.title}</h3>
              <code>{step.code}</code>
            </li>
          ))}
        </ol>
        <div className="ap-split" data-reveal>
          <div><h3>{copy.seen.title}</h3><ul>{copy.seen.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div data-kept><h3>{copy.kept.title}</h3><ul>{copy.kept.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </div>
        <p className="sg-version" data-reveal>{copy.where}</p>
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
    <section id="protege" className="sg-panel" aria-labelledby="sg-cat-title">
      <div className="guard-wrap">
        <header className="sg-head">
          <p className="home-kicker" data-reveal>{copy.kicker}</p>
          <h2 id="sg-cat-title" className="home-title" data-reveal style={chars(copy.title)}>{copy.title}</h2>
        </header>
        <div className="ap-cat" data-reveal>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.placeholder} aria-label={copy.search} autoComplete="off" />
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
            )) : <li className="ap-cat__none">{copy.none} <a href="https://www.xsom.fr">{copy.ask}</a></li>}
          </ul>
          {!q && list.length > PREVIEW && (
            <button type="button" className="ap-cat__more" onClick={() => setAll(!all)}>{all ? copy.less : copy.more(list.length)}</button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Les questions franches. */
export function SgFaq() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].faq;
  return (
    <section id="questions" className="sg-panel" aria-labelledby="sg-faq-title">
      <div className="guard-wrap">
        <header className="sg-head">
          <p className="home-kicker" data-reveal>{copy.kicker}</p>
          <h2 id="sg-faq-title" className="home-title" data-reveal style={chars(copy.title)}>{copy.title}</h2>
        </header>
        <div className="ap-faq" data-reveal>
          {copy.items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}
