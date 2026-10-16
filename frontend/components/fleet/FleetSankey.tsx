type Flow = { readonly name: string; readonly value: string };
type Labels = {
  readonly label: string;
  readonly columns: readonly string[];
  readonly budget: { readonly name: string; readonly value: string; readonly note: string };
  readonly channels: readonly (Flow & { readonly detail: string })[];
  readonly uses: readonly Flow[];
  readonly legendChannels: string;
  readonly legendUses: string;
};

/**
 * Le Sankey de la simulation : budget, canaux, usages. Montants fictifs (100 k€ en
 * tout), toujours accompagnés de « Simulation · hypothèses affichées » et des
 * hypothèses, posées par la page. Géométrie fixe : une unité = 3,5 px de hauteur.
 * Sur téléphone, la version compacte garde les flux et la légende passe dessous.
 */
const CHANNEL_COLORS = ["#6B95FF", "#3DCFC2", "#F2C14E"] as const;
const FILL = 0.3;

/** Rubans du canal vers l'usage : [canal, y0 canal, y1 canal, y0 usage, y1 usage]. */
const LINKS: readonly (readonly [number, number, number, number, number])[] = [
  [0, 36, 204, 30, 198], [0, 204, 218, 350, 364], [0, 218, 239, 412, 433],
  [1, 263, 277, 198, 212], [1, 277, 340, 242.5, 305.5], [1, 340, 361, 364, 385], [1, 361, 368, 433, 440],
  [2, 392, 402.5, 212, 222.5], [2, 402.5, 427, 305.5, 330], [2, 427, 434, 385, 392],
];
/** Budget vers canaux : [y0 budget, y1 budget, y0 canal, y1 canal]. */
const SPLITS: readonly (readonly [number, number, number, number])[] = [[60, 263, 36, 239], [263, 368, 263, 368], [368, 410, 392, 434]];
const CHANNEL_BARS = [[36, 203], [263, 105], [392, 42]] as const;
const USE_BARS = [[30, 192.5], [242.5, 87.5], [350, 42], [412, 28]] as const;

const ribbon = (x0: number, x1: number, a0: number, a1: number, b0: number, b1: number) => {
  const mid = (x0 + x1) / 2;
  return `M${x0} ${a0}C${mid} ${a0} ${mid} ${b0} ${x1} ${b0}L${x1} ${b1}C${mid} ${b1} ${mid} ${a1} ${x0} ${a1}Z`;
};

function Ribbons({ budgetX, channelX, useX }: { budgetX: number; channelX: number; useX: number }) {
  return (
    <>
      {SPLITS.map(([a0, a1, b0, b1], i) => (
        <path key={`s${i}`} d={ribbon(budgetX + 14, channelX, a0, a1, b0, b1)} fill={CHANNEL_COLORS[i]} fillOpacity={FILL} />
      ))}
      {LINKS.map(([c, a0, a1, b0, b1], i) => (
        <path key={`l${i}`} d={ribbon(channelX + 14, useX, a0, a1, b0, b1)} fill={CHANNEL_COLORS[c]} fillOpacity={FILL} />
      ))}
      <rect x={budgetX} y={60} width={14} height={350} rx={3} fill="#E8EDF6" />
      {CHANNEL_BARS.map(([y, h], i) => <rect key={`c${i}`} x={channelX} y={y} width={14} height={h} rx={3} fill={CHANNEL_COLORS[i]} />)}
      {USE_BARS.map(([y, h], i) => <rect key={`u${i}`} x={useX} y={y} width={14} height={h} rx={3} fill={i === 3 ? "#5D6A84" : "#E8EDF6"} />)}
    </>
  );
}

export function FleetSankey({ labels }: { labels: Labels }) {
  const [budgetCol, channelCol, useCol] = labels.columns;
  const channelLabelY = [116.5, 294.5, 392];
  const useLabelY = [124.25, 284.25, 369, 424];
  return (
    <div className="fl-sankey">
      <svg viewBox="0 0 1120 470" className="fl-sankey__wide" role="img" aria-label={labels.label}>
        <g className="fl-sankey__cols">
          <text x="214" y="18" textAnchor="end">{budgetCol}</text>
          <text x="540" y="18">{channelCol}</text>
          <text x="900" y="18">{useCol}</text>
        </g>
        <Ribbons budgetX={200} channelX={540} useX={900} />
        <g className="fl-sankey__text">
          <text x="184" y="221" textAnchor="end" className="fl-sankey__name">{labels.budget.name}</text>
          <text x="184" y="246" textAnchor="end" className="fl-sankey__big">{labels.budget.value}</text>
          <text x="184" y="266" textAnchor="end" className="fl-sankey__note">{labels.budget.note}</text>
          {labels.channels.map((channel, i) => (
            <g key={channel.name}>
              <rect x="562" y={channelLabelY[i]} width="210" height="42" rx="6" className="fl-sankey__plate" />
              <text x="572" y={channelLabelY[i] + 18} className="fl-sankey__name">{channel.name}</text>
              <text x="572" y={channelLabelY[i] + 35} className="fl-sankey__note"><tspan className="fl-sankey__value" fill={CHANNEL_COLORS[i]}>{channel.value}</tspan>  {channel.detail}</text>
            </g>
          ))}
          {labels.uses.map((use, i) => (
            <g key={use.name}>
              <text x="928" y={useLabelY[i]} className="fl-sankey__name">{use.name}</text>
              <text x="928" y={useLabelY[i] + 17} className="fl-sankey__value">{use.value}</text>
            </g>
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 700 450" className="fl-sankey__compact" aria-hidden="true">
        <g className="fl-sankey__cols">
          <text x="8" y="18">{budgetCol}</text>
          <text x="340" y="18">{channelCol}</text>
          <text x="692" y="18" textAnchor="end">{useCol}</text>
        </g>
        <Ribbons budgetX={8} channelX={340} useX={678} />
      </svg>
      <div className="fl-sankey__legend">
        <div>
          <p className="fl-sankey__legend-head">{labels.legendChannels}</p>
          {labels.channels.map((channel, i) => (
            <p key={channel.name}><i style={{ background: CHANNEL_COLORS[i] }} />{channel.name}<b>{channel.value}</b></p>
          ))}
        </div>
        <div>
          <p className="fl-sankey__legend-head">{labels.legendUses}</p>
          {labels.uses.map((use) => <p key={use.name}>{use.name}<b>{use.value}</b></p>)}
        </div>
      </div>
    </div>
  );
}
