// Un poste macOS simulé, utilisable pour de vrai : fenêtres déplaçables, Dock, barre de menus, applications.
// Chaque envoi vers une IA passe par le vrai moteur Aparté (engine.ts), dans le navigateur.
import { analyse, onEngineState, type Analysis } from './engine';

type AppId = 'notes' | 'vscode' | 'terminal' | 'claude' | 'chatgpt';
type Kind = 'ok' | 'ko' | 'wait' | 'pass';

const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3.5 10.5L13 16L3.5 21.5" fill="none" stroke="currentColor" stroke-width="3.6"/><rect x="16.5" y="13.6" width="12.5" height="4.8" rx="1" fill="#015fce"/></svg>';
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const h = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pick = (cs: string, n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (v) => cs[v % cs.length]).join('');
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', Az09 = AZ + 'abcdefghijklmnopqrstuvwxyz0123456789';

/** Fausses valeurs du client fictif, tirées dans le navigateur : aucune forme de secret n'est écrite dans le code. */
export const FAKE = {
  stripe: ['sk', 'live', pick(Az09, 24)].join('_'),
  aws: 'AK' + 'IA' + pick(AZ + '234567', 16),
  gh: 'gh' + 'p_' + pick(Az09, 36),
  pgpass: pick('abcdefghijkmnpqrstuvwxyz23456789', 16),
};
const DB_URL = `postgres://admin:${FAKE.pgpass}@db.boulangerie-martin.fr/prod`;
const FILES: Record<string, string> = {
  'deploy.sh': '#!/bin/sh\nset -e\necho "Déploiement de la préprod"\ncurl -fsS -X POST "$API/deploy" -d "key=$1"',
  'app.py': 'from flask import Flask\nimport os\n\napp = Flask(__name__)\n\n@app.get("/")\ndef index():\n    return "Boulangerie Martin"',
  '.env': `STRIPE_KEY=${FAKE.stripe}\nAWS_ACCESS_KEY_ID=${FAKE.aws}\nDATABASE_URL=${DB_URL}`,
  'README.md': '# Boulangerie Martin\n\nSite de commande en ligne.\nDéploiement : ./deploy.sh <clé>',
};

/** Rend le texte tel que l'IA le reçoit : les substituts du moteur en puces bleues. */
const renderPieces = (a: Analysis) => a.pieces.map((p) => (p.masked ? `<span class="subst" title="${esc(p.text)}">${esc(p.label ?? 'secret')} masqué</span>` : esc(p.text))).join('');

export class Desktop {
  private z = 10;
  private wins = new Map<AppId, HTMLElement>();
  private journal: { kind: Kind; label: string; text: string; at: string }[] = [];
  private toasts: HTMLElement;
  private menu: HTMLElement;
  private dockEl: HTMLElement;
  private pending: null | (() => void) = null;
  readonly api: Record<string, () => void> = {};

  constructor(private readonly desk: HTMLElement) {
    desk.innerHTML = '';
    desk.append(this.menubar());
    this.menu = h('div', 'apmenu');
    this.toasts = h('div', 'toasts');
    this.dockEl = this.dock();
    desk.append(this.menu, this.toasts, this.dockEl);
    new ResizeObserver(() => desk.classList.toggle('small', desk.clientWidth < 700)).observe(desk);
    document.addEventListener('pointerdown', (e) => { if (!this.menu.contains(e.target as Node) && !(e.target as HTMLElement).closest('.apbtn')) this.menu.classList.remove('open'); });
  }

  /* ---------- barre de menus, Dock, notifications, journal ---------- */
  private menubar() {
    const bar = h('div', 'menubar', `<b class="apple"></b><span class="b">Finder</span><span>Fichier</span><span>Édition</span><span>Fenêtre</span>
      <span class="sp"><button class="apbtn" type="button">${LOGO}<span class="aps">Aparté</span></button><span class="clock"></span></span>`);
    const clock = bar.querySelector('.clock') as HTMLElement;
    const tick = () => { clock.textContent = new Date().toLocaleString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' }); };
    tick(); setInterval(tick, 30_000);
    const st = bar.querySelector('.aps') as HTMLElement;
    onEngineState((s) => { st.textContent = s === 'ready' ? 'Aparté' : s === 'failed' ? 'Aparté · indisponible' : 'Aparté · démarrage…'; bar.querySelector('.apbtn')!.classList.toggle('busy', s !== 'ready'); });
    bar.querySelector('.apbtn')!.addEventListener('click', () => { this.renderMenu(); this.menu.classList.toggle('open'); });
    return bar;
  }

  private renderMenu() {
    const n = (k: Kind) => this.journal.filter((j) => j.kind === k).length;
    this.menu.innerHTML = `<div class="mh"><i></i><b>Aparté actif</b><span>protection complète</span></div>
      <div class="mstats"><div><b>${n('ok')}</b>masqués</div><div><b>${n('ko')}</b>bloqués</div><div><b>${n('wait')}</b>en attente</div></div>
      <div class="mlist">${this.journal.length ? this.journal.slice(-6).reverse().map((j) => `<div class="mrow"><span class="k ${j.kind}">${j.label}</span><span>${esc(j.text)}</span><time>${j.at}</time></div>`).join('') : '<div class="mrow empty">Rien pour l\'instant. Essayez de coller une clé dans une IA.</div>'}</div>
      <div class="mfoot">Le journal garde la décision, jamais le contenu.</div>`;
  }

  log(kind: Kind, label: string, text: string) {
    this.journal.push({ kind, label, text, at: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
    if (this.menu.classList.contains('open')) this.renderMenu();
    const b = this.desk.querySelector('.apbtn'); b?.classList.remove('ping'); void (b as HTMLElement | null)?.offsetWidth; b?.classList.add('ping');
  }

  notify(kind: Kind, title: string, body: string) {
    const t = h('div', `toast ${kind}`, `${LOGO}<div><b>${esc(title)}</b><p>${esc(body)}</p></div>`);
    this.toasts.prepend(t);
    while (this.toasts.children.length > 3) this.toasts.lastElementChild!.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 5200);
  }

  private dock() {
    const d = h('div', 'dock');
    const apps: [AppId, string, string][] = [
      ['notes', 'Notes', '<svg viewBox="0 0 24 24" fill="none" stroke="#7a5a00" stroke-width="2"><path d="M6 4h12v16H6zM9 9h6M9 13h6M9 17h4"/></svg>'],
      ['vscode', 'VS Code', '<span>&lt;/&gt;</span>'],
      ['terminal', 'Terminal', '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M6 8l4 4-4 4M12 16h6"/></svg>'],
      ['claude', 'Claude', '<span>✳</span>'],
      ['chatgpt', 'Navigateur', '<svg viewBox="0 0 24 24" fill="none" stroke="#0d1116" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>'],
    ];
    for (const [id, name, icon] of apps) {
      const b = h('button', `app a-${id}`, `${icon}<em>${name}</em>`) as HTMLButtonElement;
      b.type = 'button'; b.dataset.app = id; b.setAttribute('aria-label', name);
      b.addEventListener('click', () => this.open(id));
      d.append(b);
    }
    return d;
  }

  private markRunning() { this.dockEl.querySelectorAll<HTMLElement>('.app').forEach((b) => b.classList.toggle('run', this.wins.has(b.dataset.app as AppId))); }

  /* ---------- fenêtres ---------- */
  open(id: AppId): HTMLElement {
    let w = this.wins.get(id);
    if (!w) { w = this.build(id); this.wins.set(id, w); this.desk.append(w); this.markRunning(); }
    w.classList.remove('min'); this.focus(w);
    return w;
  }

  private focus(w: HTMLElement) { w.style.zIndex = String(++this.z); this.desk.querySelectorAll('.win').forEach((x) => x.classList.toggle('focused', x === w)); }

  private frame(id: AppId, title: string, geo: [number, number, number, number], extra = '') {
    const w = h('section', `win w-${id} ${extra}`);
    w.setAttribute('aria-label', title);
    const [l, t, wd, ht] = geo;
    Object.assign(w.style, { left: `${l}%`, top: `${t}%`, width: `${wd}%`, height: `${ht}%` });
    const tb = h('header', 'tb', `<button type="button" class="l r" aria-label="Fermer"></button><button type="button" class="l y" aria-label="Réduire"></button><button type="button" class="l g" aria-label="Agrandir"></button><span class="tt">${esc(title)}</span>`);
    w.append(tb);
    tb.querySelector('.r')!.addEventListener('click', () => { w.remove(); this.wins.delete(id); this.markRunning(); });
    tb.querySelector('.y')!.addEventListener('click', () => w.classList.add('min'));
    tb.querySelector('.g')!.addEventListener('click', () => w.classList.toggle('max'));
    w.addEventListener('pointerdown', () => this.focus(w));
    // Déplacement par la barre de titre (pas en petit écran : les fenêtres y sont plein écran).
    tb.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button') || this.desk.classList.contains('small') || w.classList.contains('max')) return;
      const r = this.desk.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop;
      tb.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        const x = Math.min(Math.max(ox + ev.clientX - sx, -w.offsetWidth + 80), r.width - 80);
        const y = Math.min(Math.max(oy + ev.clientY - sy, 26), r.height - 60);
        w.style.left = `${x}px`; w.style.top = `${y}px`;
      };
      const up = () => { tb.removeEventListener('pointermove', move); tb.removeEventListener('pointerup', up); };
      tb.addEventListener('pointermove', move); tb.addEventListener('pointerup', up);
    });
    return w;
  }

  private build(id: AppId): HTMLElement {
    switch (id) {
      case 'notes': return this.notes();
      case 'vscode': return this.vscode();
      case 'terminal': return this.terminal();
      case 'claude': return this.claudeApp();
      default: return this.chatgpt();
    }
  }

  /* ---------- composant de discussion ---------- */
  private chat(host: HTMLElement, opts: { placeholder: string; empty: string; onSend: (text: string, ui: ChatUi) => Promise<boolean> }): ChatUi {
    const box = h('div', 'chat');
    const list = h('div', 'msgs', `<div class="hello">${opts.empty}</div>`);
    const form = h('form', 'composer');
    const ta = h('textarea') as HTMLTextAreaElement;
    ta.rows = 2; ta.placeholder = opts.placeholder; ta.spellcheck = false;
    const send = h('button', 'send', '↑') as HTMLButtonElement; send.type = 'submit'; send.setAttribute('aria-label', 'Envoyer');
    const chips = h('div', 'pastes', '<span>Coller :</span>');
    const pasteables: [string, string][] = [['clé Stripe', FAKE.stripe], ['clé AWS', FAKE.aws], ['URL de base', DB_URL]];
    for (const [label, v] of pasteables) {
      const c = h('button', '', label) as HTMLButtonElement; c.type = 'button';
      c.addEventListener('click', () => { ta.value = (ta.value ? ta.value + ' ' : '') + v; ta.focus(); });
      chips.append(c);
    }
    form.append(ta, send);
    box.append(list, chips, form);
    host.append(box);
    const ui: ChatUi = {
      add: (cls, html) => { const m = h('div', `m ${cls}`, html); list.querySelector('.hello')?.remove(); list.append(m); list.scrollTop = list.scrollHeight; return m; },
      typing: async (ms = 700) => { const t = ui.add('ai typing', '<i></i><i></i><i></i>'); await wait(ms); t.remove(); },
      input: ta,
      submit: (text?: string) => { if (text !== undefined) ta.value = text; form.requestSubmit(); },
    };
    let busy = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text || busy) return;
      busy = true; send.disabled = true;
      try { if (await opts.onSend(text, ui)) ta.value = ''; } finally { busy = false; send.disabled = false; }
    });
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    return ui;
  }

  /** Échec fermé : si le moteur n'a pas pu analyser, rien ne part. */
  private failClosed(ui: ChatUi, where: string) {
    ui.add('flag ko', `${LOGO}<span>Analyse impossible : envoi bloqué. Aparté ne laisse rien partir sans l'avoir vérifié.</span>`);
    this.log('ko', 'bloqué', `analyse impossible · ${where}`);
  }

  /* ---------- Notes ---------- */
  private notes() {
    const w = this.frame('notes', 'Notes', [1.5, 8, 27, 68]);
    const body = h('div', 'notes');
    body.innerHTML = '<h4>Accès client · Boulangerie Martin</h4><p class="nm">Note perso. Copiez une valeur, puis collez-la dans une IA.</p>';
    const rows: [string, string][] = [['Clé Stripe (prod)', FAKE.stripe], ['Accès AWS', FAKE.aws], ['Jeton GitHub', FAKE.gh], ['Base de données', DB_URL]];
    for (const [k, v] of rows) {
      const r = h('div', 'nrow', `<span>${esc(k)}</span><code>${esc(v)}</code>`);
      const b = h('button', '', 'Copier') as HTMLButtonElement; b.type = 'button';
      b.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(v); b.textContent = 'Copié'; } catch { b.textContent = 'Sélectionnez'; const range = document.createRange(); range.selectNodeContents(r.querySelector('code')!); getSelection()?.removeAllRanges(); getSelection()?.addRange(range); }
        setTimeout(() => { b.textContent = 'Copier'; }, 1400);
      });
      r.append(b); body.append(r);
    }
    w.append(body);
    return w;
  }

  /* ---------- VS Code avec Claude Code et Codex ---------- */
  private vscode() {
    const w = this.frame('vscode', 'boulangerie-martin — Visual Studio Code', [30, 6, 68.5, 80], 'dark');
    const body = h('div', 'vs');
    body.innerHTML = `<nav class="act"><b>⎘</b><b>⌕</b><b>⑂</b><b class="on">✳</b></nav>
      <aside class="ex"><div class="t">BOULANGERIE-MARTIN</div></aside>
      <div class="ed"><div class="etabs"></div><pre class="code"></pre></div>
      <div class="side"><div class="stabs"><button type="button" class="on" data-t="claude">CLAUDE CODE</button><button type="button" data-t="codex">CODEX</button></div><div class="spane" data-p="claude"></div><div class="spane" data-p="codex" hidden></div></div>`;
    w.append(body);
    const ex = body.querySelector('.ex')!, etabs = body.querySelector('.etabs')!, code = body.querySelector('.code') as HTMLElement;
    const openFile = async (name: string) => {
      ex.querySelectorAll('div[data-f]').forEach((d) => d.classList.toggle('sel', (d as HTMLElement).dataset.f === name));
      etabs.innerHTML = `<span class="on">${esc(name)}</span>`;
      code.textContent = FILES[name];
      code.parentElement!.querySelector('.banner')?.remove();
      if (name === '.env') {
        const a = await analyse(FILES[name]);
        const bn = h('div', 'banner', `${LOGO}<span>${a.ok ? `${a.count} secrets dans ce fichier (${esc(a.labels.join(', '))}). Un agent ne pourra pas l'envoyer à l'IA.` : 'Analyse en cours…'}</span>`);
        code.parentElement!.insertBefore(bn, code);
      }
    };
    for (const f of Object.keys(FILES)) { const d = h('div', '', esc(f)); d.dataset.f = f; d.addEventListener('click', () => void openFile(f)); ex.append(d); }
    void openFile('deploy.sh');
    const tabs = body.querySelectorAll<HTMLButtonElement>('.stabs button');
    tabs.forEach((b) => b.addEventListener('click', () => { tabs.forEach((x) => x.classList.toggle('on', x === b)); body.querySelectorAll<HTMLElement>('.spane').forEach((p) => { p.hidden = p.dataset.p !== b.dataset.t; }); }));

    const claude = this.chat(body.querySelector('[data-p="claude"]')!, {
      placeholder: 'Demandez à Claude Code… (essayez de coller une clé)',
      empty: '<b>Claude Code</b><span>Collez une clé dans votre demande, ou demandez de lire le .env.</span>',
      onSend: (t, ui) => this.agent(t, ui, 'Claude Code', true),
    });
    const codex = this.chat(body.querySelector('[data-p="codex"]')!, {
      placeholder: 'Demandez à Codex…',
      empty: '<b>Codex</b><span>Avec Codex, un envoi qui contient un secret est bloqué.</span>',
      onSend: (t, ui) => this.agent(t, ui, 'Codex', false),
    });
    this.api.claudeKey = () => { this.open('vscode'); tabs[0].click(); claude.submit(`Déploie la préprod avec la clé ${FAKE.stripe}`); };
    this.api.readEnv = () => { this.open('vscode'); tabs[1].click(); codex.submit('Vérifie la connexion à la base, tout est dans le .env'); };
    return w;
  }

  /** Agent de code : Claude Code masque (expurgation réversible), Codex bloque. */
  private async agent(text: string, ui: ChatUi, who: 'Claude Code' | 'Codex', reversible: boolean): Promise<boolean> {
    const a = await analyse(text);
    if (!a.ok) { ui.add('me', esc(text)); this.failClosed(ui, who); return true; }
    if (a.count && !reversible) {
      ui.add('me struck', esc(text));
      ui.add('flag ko', `${LOGO}<span>Envoi refusé par Aparté : ${esc(a.labels.join(', '))}. Utilisez une variable d'environnement plutôt que la valeur.</span>`);
      this.notify('ko', 'Envoi bloqué', `${a.labels.join(', ')} · ${who}`); this.log('ko', 'bloqué', `${a.labels[0]} · ${who}`);
      return false;
    }
    ui.add('me', a.count ? renderPieces(a) : esc(text));
    if (a.count) {
      ui.add('flag ok', `${LOGO}<span>${a.count === 1 ? '1 secret masqué' : `${a.count} secrets masqués`} avant l'envoi. L'IA reçoit un substitut, la vraie valeur reste sur votre poste.</span>`);
      this.notify('ok', 'Secret masqué', `${a.labels.join(', ')} · ${who}`); this.log('ok', 'masqué', `${a.labels[0]} · ${who}`);
    }
    await ui.typing();
    if (/\.env|config|connexion|base/i.test(text) && !a.count) {
      ui.add('tool', 'Read(.env)');
      const env = await analyse(FILES['.env']);
      await wait(400);
      ui.add('flag ko', `${LOGO}<span>Lecture refusée : .env contient ${env.count} secrets (${esc(env.labels.join(', '))}).</span>`);
      this.notify('ko', 'Lecture bloquée', `.env · ${who}`); this.log('ko', 'bloqué', `lecture de .env · ${who}`);
      await ui.typing(500);
      ui.add('ai', 'Je ne peux pas lire .env. Je teste la connexion avec la variable DATABASE_URL déjà définie dans votre environnement.');
      return true;
    }
    if (a.count && /d[ée]plo|deploy|lance/i.test(text)) {
      const sub = a.pieces.find((p) => p.masked);
      ui.add('tool', `Bash(./deploy.sh <span class="subst">${esc(sub?.label ?? 'secret')} masqué</span>)`);
      await wait(700);
      ui.add('flag ok', `${LOGO}<span>Exécution sur votre poste : Aparté remet la vraie valeur dans la commande.</span>`);
      await wait(500);
      ui.add('ok', '✓ Préprod déployée.');
      return true;
    }
    ui.add('ai', a.count ? 'C\'est noté. Je travaille avec le substitut, sans connaître la valeur.' : 'D\'accord, je m\'en occupe.');
    return true;
  }

  /* ---------- Terminal ---------- */
  private terminal() {
    const w = this.frame('terminal', 'boulangerie-martin — zsh', [10, 16, 70, 66], 'dark');
    const out = h('div', 'term');
    const line = h('form', 'tline', '<span class="ps"></span><input aria-label="Commande" autocomplete="off" spellcheck="false">');
    out.append(line); w.append(out);
    const ps = line.querySelector('.ps') as HTMLElement, input = line.querySelector('input') as HTMLInputElement;
    let agentMode = false;
    const setPs = () => { ps.textContent = agentMode ? '>' : 'boulangerie-martin %'; };
    setPs();
    const print = (html: string, cls = '') => { out.insertBefore(h('div', `tl ${cls}`, html), line); out.scrollTop = out.scrollHeight; };
    print('Tapez <b>claude</b> pour lancer l\'agent, ou <b>help</b>.', 'dim');
    w.addEventListener('click', () => input.focus());
    const run = async (cmd: string) => {
      print(`<span class="dim">${esc(agentMode ? '>' : 'boulangerie-martin %')}</span> ${esc(cmd)}`);
      if (/^aparte\s+commande\s+accepter$/i.test(cmd)) {
        if (this.pending) { const p = this.pending; this.pending = null; p(); } else print('aparte : aucune commande en attente.', 'dim');
        return;
      }
      if (!agentMode) {
        const [c, ...rest] = cmd.split(/\s+/);
        if (c === 'help') print('Commandes : <b>claude</b> (agent), <b>ls</b>, <b>cat</b> &lt;fichier&gt;, <b>aparte journal</b>, <b>clear</b>.', 'dim');
        else if (c === 'ls') print(Object.keys(FILES).join('   '));
        else if (c === 'cat') print(esc(FILES[rest[0]] ?? `cat: ${rest[0] ?? ''}: aucun fichier de ce nom`).replace(/\n/g, '<br>'));
        else if (c === 'clear') out.querySelectorAll('.tl').forEach((n) => n.remove());
        else if (c === 'aparte') print(this.journal.length ? this.journal.map((j) => `${j.at}  ${j.label.padEnd(10)}  ${esc(j.text)}`).join('<br>') : 'aparte : journal vide.', 'dim');
        else if (c === 'claude') { agentMode = true; setPs(); print('Claude Code · protégé par Aparté. Essayez : <i>pousse ma version sur main</i>, <i>ajoute un paquet d\'authentification</i>, ou collez une clé. <b>exit</b> pour quitter.', 'dim'); }
        else if (c) print(`zsh: commande introuvable : ${esc(c)}`, 'dim');
        return;
      }
      if (cmd === 'exit' || cmd === '/exit') { agentMode = false; setPs(); return; }
      const a = await analyse(cmd);
      if (!a.ok) { print('✕ Aparté : analyse impossible, envoi bloqué.', 'ko'); this.log('ko', 'bloqué', 'analyse impossible · Terminal'); return; }
      if (a.count) {
        print(`<span class="ok">↳ Aparté : ${a.count} secret(s) masqué(s) avant l'envoi</span>`);
        print(`<span class="dim">l'IA reçoit :</span> ${renderPieces(a)}`);
        this.notify('ok', 'Secret masqué', `${a.labels.join(', ')} · Terminal`); this.log('ok', 'masqué', `${a.labels[0]} · Terminal`);
      }
      await wait(500);
      if (/push|pousse/i.test(cmd)) {
        print('● Bash(git push --force origin main)', 'tool');
        await wait(400);
        print('‖ Aparté : push forcé sur une branche partagée. En attente de votre accord : tapez <b>aparte commande accepter</b>.', 'wait');
        this.notify('wait', 'En attente de votre accord', 'git push --force sur main · Claude Code'); this.log('wait', 'en attente', 'git push --force · Claude Code');
        this.pending = () => { print('✓ Autorisé une fois par vous. Push effectué.', 'ok'); this.log('pass', 'autorisé', 'git push --force · votre accord'); };
        return;
      }
      if (/supprim|nettoie|rm -rf/i.test(cmd)) {
        print('● Bash(rm -rf ~/projets/anciens)', 'tool'); await wait(400);
        print('‖ Aparté : suppression récursive hors du projet. En attente de votre accord.', 'wait');
        this.log('wait', 'en attente', 'rm -rf hors du projet · Claude Code');
        this.pending = () => { print('✓ Autorisé une fois par vous.', 'ok'); this.log('pass', 'autorisé', 'rm -rf · votre accord'); };
        return;
      }
      if (/paquet|install|librair|d[ée]pendance/i.test(cmd)) {
        const name = 'express-sesion-auth-helper';
        print(`● Bash(npm install ${name})`, 'tool'); await wait(300);
        print('<span class="dim">Aparté vérifie le paquet sur le registre npm…</span>');
        let verdict: 'absent' | 'present' | 'unknown' = 'unknown';
        try { const r = await fetch(`https://registry.npmjs.org/${name}`, { method: 'GET' }); verdict = r.status === 404 ? 'absent' : r.ok ? 'present' : 'unknown'; } catch { verdict = 'unknown'; }
        if (verdict === 'present') { print('✓ Paquet connu, installé.', 'ok'); return; }
        print(verdict === 'absent' ? `✕ Aparté : « ${name} » n'existe pas sur npm. Nom probablement inventé par l'IA : installation refusée.` : '✕ Aparté : vérification impossible, installation refusée.', 'ko');
        this.notify('ko', 'Paquet refusé', `${name} · ${verdict === 'absent' ? 'inexistant' : 'vérification impossible'}`); this.log('ko', 'bloqué', `${verdict === 'absent' ? 'paquet inexistant' : 'paquet non vérifié'} · Claude Code`);
        await wait(500); print('l\'IA : j\'utilise express-session, paquet existant et maintenu.', 'dim');
        return;
      }
      print(a.count ? 'l\'IA : compris, je travaille avec le substitut.' : 'l\'IA : d\'accord.', 'dim');
    };
    line.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); input.value = ''; if (v) void run(v); });
    this.api.push = () => { this.open('terminal'); void (async () => { if (!agentMode) await run('claude'); await run('le rebase a échoué, pousse ma version sur main'); })(); };
    this.api.pkg = () => { this.open('terminal'); void (async () => { if (!agentMode) await run('claude'); await run('ajoute un paquet d\'authentification par session'); })(); };
    return w;
  }

  /* ---------- Claude Desktop ---------- */
  private claudeApp() {
    const w = this.frame('claude', 'Claude', [24, 10, 62, 72], 'warm');
    const body = h('div', 'cd', '<aside><b>Claude</b><span>Nouvelle conversation</span><span>Migration base client</span><span>Revue API</span></aside><div class="cdm"></div>');
    w.append(body);
    const ui = this.chat(body.querySelector('.cdm')!, {
      placeholder: 'Répondre à Claude…',
      empty: '<b>Bonjour !</b><span>Collez une configuration avec un mot de passe pour voir Aparté retenir l\'envoi.</span>',
      onSend: async (text, c) => {
        const a = await analyse(text);
        if (!a.ok) { this.failClosed(c, 'Claude Desktop'); return false; }
        if (a.count) {
          c.add('flag ko', `${LOGO}<span>Envoi retenu par Aparté : ${esc(a.labels.join(', '))} dans votre message. Retirez-le, puis renvoyez.</span>`);
          this.notify('ko', 'Envoi retenu', `${a.labels.join(', ')} · Claude Desktop`); this.log('ko', 'retenu', `${a.labels[0]} · Claude Desktop`);
          return false;
        }
        c.add('me', esc(text)); await c.typing(); c.add('ai', 'Bien sûr. Pouvez-vous me donner le message d\'erreur complet ?');
        return true;
      },
    });
    this.api.desktop = () => { this.open('claude'); ui.submit(`Pourquoi ma connexion échoue ?\nDATABASE_URL=${DB_URL}`); };
    return w;
  }

  /* ---------- Navigateur, ChatGPT avec l'extension ---------- */
  private chatgpt() {
    const w = this.frame('chatgpt', 'ChatGPT', [14, 8, 72, 78]);
    const body = h('div', 'br', '<div class="url"><span>🔒 chatgpt.com</span><b class="ext" title="Extension Aparté">' + LOGO + '</b></div><div class="gp"></div>');
    w.append(body);
    const host = body.querySelector('.gp') as HTMLElement;
    const ui = this.chat(host, {
      placeholder: 'Envoyer un message à ChatGPT',
      empty: '<b>Que puis-je faire pour vous ?</b><span>Collez un journal d\'erreur qui contient une clé.</span>',
      onSend: async (text, c) => {
        const a = await analyse(text);
        if (!a.ok) { this.failClosed(c, 'ChatGPT'); return false; }
        if (!a.count) { c.add('me', esc(text)); await c.typing(); c.add('ai', 'Voici quelques pistes pour résoudre ce problème…'); return true; }
        const pop = h('div', 'extpop', `<b>${LOGO}${a.count === 1 ? '1 secret' : `${a.count} secrets`} dans votre message</b><p>${esc(a.labels.join(', '))}. Que voulez-vous faire ?</p><div class="row"><button type="button" class="pri" data-c="mask">Masquer et envoyer</button><button type="button" data-c="edit">Modifier</button><button type="button" data-c="send">Envoyer quand même</button></div>`);
        host.append(pop);
        this.notify('wait', 'Secret détecté', `${a.labels.join(', ')} · ChatGPT`);
        const choice = await new Promise<string>((res) => pop.querySelectorAll<HTMLButtonElement>('[data-c]').forEach((b) => b.addEventListener('click', () => res(b.dataset.c!))));
        pop.remove();
        if (choice === 'edit') { this.log('wait', 'retenu', `${a.labels[0]} · ChatGPT`); return false; }
        c.add('me', choice === 'mask' ? renderPieces(a) : esc(text));
        this.log(choice === 'mask' ? 'ok' : 'pass', choice === 'mask' ? 'masqué' : 'envoyé', `${a.labels[0]} · ChatGPT${choice === 'send' ? ' · votre choix' : ''}`);
        await c.typing(); c.add('ai', 'L\'erreur vient sans doute des droits du compte : vérifiez la politique attachée.');
        return true;
      },
    });
    this.api.web = () => { this.open('chatgpt'); ui.submit(`Pourquoi cette erreur ?\n[ERROR] S3 upload failed\naws_access_key_id=${FAKE.aws}`); };
    return w;
  }

  /** Lance une démonstration guidée (boutons hors du Mac). */
  run(name: string) {
    if (!this.api[name]) this.open(({ claudeKey: 'vscode', readEnv: 'vscode', push: 'terminal', pkg: 'terminal', desktop: 'claude', web: 'chatgpt' } as Record<string, AppId>)[name] ?? 'vscode');
    this.api[name]?.();
  }
}

interface ChatUi {
  add: (cls: string, html: string) => HTMLElement;
  typing: (ms?: number) => Promise<void>;
  input: HTMLTextAreaElement;
  submit: (text?: string) => void;
}
