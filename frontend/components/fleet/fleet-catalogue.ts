import type { Lang } from "@/lib/i18n";
import data from "@/lib/generated/fleet-catalogue-options.json";

/**
 * Le catalogue d’options de xSOM Fleet, partie publique : une copie de la source tenue
 * dans le dépôt privé de la plateforme (`docs/offre/catalogue-options.json`, Story 20.5),
 * réduite aux options marquées « public » et sans les références internes. On ne l’édite
 * jamais ici : on la recopie depuis la source, avec sa date (`date`) et sa provenance.
 *
 * Les textes des options (ce qu’elles couvrent, leurs limites, leurs prérequis, leur part
 * produit et leur part conseil) viennent tels quels du catalogue ; seuls les libellés de
 * l’interface vivent dans `fleet-copy.ts`.
 */

type Localized = { readonly fr: string; readonly en: string };
type Listed<Id extends string = string> = { readonly id: Id; readonly label: Localized };

export type ZoneId = "metiers" | "externes" | "postes-dev" | "proxy" | "serveurs" | "cloud" | "console";
export type NatureId = "produit" | "produit-conseil" | "integration" | "conseil";
export type CoverageId = "oui" | "partiel" | "vendeur" | "a-mesurer" | "non";

type OptionText = {
  readonly name: string;
  readonly covers: string;
  readonly limits: string;
  readonly prerequisites: string;
  readonly productPart: string;
  readonly consultingPart: string;
};

export type CatalogueOption = {
  readonly id: string;
  readonly level: string;
  readonly module: string | null;
  readonly nature: NatureId;
  readonly state: string;
  readonly zones: readonly ZoneId[];
  readonly coverage: Readonly<Record<string, CoverageId>>;
  readonly sources: readonly string[];
  readonly fr: OptionText;
  readonly en: OptionText;
};

export type CatalogueSource = { readonly id: string; readonly publisher: string; readonly url: string; readonly published: string; readonly consulted: string };

type Catalogue = {
  readonly date: string;
  readonly nextReview: string;
  readonly provenance: { readonly catalogueDate: string; readonly researchDate: string; readonly stateCheckedOn: string };
  readonly notice: Localized;
  readonly levels: readonly (Listed & { readonly summary: Localized })[];
  readonly zones: readonly (Listed<ZoneId> & { readonly summary: Localized })[];
  readonly states: readonly (Listed & { readonly description: Localized })[];
  readonly natures: readonly Listed<NatureId>[];
  readonly surfaces: readonly Listed[];
  readonly coverageValues: readonly (Listed<CoverageId> & { readonly description: Localized })[];
  readonly sources: readonly CatalogueSource[];
  readonly options: readonly CatalogueOption[];
};

export const CATALOGUE = data as unknown as Catalogue;

/** Les zones du schéma, dans l’ordre de lecture du clavier. */
export const ZONE_ORDER: readonly ZoneId[] = ["metiers", "externes", "postes-dev", "proxy", "serveurs", "cloud", "console"];

/** Ce qui s’installe (produit) et ce qui se paramètre ou s’accompagne (conseil). */
export const isProduct = (option: CatalogueOption) => option.nature === "produit" || option.nature === "produit-conseil";

export const optionsOf = (zone: ZoneId) => CATALOGUE.options.filter((option) => option.zones.includes(zone));

const byId = <T extends { readonly id: string }>(list: readonly T[]) => new Map(list.map((entry) => [entry.id, entry]));
const ZONES = byId(CATALOGUE.zones);
const STATES = byId(CATALOGUE.states);
const NATURES = byId(CATALOGUE.natures);
const VALUES = byId(CATALOGUE.coverageValues);
const SOURCES = byId(CATALOGUE.sources);

export const zoneLabel = (zone: ZoneId, lang: Lang) => ZONES.get(zone)?.label[lang] ?? zone;
export const zoneSummary = (zone: ZoneId, lang: Lang) => ZONES.get(zone)?.summary[lang] ?? "";
export const stateLabel = (state: string, lang: Lang) => STATES.get(state)?.label[lang] ?? state;
export const stateDescription = (state: string, lang: Lang) => STATES.get(state)?.description[lang] ?? "";
export const natureLabel = (nature: NatureId, lang: Lang) => NATURES.get(nature)?.label[lang] ?? nature;
export const valueLabel = (value: CoverageId, lang: Lang) => VALUES.get(value)?.label[lang] ?? value;
export const sourcesOf = (option: CatalogueOption) => option.sources.flatMap((id) => SOURCES.get(id) ?? []);

/** Une date du catalogue (AAAA-MM-JJ), écrite pour la page. */
export function catalogueDate(iso: string, lang: Lang) {
  const [year, month, day] = iso.split("-");
  return lang === "fr" ? `${day}/${month}/${year}` : iso;
}
