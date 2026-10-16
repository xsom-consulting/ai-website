import { XsomMark } from "@/components/brand";
import { CHATGPT_MARK, CLAUDE_MARK } from "./brand-marks";

type Item = { readonly name: string; readonly detail: string };
type Module = { readonly key: string; readonly tag: string; readonly name: string; readonly detail: string };
export type FlowLabels = {
  readonly label: string;
  readonly sources: string;
  readonly teams: string;
  readonly claude: Item;
  readonly codex: Item;
  readonly api: Item;
  readonly hosted: Item;
  readonly console: string;
  readonly modules: readonly Module[];
  readonly seal: string;
  readonly outputs: readonly Item[];
  readonly schematic: string;
};

const Brand = ({ path, brand }: { path: string; brand: string }) => (
  <span className="fl-node__icon" data-brand={brand}><svg viewBox="0 0 24 24"><path d={path} /></svg></span>
);

const ApiIcon = () => (
  <span className="fl-node__icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13.5 5-3 14" /></svg>
  </span>
);

const ServerIcon = () => (
  <span className="fl-node__icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="3.5" width="16" height="6.5" rx="1.5" /><rect x="4" y="14" width="16" height="6.5" rx="1.5" /><circle cx="8" cy="6.75" r=".9" fill="currentColor" /><circle cx="8" cy="17.25" r=".9" fill="currentColor" /></svg>
  </span>
);

const Shield = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 1.5l5 2v3.8c0 3.2-2.1 5.5-5 6.7-2.9-1.2-5-3.5-5-6.7V3.5z" /><path d="M5.6 8l1.7 1.7 3.1-3.2" /></svg>
);

/**
 * Le schéma de la couverture : vos IA → xSOM Fleet → vos équipes. Un schéma de
 * principe, décrit en entier par son `aria-label`. Les fils glissent lentement, et
 * jamais quand le mouvement est réduit (`pitch.css`).
 */
export function FleetFlow({ labels }: { labels: FlowLabels }) {
  const sources = [
    { item: labels.claude, icon: <Brand path={CLAUDE_MARK} brand="claude" /> },
    { item: labels.codex, icon: <Brand path={CHATGPT_MARK} brand="chatgpt" /> },
    { item: labels.api, icon: <ApiIcon /> },
    { item: labels.hosted, icon: <ServerIcon /> },
  ];
  return (
    <div className="fl-flow" role="img" aria-label={labels.label}>
      <div className="fl-flow__col" data-col="in">
        <p className="fl-flow__head">{labels.sources}</p>
        {sources.map(({ item, icon }) => (
          <div key={item.name} className="fl-node">{icon}<span><b>{item.name}</b><small>{item.detail}</small></span></div>
        ))}
      </div>
      <div className="fl-flow__wire" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="fl-core">
        <p className="fl-core__title"><XsomMark className="fl-core__mark" /><b>xSOM Fleet</b><small>{labels.console}</small></p>
        {labels.modules.map((module) => (
          <div key={module.key} className="fl-module" data-module={module.key}>
            <span className="fl-module__tag">{module.tag}</span>
            <span><b>{module.name}</b><small>{module.detail}</small></span>
          </div>
        ))}
        <p className="fl-core__seal"><Shield />{labels.seal}</p>
      </div>
      <div className="fl-flow__wire fl-flow__wire--out" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="fl-flow__col" data-col="out">
        <p className="fl-flow__head">{labels.teams}</p>
        {labels.outputs.map((item) => (
          <div key={item.name} className="fl-node fl-node--out"><span><b>{item.name}</b><small>{item.detail}</small></span></div>
        ))}
      </div>
    </div>
  );
}
