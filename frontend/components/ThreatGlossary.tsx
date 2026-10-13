"use client";

import Link from "next/link";
import { Fragment, useEffect, useState, type ReactNode } from "react";

import { Diagramme, DiagrammeDefs } from "@/components/Diagramme";
import { Brand } from "@/components/site/Brand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteLink } from "@/components/site/SiteLink";
import { SiteNav } from "@/components/site/SiteNav";
import { figureDeFiche } from "@/lib/glossary-figures";
import { visualForThreat } from "@/lib/threat-visuals";
import { useT } from "@/lib/i18n";
import type { Lang } from "@/lib/lang-types";
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_COPY,
  GLOSSARY_IMPACTS,
  GLOSSARY_STATUSES,
  GLOSSARY_SURFACES,
  GLOSSARY_USES,
  OWASP,
  THREAT_GLOSSARY,
  type GlossaryCategory,
  type GlossaryEntry,
  type GlossaryImpact,
  type GlossaryStatus,
  type GlossarySurface,
  type GlossaryTool,
  type GlossaryUse,
} from "@/lib/threat-glossary";

type Copy = (typeof GLOSSARY_COPY)[Lang];

type Filters = {
  use: GlossaryUse | "all";
  category: GlossaryCategory | "all";
  surface: GlossarySurface | "all";
  impact: GlossaryImpact | "all";
  status: GlossaryStatus | "all";
  engine: "secret-guard" | "all";
};
type Facet = keyof Filters;

const NO_FILTERS: Filters = {
  use: "all",
  category: "all",
  surface: "all",
  impact: "all",
  status: "all",
  engine: "all",
};

/** Les facettes repliées sous « Plus de filtres » : secondaires, elles n'encombrent pas le premier regard. */
const ADVANCED_FACETS = ["category", "surface", "impact", "status", "engine"] as const;

const SORTS = ["category", "risk", "name"] as const;
type Sort = (typeof SORTS)[number];
type SearchState = "idle" | "searching" | "ready" | "unavailable";
type VisualPreview = { src: string; title: string };

const COLUMNS = ["threat", "visual", "attack", "mitigation"] as const;

function normalise(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function toolLabel(tool: GlossaryTool, lang: Lang) {
  return typeof tool === "string" ? tool : tool[lang];
}

function matchesFacets(entry: GlossaryEntry, filters: Filters) {
  return (
    (filters.use === "all" || entry.uses.includes(filters.use)) &&
    (filters.category === "all" || entry.category === filters.category) &&
    (filters.surface === "all" || entry.surface === filters.surface) &&
    (filters.impact === "all" || entry.impact === filters.impact) &&
    (filters.status === "all" || entry.status === filters.status) &&
    (filters.engine === "all" || entry.secretGuard === true)
  );
}

/** Tout ce que le lecteur voit d'une ligne, détail compris, dans sa langue. */
function searchText(entry: GlossaryEntry, lang: Lang, copy: Copy) {
  const text = entry.copy[lang];
  const explainer = entry.explainer?.[lang];
  return normalise([
    text.title,
    text.attack,
    text.mitigation,
    text.statusNote ?? "",
    ...(explainer ? [explainer.definition, explainer.example, explainer.reflex] : []),
    ...entry.tools.map((tool) => toolLabel(tool, lang)),
    entry.owasp ? `${entry.owasp} ${OWASP[entry.owasp].title}` : "",
    copy.categories[entry.category],
    copy.surfaces[entry.surface],
    copy.impacts[entry.impact],
    copy.statuses[entry.status],
    entry.secretGuard ? copy.engineOnly : "",
    ...entry.uses.map((id) => copy.uses[id]),
  ].join(" "));
}

/** `Array.prototype.sort` est stable : à égalité, l'ordre éditorial du fichier tient. */
function sortEntries(entries: GlossaryEntry[], sort: Sort, lang: Lang) {
  const sorted = [...entries];
  if (sort === "risk") sorted.sort((a, b) => GLOSSARY_STATUSES.indexOf(a.status) - GLOSSARY_STATUSES.indexOf(b.status));
  if (sort === "name") sorted.sort((a, b) => a.copy[lang].title.localeCompare(b.copy[lang].title, lang));
  return sorted;
}

export function ThreatGlossary() {
  const { lang } = useT();
  const copy = GLOSSARY_COPY[lang];
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sort, setSort] = useState<Sort>("category");
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const [semanticIds, setSemanticIds] = useState<string[] | null>(null);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [preview, setPreview] = useState<VisualPreview | null>(null);
  const [urlReady, setUrlReady] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Un lien profond `/menaces#<id>` ouvre la ligne qu'il vise : le navigateur y
  // défile déjà, il reste à montrer son détail.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...NO_FILTERS };
    const usage = GLOSSARY_USES.find((id) => id === params.get("use"));
    if (usage) next.use = usage;
    if (params.get("engine") === "secret-guard") next.engine = "secret-guard";
    setFilters(next);
    // Un lien partagé qui porte un filtre replié doit le montrer, pas le cacher.
    setMoreOpen(ADVANCED_FACETS.some((facet) => next[facet] !== "all"));
    setUrlReady(true);
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (THREAT_GLOSSARY.some((entry) => entry.id === id)) setOpen(new Set([id]));
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    for (const key of ["use", "engine"] as const) {
      const value = filters[key];
      if (value === "all") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [filters, urlReady]);

  const words = normalise(query).trim().split(/\s+/).filter(Boolean);
  const lexicalMatches = THREAT_GLOSSARY.filter((entry) => {
    const text = searchText(entry, lang, copy);
    return words.every((word) => text.includes(word));
  });
  const searched = semanticIds
    ? semanticIds
        .map((id) => THREAT_GLOSSARY.find((entry) => entry.id === id))
        .filter((entry): entry is GlossaryEntry => entry !== undefined)
    : lexicalMatches;
  const entries = searched.filter((entry) => matchesFacets(entry, filters));
  const grouped = sort === "category";
  const groups = grouped
    ? GLOSSARY_CATEGORIES.map((id) => ({ id, entries: entries.filter((entry) => entry.category === id) }))
        .filter((group) => group.entries.length > 0)
    : [{ id: "all" as const, entries: sortEntries(entries, sort, lang) }];
  const filtered = query !== "" || Object.values(filters).some((value) => value !== "all");

  useEffect(() => {
    const request = query.trim();
    if (request.length < 3) {
      setSemanticIds(null);
      setSearchState("idle");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchState("searching");
      try {
        const response = await fetch("/api/threat-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: request, lang }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Semantic search unavailable");
        const result: unknown = await response.json();
        if (!result || typeof result !== "object" || !Array.isArray((result as { ids?: unknown }).ids)) {
          throw new Error("Invalid semantic search response");
        }
        setSemanticIds((result as { ids: string[] }).ids);
        setSearchState("ready");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setSemanticIds(null);
        setSearchState("unavailable");
      }
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, lang]);

  useEffect(() => {
    if (!preview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [preview]);

  /** Combien de lignes resteraient si cette facette prenait cette valeur, les autres filtres tenant. */
  function countWith(facet: Facet, value: string) {
    const next = { ...filters, [facet]: value } as Filters;
    return searched.filter((entry) => matchesFacets(entry, next)).length;
  }

  function setFacet(facet: Facet, value: string) {
    setFilters((current) => ({ ...current, [facet]: value }));
  }

  function resetFilters() {
    setQuery("");
    setSemanticIds(null);
    setSearchState("idle");
    setFilters(NO_FILTERS);
  }

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  const activeFacets = (Object.keys(filters) as Facet[]).filter((facet) => filters[facet] !== "all");
  const advancedActive = ADVANCED_FACETS.filter((facet) => filters[facet] !== "all").length;

  function facetValueLabel(facet: Facet, value: string) {
    switch (facet) {
      case "use": return copy.uses[value as GlossaryUse];
      case "category": return copy.categories[value as GlossaryCategory];
      case "surface": return copy.surfaces[value as GlossarySurface];
      case "impact": return copy.impacts[value as GlossaryImpact];
      case "status": return copy.statuses[value as GlossaryStatus];
      case "engine": return copy.engineOnly;
      default: return value;
    }
  }

  return (
    <div className="guard-landing guard-glossary">
      <a className="guard-glossary__skip" href="#definitions">{copy.skip}</a>
      <header className="guard-header">
        <div className="guard-wrap guard-header__inner">
          <Brand site="ai" />
          <SiteNav site="ai" />
        </div>
      </header>

      <main>
        <section className="guard-wrap guard-glossary__hero reveal" aria-labelledby="glossary-heading">
          <Link href="/" className="guard-glossary__back"><span aria-hidden="true">←</span> {copy.home}</Link>
          <p className="guard-kicker">{copy.kicker}</p>
          <h1 id="glossary-heading">{copy.title}</h1>
          <p className="guard-glossary__intro">{copy.intro}</p>
        </section>

        <section id="definitions" className="guard-wrap guard-glossary__content" aria-labelledby="glossary-table-heading" tabIndex={-1}>
          <h2 id="glossary-table-heading" className="guard-glossary__sr">{copy.tableHeading}</h2>
          <DiagrammeDefs />
          <div className="guard-glossary__toolbar reveal" data-delay="1">
            <div className="guard-glossary__search">
              <label htmlFor="threat-search">{copy.search}</label>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5" /></svg>
                <input
                  id="threat-search"
                  type="search"
                  autoComplete="off"
                  placeholder={copy.placeholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-controls="threat-definitions"
                />
              </div>
              {searchState === "searching" && <p className="guard-glossary__search-status" role="status">{lang === "fr" ? "Recherche IA en cours…" : "AI search in progress…"}</p>}
              {searchState === "ready" && <p className="guard-glossary__search-status" role="status">{lang === "fr" ? "Menaces pertinentes sélectionnées par IA." : "Relevant threats selected by AI."}</p>}
              {searchState === "unavailable" && <p className="guard-glossary__search-status" role="status">{lang === "fr" ? "Recherche textuelle affichée ; la recherche IA est indisponible." : "Text search is shown; AI search is unavailable."}</p>}
            </div>

            <p className="guard-glossary__hint">{copy.filterHint}</p>

            <div className="guard-glossary__facet">
              <p id="threat-use-label" className="guard-glossary__facet-label">
                <span className="guard-glossary__step" aria-hidden="true">1</span>
                {copy.filter}
              </p>
              <div className="guard-glossary__filters" role="group" aria-labelledby="threat-use-label">
                {(["all", ...GLOSSARY_USES] as const).map((id) => (
                  <FilterChip key={id} pressed={filters.use === id} count={countWith("use", id)} onClick={() => setFacet("use", id)}>
                    {id === "all" ? copy.all : copy.uses[id]}
                  </FilterChip>
                ))}
              </div>
            </div>

            <details className="guard-glossary__more" open={moreOpen} onToggle={(event) => setMoreOpen(event.currentTarget.open)}>
              <summary>
                <span className="guard-glossary__step" aria-hidden="true">2</span>
                <span className="guard-glossary__more-title">
                  {copy.moreFilters}
                  {advancedActive > 0 && <span className="guard-glossary__badge">{advancedActive}</span>}
                </span>
                <span className="guard-glossary__more-hint">{copy.moreFiltersHint}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
              </summary>
              <div className="guard-glossary__more-body">
                <fieldset className="guard-glossary__group-fields">
                  <legend>{copy.threatFilters}</legend>
                  <div className="guard-glossary__selects">
                    <FacetSelect id="threat-category" label={copy.category} all={copy.categoryAll} options={GLOSSARY_CATEGORIES} labels={copy.categories} value={filters.category} count={(value) => countWith("category", value)} onChange={(value) => setFacet("category", value)} />
                    <FacetSelect id="threat-surface" label={copy.surface} all={copy.surfaceAll} options={GLOSSARY_SURFACES} labels={copy.surfaces} value={filters.surface} count={(value) => countWith("surface", value)} onChange={(value) => setFacet("surface", value)} />
                    <FacetSelect id="threat-impact" label={copy.impact} all={copy.impactAll} options={GLOSSARY_IMPACTS} labels={copy.impacts} value={filters.impact} count={(value) => countWith("impact", value)} onChange={(value) => setFacet("impact", value)} />
                    <FacetSelect id="threat-status" label={copy.status} all={copy.statusAll} options={GLOSSARY_STATUSES} labels={copy.statuses} value={filters.status} count={(value) => countWith("status", value)} onChange={(value) => setFacet("status", value)} />
                  </div>
                </fieldset>
                <fieldset className="guard-glossary__group-fields" aria-describedby="threat-engine-note">
                  <legend>{copy.engineFilters}</legend>
                  <p id="threat-engine-note" className="guard-glossary__legend">{copy.engineFiltersNote}</p>
                  <div className="guard-glossary__selects">
                    <SelectField id="threat-engine" label={copy.engine} value={filters.engine} onChange={(value) => setFacet("engine", value)}>
                      <option value="all">{copy.engineAll} ({countWith("engine", "all")})</option>
                      <option value="secret-guard">{copy.engineOnly} ({countWith("engine", "secret-guard")})</option>
                    </SelectField>
                  </div>
                </fieldset>
              </div>
            </details>
          </div>

          <div className="guard-glossary__results-heading">
            <div className="guard-glossary__results-summary">
              <p role="status" aria-atomic="true">
                <strong>{entries.length}</strong> {entries.length === 1 ? copy.countOne : copy.count} {copy.of} {THREAT_GLOSSARY.length}
              </p>
              {activeFacets.length > 0 && (
                <ul className="guard-glossary__active" aria-label={copy.activeFilters}>
                  {activeFacets.map((facet) => {
                    const label = facetValueLabel(facet, filters[facet]);
                    return (
                      <li key={facet}>
                        <button type="button" onClick={() => setFacet(facet, "all")} aria-label={`${copy.removeFilter} : ${label}`} aria-controls="threat-definitions">
                          {label}
                          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" /></svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {filtered && <button type="button" className="guard-glossary__reset" onClick={resetFilters}>{copy.reset}</button>}
            </div>
            <SelectField id="threat-sort" label={copy.sort} value={sort} inline onChange={(value) => setSort(value as Sort)}>
              {SORTS.map((id) => <option key={id} value={id}>{copy.sorts[id]}</option>)}
            </SelectField>
          </div>

          <div id="threat-definitions">
            {entries.length ? (
              <table className="guard-glossary__table">
                <caption className="guard-glossary__sr">{copy.caption}</caption>
                <colgroup>
                  {COLUMNS.map((id) => <col key={id} className={`guard-glossary__col--${id}`} />)}
                </colgroup>
                <thead>
                  <tr>
                    {COLUMNS.map((id) => <th key={id} scope="col">{copy.columns[id]}</th>)}
                  </tr>
                </thead>
                {groups.map((group) => (
                  <tbody key={group.id}>
                    {group.id !== "all" && (
                      <tr className="guard-glossary__group">
                        <th scope="colgroup" colSpan={COLUMNS.length}>
                          {copy.categories[group.id]} <span>{group.entries.length}</span>
                        </th>
                      </tr>
                    )}
                    {group.entries.map((entry) => (
                      <ThreatRows
                        key={entry.id}
                        entry={entry}
                        lang={lang}
                        copy={copy}
                        showCategory={!grouped}
                        open={open.has(entry.id)}
                        onToggle={toggle}
                        onPreview={setPreview}
                      />
                    ))}
                  </tbody>
                ))}
              </table>
            ) : (
              <div className="guard-glossary__empty">
                <h2>{copy.emptyTitle}</h2>
                <p>{copy.emptyText}</p>
                <button className="guard-button guard-button--small" type="button" onClick={resetFilters}>{copy.reset}</button>
              </div>
            )}
          </div>

          <p className="guard-glossary__scope">{copy.scope}</p>
          <aside className="guard-glossary__next" aria-labelledby="glossary-next-heading">
            <div>
              <h2 id="glossary-next-heading">{copy.nextTitle}</h2>
              <p>{copy.nextText}</p>
            </div>
            <Link href="/" className="guard-button">{copy.nextLink}<span aria-hidden="true">↗</span></Link>
          </aside>
        </section>
      </main>

      {preview && (
        <div className="guard-glossary__modal-backdrop" role="presentation" onMouseDown={() => setPreview(null)}>
          <section className="guard-glossary__modal" role="dialog" aria-modal="true" aria-labelledby="threat-visual-title" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <h2 id="threat-visual-title">{preview.title}</h2>
              <button type="button" onClick={() => setPreview(null)} autoFocus aria-label={lang === "fr" ? "Fermer l’aperçu" : "Close preview"}>×</button>
            </header>
            <img src={preview.src} alt={preview.title} width="960" height="960" />
          </section>
        </div>
      )}

      <SiteFooter site="ai" />
    </div>
  );
}

function FilterChip({
  pressed,
  count,
  onClick,
  children,
}: {
  pressed: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" aria-pressed={pressed} aria-controls="threat-definitions" onClick={onClick}>
      <span className="guard-glossary__chip-label">
        {children}
        <span className="guard-glossary__count" aria-hidden="true">{count}</span>
      </span>
    </button>
  );
}

function SelectField({
  id,
  label,
  value,
  inline = false,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  inline?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="guard-glossary__select" data-inline={inline ? "" : undefined}>
      <label htmlFor={id}>{label}</label>
      <div>
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-controls="threat-definitions">
          {children}
        </select>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
      </div>
    </div>
  );
}

/** Une facette en liste déroulante ; une valeur qui viderait le tableau est grisée. */
function FacetSelect<T extends string>({
  id,
  label,
  all,
  options,
  labels,
  value,
  count,
  onChange,
}: {
  id: string;
  label: string;
  all: string;
  options: readonly T[];
  labels: Readonly<Record<T, string>>;
  value: T | "all";
  count: (value: T | "all") => number;
  onChange: (value: T | "all") => void;
}) {
  return (
    <SelectField id={id} label={label} value={value} onChange={(next) => onChange(next as T | "all")}>
      <option value="all">{all} ({count("all")})</option>
      {options.map((option) => {
        const n = count(option);
        return (
          <option key={option} value={option} disabled={n === 0 && option !== value}>
            {labels[option]} ({n})
          </option>
        );
      })}
    </SelectField>
  );
}

function ThreatRows({
  entry,
  lang,
  copy,
  showCategory,
  open,
  onToggle,
  onPreview,
}: {
  entry: GlossaryEntry;
  lang: Lang;
  copy: Copy;
  showCategory: boolean;
  open: boolean;
  onToggle: (id: string) => void;
  onPreview: (preview: VisualPreview) => void;
}) {
  const text = entry.copy[lang];
  const detailsId = `${entry.id}-details`;
  const visual = visualForThreat(entry.id, lang);
  return (
    <Fragment>
      <tr id={entry.id} className="guard-glossary__row" data-open={open ? "" : undefined}>
        <th scope="row" className="guard-glossary__threat">
          {showCategory && <span className="guard-glossary__kicker">{copy.categories[entry.category]}</span>}
          <button type="button" aria-expanded={open} aria-controls={detailsId} onClick={() => onToggle(entry.id)}>
            <span>{text.title}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
          </button>
          {entry.owasp && <span className="guard-glossary__code">{entry.owasp}:2025</span>}
        </th>
        <td data-cell="visual" data-label={copy.columns.visual}>
          {visual ? (
            <button className="guard-glossary__visual" type="button" onClick={() => onPreview({ src: visual, title: text.title })} aria-label={`${copy.columns.visual} : ${text.title}`}>
              <img src={visual} alt="" width="960" height="960" loading="lazy" decoding="async" />
              <span>{copy.columns.visual}</span>
            </button>
          ) : <span aria-label={lang === "fr" ? "Aperçu non disponible" : "Preview unavailable"}>—</span>}
        </td>
        <td data-cell="attack" data-label={copy.columns.attack}>{text.attack}</td>
        <td data-cell="mitigation" data-label={copy.columns.mitigation}>{text.mitigation}</td>
      </tr>
      <tr id={detailsId} className="guard-glossary__details" hidden={!open}>
        <td colSpan={COLUMNS.length}>{open && <ThreatDetails entry={entry} lang={lang} copy={copy} />}</td>
      </tr>
    </Fragment>
  );
}

function ThreatDetails({ entry, lang, copy }: { entry: GlossaryEntry; lang: Lang; copy: Copy }) {
  const text = entry.copy[lang];
  const explainer = entry.explainer?.[lang];
  const figure = figureDeFiche(entry.id);
  const owasp = entry.owasp ? OWASP[entry.owasp] : undefined;
  return (
    <div className="guard-glossary__detail">
      {explainer && (
        <div className="guard-glossary__detail-column">
          <div>
            <h3>{copy.definition}</h3>
            <p className="guard-glossary__definition">{explainer.definition}</p>
          </div>
          <div className="guard-glossary__example">
            <h3>{copy.example}</h3>
            <p>{explainer.example}</p>
          </div>
          <div>
            <h3>{copy.reflex}</h3>
            <p>{explainer.reflex}</p>
          </div>
        </div>
      )}
      <div className="guard-glossary__detail-column">
        {entry.secretGuard && (
          <div className="guard-glossary__guard" data-engine="secret-guard">
            <h3>{copy.engineHeading}</h3>
            <p>{copy.engineBody}</p>
            <SiteLink to={{ site: "guard" }}>{copy.engineLink} <span aria-hidden="true">↗</span></SiteLink>
          </div>
        )}
        <dl className="guard-glossary__facets">
          <div>
            <dt>{copy.usesHeading}</dt>
            <dd className="guard-glossary__tags">{entry.uses.map((id) => <span key={id}>{copy.uses[id]}</span>)}</dd>
          </div>
          <div>
            <dt>{copy.surface}</dt>
            <dd>{copy.surfaces[entry.surface]}</dd>
          </div>
          <div>
            <dt>{copy.impact}</dt>
            <dd>{copy.impacts[entry.impact]}</dd>
          </div>
          <div>
            <dt>{copy.statusHeading}</dt>
            <dd>{copy.statuses[entry.status]}{text.statusNote ? ` · ${text.statusNote}` : ""}</dd>
          </div>
          <div>
            <dt>{copy.toolsHeading}</dt>
            <dd className="guard-glossary__tags">{entry.tools.map((tool) => { const label = toolLabel(tool, lang); return <span key={label}>{label}</span>; })}</dd>
          </div>
        </dl>
        {entry.owasp && owasp && (
          <a className="guard-glossary__source" href={owasp.href} target="_blank" rel="noreferrer" aria-label={`${copy.reference} ${entry.owasp}:2025 — ${owasp.title}`}>
            {copy.reference} · {entry.owasp}:2025 — {owasp.title}<span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      {figure && (
        <div className="guard-glossary__figure">
          <Diagramme corps={figure} ouvert />
        </div>
      )}
    </div>
  );
}
