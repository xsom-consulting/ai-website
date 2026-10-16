type Labels = {
  readonly label: string;
  readonly zone: string;
  readonly never: string;
  readonly input: { readonly step: string; readonly code: readonly string[]; readonly note: string };
  readonly scan: { readonly step: string; readonly points: readonly string[] };
  readonly stop: { readonly step: string; readonly message: string; readonly rule: string };
  readonly assistant: { readonly where: string; readonly what: string; readonly note: string };
  readonly event: { readonly where: string; readonly what: string; readonly note: string };
};

/**
 * Le schéma de Fleet Guard : la zone « Poste » contient les trois étapes (entrée,
 * analyse locale, blocage), deux sorties en partent (l'assistant ne reçoit rien ; un
 * Événement sans contenu). La clé est masquée ; le message est celui du catalogue
 * `hook.*` de l'Agent xSOM, mot pour mot.
 */
export function FleetGuardFlow({ labels }: { labels: Labels }) {
  const [plain, key] = labels.input.code;
  const [name, value] = key.split("=");
  return (
    <div className="fl-guard" role="img" aria-label={labels.label}>
      <div className="fl-guard__zone">
        <p className="fl-guard__zone-name">{labels.zone}</p>
        <p className="fl-guard__never">{labels.never}</p>
        <ol className="fl-guard__steps">
          <li className="fl-step">
            <p className="fl-step__name"><span>1</span>{labels.input.step}</p>
            <code className="fl-step__code">{plain}<br />{name}=<wbr /><mark>{value}</mark></code>
            <small>{labels.input.note}</small>
          </li>
          <li className="fl-step fl-step--scan">
            <p className="fl-step__name"><span>2</span>{labels.scan.step}</p>
            <ul>{labels.scan.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </li>
          <li className="fl-step fl-step--stop">
            <p className="fl-step__name"><span>3</span>{labels.stop.step}</p>
            <p className="fl-step__message">{labels.stop.message}</p>
            <small className="fl-step__rule">{labels.stop.rule}</small>
          </li>
        </ol>
      </div>
      <div className="fl-guard__exits">
        <div className="fl-exit fl-exit--none">
          <p className="fl-exit__where">{labels.assistant.where}</p>
          <p className="fl-exit__what">{labels.assistant.what}</p>
          <small>{labels.assistant.note}</small>
        </div>
        <div className="fl-exit fl-exit--event">
          <p className="fl-exit__where">{labels.event.where}</p>
          <p className="fl-exit__what">{labels.event.what}</p>
          <pre className="fl-json">{"{\n  "}<span>&quot;ruleId&quot;</span>: <em>&quot;aws_access_key_id&quot;</em>,{"\n  "}<span>&quot;localFingerprint&quot;</span>: <em>&quot;9f2c…e41a&quot;</em>,{"\n  "}<span>&quot;decision&quot;</span>: <em>&quot;block&quot;</em>{"\n}"}</pre>
          <small>{labels.event.note}</small>
        </div>
      </div>
    </div>
  );
}
