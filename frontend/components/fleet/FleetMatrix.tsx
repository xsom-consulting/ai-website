import type { Lang } from "@/lib/i18n";
import { CATALOGUE, isProduct, natureLabel, stateLabel, valueLabel } from "./fleet-catalogue";

export type MatrixLabels = {
  readonly region: string;
  readonly caption: string;
  readonly option: string;
  readonly nature: string;
  readonly state: string;
  readonly scroll: string;
  readonly legend: string;
  readonly kinds: string;
};

/**
 * La matrice de comparaison : toutes les options publiées du catalogue, regroupées par
 * niveau (FinOps compris), une colonne par surface. Chaque cellule reprend la valeur du
 * catalogue ; « — » se lit « Non ». Le tableau défile dans son cadre sur un téléphone,
 * la colonne des options reste visible.
 */
export function FleetMatrix({ lang, labels }: { lang: Lang; labels: MatrixLabels }) {
  const { levels, surfaces, options, coverageValues, natures } = CATALOGUE;
  return (
    <figure className="fl-mx">
      <div className="fl-mx__scroll" role="region" aria-label={labels.region} tabIndex={0}>
        <table>
          <caption>{labels.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.option}</th>
              <th scope="col">{labels.nature}</th>
              <th scope="col">{labels.state}</th>
              {surfaces.map((surface) => <th key={surface.id} scope="col">{surface.label[lang]}</th>)}
            </tr>
          </thead>
          {levels.map((level) => {
            const rows = options.filter((option) => option.level === level.id);
            if (!rows.length) return null;
            return (
              <tbody key={level.id}>
                <tr className="fl-mx__level">
                  <th scope="rowgroup" colSpan={3 + surfaces.length}>{level.label[lang]}</th>
                </tr>
                {rows.map((option) => (
                  <tr key={option.id} id={`matrice-${option.id}`} data-kind={isProduct(option) ? "product" : "consulting"}>
                    <th scope="row">{option[lang].name}</th>
                    <td><span className="fl-tag" data-nature={option.nature}>{natureLabel(option.nature, lang)}</span></td>
                    <td><span className="fl-tag fl-tag--state" data-state={option.state}>{stateLabel(option.state, lang)}</span></td>
                    {surfaces.map((surface) => {
                      const value = option.coverage[surface.id] ?? "non";
                      return (
                        <td key={surface.id} className="fl-mx__cell" data-value={value}>
                          {value === "non" ? (
                            <><span aria-hidden="true">—</span><span className="fl-sr">{valueLabel(value, lang)}</span></>
                          ) : (
                            valueLabel(value, lang)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
      <figcaption className="fl-mx__legend">
        <p className="fl-mx__scroll-hint">{labels.scroll}</p>
        <p><strong>{labels.kinds}</strong></p>
        <ul>
          {natures.map((nature) => (
            <li key={nature.id}><span className="fl-tag" data-nature={nature.id}>{natureLabel(nature.id, lang)}</span></li>
          ))}
        </ul>
        <p><strong>{labels.legend}</strong></p>
        <dl>
          {coverageValues.map((value) => (
            <div key={value.id}>
              <dt className="fl-mx__cell" data-value={value.id}>{value.id === "non" ? <><span aria-hidden="true">—</span><span className="fl-sr">{value.label[lang]}</span></> : value.label[lang]}</dt>
              <dd>{value.description[lang]}</dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
