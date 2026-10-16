import type { CSSProperties } from "react";

type Row = { readonly use: string; readonly model: string; readonly where: string; readonly budget: number; readonly local?: boolean };
type Labels = {
  readonly label: string;
  readonly illustration: string;
  readonly table: { readonly title: string; readonly use: string; readonly model: string; readonly budget: string };
  readonly rows: readonly Row[];
  readonly gateway: { readonly name: string; readonly detail: string };
  readonly rollout: { readonly title: string; readonly steps: readonly string[] };
};

/**
 * L'illustration de Fleet Gateway (disponible pour pilote) : une Politique de sélection
 * (cas métier, modèle, Budget API), la passerelle installée chez le client et le
 * déploiement par étapes. Aucun modèle ni fournisseur nommé, aucun montant : les barres
 * de budget sont une illustration, sans échelle.
 */
export function FleetGateway({ labels }: { labels: Labels }) {
  const steps = labels.rollout.steps;
  return (
    <div className="fl-gw" role="img" aria-label={labels.label}>
      <div className="fl-gw__policy">
        <p className="fl-gw__title">{labels.table.title}<span className="xp-pill">{labels.illustration}</span></p>
        <div className="fl-gw__row fl-gw__row--head" aria-hidden="true">
          <span>{labels.table.use}</span><span>{labels.table.model}</span><span>{labels.table.budget}</span>
        </div>
        {labels.rows.map((row) => (
          <div key={row.use} className="fl-gw__row" data-local={row.local ? "" : undefined}>
            <span className="fl-gw__use">{row.use}</span>
            <span className="fl-gw__model"><b>{row.model}</b><small>{row.where}</small></span>
            <span className="fl-gw__budget"><i style={{ "--w": row.budget } as CSSProperties} /></span>
          </div>
        ))}
      </div>
      <div className="fl-gw__side">
        <div className="fl-gw__gateway">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3.5" y="4" width="17" height="6.5" rx="1.5" /><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5" /><path d="M7 7.25h.01M7 16.75h.01" strokeWidth="2.2" strokeLinecap="round" /></svg>
          <p><b>{labels.gateway.name}</b><span>{labels.gateway.detail}</span></p>
        </div>
        <div className="fl-gw__rollout">
          <p className="fl-gw__rollout-title">{labels.rollout.title}</p>
          <ol>
            {steps.map((step, index) => (
              <li key={step} data-state={index < 1 ? "done" : index === 1 ? "now" : "next"}><i />{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
