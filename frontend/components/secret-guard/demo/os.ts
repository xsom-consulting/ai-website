// Un poste macOS simulé, utilisable pour de vrai : fenêtres déplaçables, Dock, barre de menus, applications.
// Chaque envoi vers une IA passe par le vrai moteur Aparté (engine.ts), dans le navigateur.
// Les réponses des IA sont simulées ; aucune marque graphique de tiers n'est reprise (icônes génériques).
import { analyse, onEngineState, type Analysis } from './engine';

type AppId = 'notes' | 'vscode' | 'terminal' | 'claude' | 'chatgpt';
type Kind = 'ok' | 'ko' | 'wait' | 'pass';
type MenuItem = { label: string; key?: string; run?: () => void; checked?: boolean } | null;

const LOGO = '<svg class="aplogo" viewBox="0 0 32 32" aria-hidden="true"><path d="M3.5 10.5L13 16L3.5 21.5" fill="none" stroke="currentColor" stroke-width="3.6"/><rect x="16.5" y="13.6" width="12.5" height="4.8" rx="1" fill="#015fce"/></svg>';
const ic = (d: string, sw = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const GIT = '<circle cx="7" cy="5" r="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="8" r="2"/><path d="M7 7v10M17 10c0 5-10 2-10 7"/>';
const I = {
  files: ic('<path d="M15 3H8a1 1 0 00-1 1v13a1 1 0 001 1h10a1 1 0 001-1V7z"/><path d="M15 3v4h4M7 8H5a1 1 0 00-1 1v11a1 1 0 001 1h9a1 1 0 001-1v-2"/>'),
  search: ic('<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/>'),
  git: ic(GIT),
  run: ic('<path d="M9 5l10 7-10 7z"/><path d="M5 9v6"/>'),
  ext: ic('<path d="M4 13h7v7H4zM13 13h7v7h-7zM4 4h7v7H4zM15.5 3l5 5-5 5-5-5z"/>'),
  user: ic('<circle cx="12" cy="9" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'),
  spark: ic('<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>', 2),
  branch: ic(GIT, 2),
  sync: ic('<path d="M20 12a8 8 0 01-14 5.3L4 15M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M4 20v-5h5"/>', 2),
  up: ic('<path d="M12 19V5M6 11l6-6 6 6"/>', 2.4),
  plus: ic('<path d="M12 5v14M5 12h14"/>', 2),
  back: ic('<path d="M15 5l-7 7 7 7"/>', 2),
  fwd: ic('<path d="M9 5l7 7-7 7"/>', 2),
  reload: ic('<path d="M20 12a8 8 0 11-2.3-5.7M20 4v5h-5"/>', 2),
  lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>', 2),
  puzzle: ic('<path d="M9 4h4v3a2 2 0 104 0h3v5h-2a2 2 0 100 4h2v4H4v-5h2a2 2 0 100-4H4V7h5z"/>'),
  dots: ic('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>', 2.4),
  edit: ic('<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>'),
  wifi: ic('<path d="M3 9a13 13 0 0118 0M6 12.5a9 9 0 0112 0M9 16a5 5 0 016 0"/><circle cx="12" cy="19" r=".6"/>', 2),
  batt: '<svg viewBox="0 0 28 14" aria-hidden="true"><rect x=".7" y=".7" width="23" height="12.6" rx="3.5" fill="none" stroke="currentColor" opacity=".5"/><rect x="2.4" y="2.4" width="16" height="9.2" rx="2" fill="currentColor"/><path d="M25.5 4.5v5c1-.3 1.7-1.3 1.7-2.5s-.7-2.2-1.7-2.5z" fill="currentColor" opacity=".5"/></svg>',
  cc: ic('<rect x="3" y="5" width="18" height="5" rx="2.5"/><rect x="3" y="14" width="18" height="5" rx="2.5"/><circle cx="8" cy="7.5" r="1" fill="currentColor"/><circle cx="16" cy="16.5" r="1" fill="currentColor"/>'),
  trash: ic('<path d="M5 7h14l-1.3 13H6.3zM9 7V4h6v3M3.5 7h17M10 11v6M14 11v6"/>'),
};
const LIGHTS = '<span class="lights"><button type="button" class="l r" aria-label="Fermer"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.6 3.6l4.8 4.8M8.4 3.6L3.6 8.4"/></svg></button><button type="button" class="l y" aria-label="Réduire"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.8 6h6.4"/></svg></button><button type="button" class="l g" aria-label="Agrandir"><svg viewBox="0 0 12 12" aria-hidden="true"><path class="f" d="M3.3 4.6v4.1h4.1zM8.7 7.4V3.3H4.6z"/></svg></button></span>';

const glyph = (stroke: string, sw: number, d: string) => `<svg viewBox="0 0 48 48" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const APPS: Record<AppId, { name: string; menu: string; menus: string[]; icon: string }> = {
  notes: { name: 'Notes', menu: 'Notes', menus: ['Fichier', 'Édition', 'Format', 'Présentation', 'Fenêtre', 'Aide'], icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M0 0h48v15H0z" fill="#fcd34d"/><path d="M0 15h48v.8H0z" fill="#d9a900"/><path d="M9 25h30M9 32h30M9 39h19" stroke="#c9ccd1" stroke-width="1.6"/></svg>' },
  vscode: { name: 'Visual Studio Code', menu: 'Code', menus: ['Fichier', 'Édition', 'Sélection', 'Affichage', 'Exécuter', 'Terminal', 'Fenêtre', 'Aide'], icon: glyph('#fff', 3.4, '<path d="M18 15l-9 9 9 9M30 15l9 9-9 9M27 11l-6 26"/>') },
  terminal: { name: 'Terminal', menu: 'Terminal', menus: ['Shell', 'Édition', 'Présentation', 'Fenêtre', 'Aide'], icon: glyph('#fff', 3.4, '<path d="M11 17l8 6-8 6M23 31h12"/>') },
  claude: { name: 'Claude', menu: 'Claude', menus: ['Fichier', 'Édition', 'Présentation', 'Fenêtre', 'Aide'], icon: glyph('#fff', 3.6, '<path d="M24 10v28M10 24h28M14 14l20 20M34 14L14 34"/>') },
  chatgpt: { name: 'Chrome', menu: 'Chrome', menus: ['Fichier', 'Édition', 'Affichage', 'Historique', 'Favoris', 'Onglet', 'Fenêtre', 'Aide'], icon: glyph('#2563eb', 2.6, '<circle cx="24" cy="24" r="14"/><path d="M10 24h28M24 10c-6 4-6 24 0 28M24 10c6 4 6 24 0 28"/>') },
};
const FINDER_MENUS = ['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'];
const APP_OF: Record<string, AppId> = { claudeKey: 'vscode', readEnv: 'vscode', push: 'terminal', pkg: 'terminal', desktop: 'claude', web: 'chatgpt' };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const h = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const btn = (cls: string, html: string, label?: string) => { const b = h('button', cls, html); b.type = 'button'; if (label) b.setAttribute('aria-label', label); return b; };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = (cs: string, n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (v) => cs[v % cs.length]).join('');
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', Az09 = AZ + 'abcdefghijklmnopqrstuvwxyz0123456789';
const plural = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`);

/** Fausses valeurs du client fictif, tirées dans le navigateur : aucune forme de secret n'est écrite dans le code. */
export const FAKE = {
  stripe: ['sk', 'live', pick(Az09, 24)].join('_'),
  aws: 'AK' + 'IA' + pick(AZ + '234567', 16),
  gh: 'gh' + 'p_' + pick(Az09, 36),
  pgpass: pick('abcdefghijkmnpqrstuvwxyz23456789', 16),
};
const DB_URL = `postgres://admin:${FAKE.pgpass}@db.boulangerie-martin.fr/prod`;
const FILES: Record<string, string> = {
  'deploy.sh': '#!/bin/sh\nset -e\n\n# Déploie la préprod de la boulangerie\necho "Déploiement de la préprod"\ncurl -fsS -X POST "$API/deploy" -d "key=$1"\necho "Terminé"',
  'app.py': 'from flask import Flask\nimport os\n\napp = Flask(__name__)\n\n\n@app.get("/")\ndef index():\n    # Page d\'accueil du site de commande\n    return "Boulangerie Martin"',
  '.env': `STRIPE_KEY=${FAKE.stripe}\nAWS_ACCESS_KEY_ID=${FAKE.aws}\nDATABASE_URL=${DB_URL}`,
  'README.md': '# Boulangerie Martin\n\nSite de commande en ligne.\n\n## Déploiement\n\n`./deploy.sh <clé>`',
};
/** Pour chaque fichier : langage, nom affiché dans la barre d'état, petit signe devant le nom. */
const LANG: Record<string, [string, string, string]> = { 'deploy.sh': ['sh', 'Shell Script', '$'], 'app.py': ['py', 'Python', '◆'], '.env': ['env', 'Dotenv', '⚙'], 'README.md': ['md', 'Markdown', '↓'] };

/* Coloration syntaxique minimale : une liste de motifs par langage, appliquée ligne par ligne. */
const RULES: Record<string, [RegExp, string][]> = {
  sh: [[/#.*/, 'c'], [/"(?:[^"\\]|\\.)*"|'[^']*'/, 's'], [/\$\{?\w+\}?/, 'v'], [/\b(?:set|echo|curl|if|then|fi|exit|export)\b/, 'f'], [/(?<=\s)-{1,2}[\w-]+/, 'n']],
  py: [[/#.*/, 'c'], [/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, 's'], [/@[\w.]+/, 'f'], [/\b(?:from|import|def|return|if|else|class|as)\b/, 'k'], [/\b[A-Za-z_]\w*(?=\()/, 'f'], [/\b\d+\b/, 'n']],
  env: [[/^[A-Z_][A-Z0-9_]*(?==)/, 'v'], [/(?<==).+/, 's']],
  md: [[/^#+ .*/, 'h'], [/`[^`]+`/, 's']],
};
const highlight = (lang: string, line: string) => {
  const rules = RULES[lang];
  if (!rules) return esc(line);
  const re = new RegExp(rules.map(([r]) => `(${r.source})`).join('|'), 'g');
  let out = '', at = 0;
  for (const m of line.matchAll(re)) {
    const i = m.slice(1).findIndex((g) => g !== undefined), start = m.index ?? 0;
    out += `${esc(line.slice(at, start))}<span class="t-${rules[i][1]}">${esc(m[0])}</span>`;
    at = start + m[0].length;
  }
  return out + esc(line.slice(at));
};

/** Un substitut, affiché tel que le moteur le rend (son texte exact), sous forme de puce. */
const chip = (text: string) => `<span class="subst">${esc(text)}</span>`;
/** Le texte tel que l'IA le reçoit. */
const renderPieces = (a: Analysis) => a.pieces.map((p) => (p.masked ? chip(p.text) : esc(p.text))).join('');
/** Une intervention d'Aparté dans une conversation. */
const flag = (html: string) => `${LOGO}<span><b>Aparté</b> ${html}</span>`;

/** Écrit un texte au fil de l'eau, comme une réponse d'IA (d'un seul coup si l'animation est réduite). */
async function stream(el: HTMLElement, text: string, after?: () => void) {
  if (calm()) { el.append(text); after?.(); return; }
  for (const part of text.match(/\S+\s*/g) ?? []) { el.append(part); after?.(); await wait(18 + Math.random() * 34); }
  el.normalize();
}

export class Desktop {
  private z = 10;
  private wins = new Map<AppId, HTMLElement>();
  private front: AppId | null = null;
  private journal: { kind: Kind; label: string; text: string; at: string }[] = [];
  private toasts: HTMLElement;
  private menu: HTMLElement;
  private drop: HTMLElement;
  private dropFor: HTMLElement | null = null;
  private barLeft!: HTMLElement;
  private apBtn!: HTMLButtonElement;
  private dockEl: HTMLElement;
  private pending: null | (() => void) = null;
  private readonly off = new AbortController();
  private timer = 0;
  private ro: ResizeObserver;
  readonly api: Record<string, () => void> = {};

  constructor(private readonly desk: HTMLElement) {
    desk.innerHTML = '';
    desk.append(this.menubar());
    this.menu = h('div', 'apmenu'); this.menu.setAttribute('role', 'dialog'); this.menu.setAttribute('aria-label', 'Aparté');
    this.drop = h('div', 'mdrop'); this.drop.setAttribute('role', 'menu');
    this.toasts = h('div', 'toasts'); this.toasts.setAttribute('aria-live', 'polite');
    this.dockEl = this.dock();
    desk.append(this.menu, this.drop, this.toasts, this.dockEl);
    this.ro = new ResizeObserver(() => { const w = desk.clientWidth; desk.classList.toggle('small', w < 700); desk.classList.toggle('mid', w >= 700 && w < 920); });
    this.ro.observe(desk);
    const signal = this.off.signal;
    document.addEventListener('pointerdown', (e) => {
      const t = e.target as HTMLElement;
      if (!this.menu.contains(t) && !t.closest('.apbtn')) this.closeApMenu();
      if (!this.drop.contains(t) && !t.closest('.mb')) this.closeDrop();
    }, { signal });
    desk.addEventListener('keydown', (e) => { if (e.key === 'Escape') { this.closeApMenu(); this.closeDrop(); } }, { signal });
    this.renderBar();
  }

  /** À appeler quand la section est démontée. */
  destroy() { this.off.abort(); clearInterval(this.timer); this.ro.disconnect(); }

  /* ---------- barre de menus ---------- */
  private menubar() {
    const bar = h('div', 'menubar', `<span class="apple" aria-hidden="true"></span><div class="mleft"></div>
      <div class="mright"><button class="apbtn" type="button" aria-haspopup="dialog" aria-expanded="false">${LOGO}<span class="aps">Aparté</span></button><span class="mi" aria-hidden="true">${I.wifi}</span><span class="mi batt" aria-hidden="true">${I.batt}</span><span class="mi" aria-hidden="true">${I.cc}</span><span class="clock"></span></div>`);
    this.barLeft = bar.querySelector('.mleft') as HTMLElement;
    this.apBtn = bar.querySelector('.apbtn') as HTMLButtonElement;
    const clock = bar.querySelector('.clock') as HTMLElement;
    const tick = () => {
      const d = new Date();
      clock.innerHTML = `<span class="cdate">${esc(d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }))}</span> ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    };
    tick(); this.timer = window.setInterval(tick, 20_000);
    const st = bar.querySelector('.aps') as HTMLElement;
    onEngineState((s) => { st.textContent = s === 'ready' ? 'Aparté' : s === 'failed' ? 'Aparté · indisponible' : 'Aparté · démarrage…'; this.apBtn.classList.toggle('busy', s !== 'ready'); this.desk.dataset.engine = s; });
    this.apBtn.addEventListener('click', () => { this.closeDrop(); const open = !this.menu.classList.contains('open'); if (open) this.renderMenu(); this.menu.classList.toggle('open', open); this.apBtn.setAttribute('aria-expanded', String(open)); });
    return bar;
  }

  private closeApMenu() { this.menu.classList.remove('open'); this.apBtn.setAttribute('aria-expanded', 'false'); }
  private closeDrop() { this.drop.classList.remove('open'); this.dropFor?.classList.remove('on'); this.dropFor = null; }

  /** Nom et menus de l'application au premier plan (Finder quand aucune fenêtre n'est ouverte). */
  private renderBar() {
    this.closeDrop();
    const app = this.front ? APPS[this.front] : null;
    this.barLeft.innerHTML = '';
    [app?.menu ?? 'Finder', ...(app?.menus ?? FINDER_MENUS)].forEach((label, i) => {
      const b = btn(i ? 'mb' : 'mb b', esc(label));
      b.setAttribute('aria-haspopup', 'menu');
      const kind = i ? label : 'app';
      b.addEventListener('click', () => (this.dropFor === b ? this.closeDrop() : this.openDrop(b, kind)));
      b.addEventListener('pointerenter', () => { if (this.dropFor && this.dropFor !== b) this.openDrop(b, kind); });
      this.barLeft.append(b);
    });
  }

  private dropItems(kind: string): MenuItem[] {
    const id = this.front, n = id ? APPS[id].menu : 'Finder';
    const w = id ? this.wins.get(id) : undefined;
    const act = (f: (id: AppId) => void) => (id && w ? () => f(id) : undefined);
    if (kind === 'app') return [{ label: id ? `À propos de ${n}` : 'À propos de ce Mac' }, null, { label: `Masquer ${n}`, key: '⌘H', run: act((a) => this.minimize(a)) }, { label: `Quitter ${n}`, key: '⌘Q', run: act((a) => this.close(a)) }];
    if (kind === 'Fichier' || kind === 'Shell') return [{ label: 'Fermer la fenêtre', key: '⌘W', run: act((a) => this.close(a)) }];
    if (kind === 'Fenêtre') return [{ label: 'Réduire', key: '⌘M', run: act((a) => this.minimize(a)) }, { label: 'Agrandir', run: act(() => w?.classList.toggle('max')) }, null,
      ...[...this.wins.keys()].map((k) => ({ label: APPS[k].name, checked: k === id, run: () => { this.open(k); } }))];
    return [{ label: 'Non disponible dans la démonstration' }];
  }

  private openDrop(b: HTMLElement, kind: string) {
    this.closeDrop(); this.closeApMenu();
    this.drop.innerHTML = '';
    for (const it of this.dropItems(kind)) {
      if (!it) { this.drop.append(h('hr')); continue; }
      const row = btn('', `<span class="ck">${it.checked ? '✓' : ''}</span><span>${esc(it.label)}</span><kbd>${it.key ?? ''}</kbd>`);
      row.setAttribute('role', 'menuitem'); row.disabled = !it.run;
      row.addEventListener('click', () => { this.closeDrop(); it.run?.(); });
      this.drop.append(row);
    }
    this.drop.style.left = `${Math.max(4, b.offsetLeft + this.barLeft.offsetLeft - 6)}px`;
    this.drop.classList.add('open'); b.classList.add('on'); this.dropFor = b;
  }

  /* ---------- menu Aparté, journal, notifications ---------- */
  private renderMenu() {
    const n = (k: Kind) => this.journal.filter((j) => j.kind === k).length;
    const st = this.desk.dataset.engine;
    const head = st === 'ready' ? ['on', 'Aparté actif', 'protection complète'] : st === 'failed' ? ['ko', 'Aparté indisponible', 'envois bloqués'] : ['', 'Aparté démarre…', 'envois retenus'];
    this.menu.innerHTML = `<div class="mh"><i class="${head[0]}"></i><b>${head[1]}</b><span>${head[2]}</span></div>
      <div class="mstats"><div><b>${n('ok')}</b>masqués</div><div><b>${n('ko')}</b>bloqués</div><div><b>${this.pending ? 1 : 0}</b>en attente</div></div>
      <div class="mt">Journal</div>
      <div class="mlist">${this.journal.length ? this.journal.slice(-6).reverse().map((j) => `<div class="mrow"><span class="k ${j.kind}">${j.label}</span><span>${esc(j.text)}</span><time>${j.at}</time></div>`).join('') : '<div class="mrow empty">Rien pour l\'instant. Essayez de coller une clé dans une IA.</div>'}</div>
      <div class="mfoot">Le journal garde la décision, jamais le contenu.<br>Analyse faite dans cette page, sans réseau.</div>`;
  }

  log(kind: Kind, label: string, text: string) {
    this.journal.push({ kind, label, text, at: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
    if (this.menu.classList.contains('open')) this.renderMenu();
    this.apBtn.classList.remove('ping'); void this.apBtn.offsetWidth; this.apBtn.classList.add('ping');
  }

  /** Notification macOS, en haut à droite. */
  notify(kind: Kind, title: string, body: string) {
    const t = h('div', `toast ${kind}`, `<span class="ti">${LOGO}</span><div><div class="th"><span>Aparté</span><time>maintenant</time></div><b>${esc(title)}</b><p>${esc(body)}</p></div>`);
    this.toasts.prepend(t);
    while (this.toasts.children.length > 3) this.toasts.lastElementChild!.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, this.desk.classList.contains('small') ? 3600 : 5200);
  }

  /* ---------- Dock ---------- */
  private dock() {
    const d = h('div', 'dock');
    d.setAttribute('role', 'toolbar'); d.setAttribute('aria-label', 'Dock');
    for (const id of Object.keys(APPS) as AppId[]) {
      const b = btn(`app a-${id}`, `<span class="ico">${APPS[id].icon}</span><em>${APPS[id].name}</em>`, APPS[id].name);
      b.dataset.app = id;
      b.addEventListener('click', () => { b.classList.remove('hop'); void b.offsetWidth; if (!this.wins.has(id)) b.classList.add('hop'); this.open(id); });
      d.append(b);
    }
    const trash = h('span', 'app a-trash', `<span class="ico">${I.trash}</span>`);
    trash.setAttribute('aria-hidden', 'true');
    d.append(h('span', 'dsep'), trash);
    // Grossissement au survol, à la souris seulement.
    const apps = () => [...d.querySelectorAll<HTMLElement>('.app')];
    d.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || calm() || this.desk.classList.contains('small')) return;
      for (const a of apps()) {
        const r = a.getBoundingClientRect(), dist = Math.min(Math.abs(e.clientX - (r.left + r.width / 2)), 120);
        a.style.setProperty('--m', (1 + 0.5 * Math.cos((dist / 120) * (Math.PI / 2)) ** 2).toFixed(3));
      }
    });
    d.addEventListener('pointerleave', () => apps().forEach((a) => a.style.removeProperty('--m')));
    return d;
  }

  private markRunning() { this.dockEl.querySelectorAll<HTMLElement>('.app').forEach((b) => b.classList.toggle('run', this.wins.has(b.dataset.app as AppId))); }

  /* ---------- fenêtres ---------- */
  open(id: AppId): HTMLElement {
    let w = this.wins.get(id);
    if (!w) { w = this.build(id); w.dataset.app = id; this.wins.set(id, w); this.desk.append(w); this.markRunning(); }
    w.classList.remove('min'); this.focus(w);
    return w;
  }

  private focus(w: HTMLElement | null) {
    if (w) w.style.zIndex = String(++this.z);
    this.desk.querySelectorAll('.win').forEach((x) => x.classList.toggle('focused', x === w));
    const id = (w?.dataset.app as AppId | undefined) ?? null;
    if (id !== this.front) { this.front = id; this.renderBar(); }
  }

  /** Après une fermeture ou une réduction : la fenêtre visible la plus haute passe au premier plan. */
  private focusTop() {
    const top = [...this.wins.values()].filter((w) => !w.classList.contains('min')).sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
    this.focus(top ?? null);
  }
  private close(id: AppId) { this.wins.get(id)?.remove(); this.wins.delete(id); this.markRunning(); this.focusTop(); }
  private minimize(id: AppId) { this.wins.get(id)?.classList.add('min'); this.focusTop(); }

  private frame(id: AppId, title: string, geo: [number, number, number, number], extra = '') {
    const w = h('section', `win w-${id} ${extra}`);
    w.setAttribute('aria-label', APPS[id].name);
    const [l, t, wd, ht] = geo;
    Object.assign(w.style, { left: `${l}%`, top: `${t}%`, width: `${wd}%`, height: `${ht}%` });
    const tb = h('header', 'tb', `${LIGHTS}<span class="tt">${esc(title)}</span>`);
    w.append(tb);
    const small = () => this.desk.classList.contains('small');
    tb.querySelector('.r')!.addEventListener('click', () => this.close(id));
    tb.querySelector('.y')!.addEventListener('click', () => this.minimize(id));
    tb.querySelector('.g')!.addEventListener('click', () => w.classList.toggle('max'));
    tb.addEventListener('dblclick', (e) => { if (!(e.target as HTMLElement).closest('button') && !small()) w.classList.toggle('max'); });
    w.addEventListener('pointerdown', () => { if (!w.classList.contains('focused')) this.focus(w); });
    // Déplacement par la barre de titre (pas en petit écran : les fenêtres y sont plein écran).
    tb.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button') || small() || w.classList.contains('max')) return;
      const r = this.desk.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop;
      tb.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        const x = Math.min(Math.max(ox + ev.clientX - sx, -w.offsetWidth + 80), r.width - 80);
        const y = Math.min(Math.max(oy + ev.clientY - sy, 25), r.height - 60);
        w.style.left = `${x}px`; w.style.top = `${y}px`;
      };
      const up = () => { tb.removeEventListener('pointermove', move); tb.removeEventListener('pointerup', up); tb.removeEventListener('pointercancel', up); };
      tb.addEventListener('pointermove', move); tb.addEventListener('pointerup', up); tb.addEventListener('pointercancel', up);
    });
    return w;
  }

  private build(id: AppId): HTMLElement {
    switch (id) {
      case 'notes': return this.notes();
      case 'vscode': return this.vscode();
      case 'terminal': return this.terminal();
      case 'claude': return this.claudeApp();
      default: return this.browser();
    }
  }

  /* ---------- composant de discussion ---------- */
  private chat(host: HTMLElement, o: { variant: string; placeholder: string; empty: string; bar?: string; onSend: (text: string, ui: ChatUi) => Promise<boolean> }): ChatUi {
    const box = h('div', `chat v-${o.variant}`);
    const hello = `<div class="hello">${o.empty}</div>`;
    const list = h('div', 'msgs', hello);
    list.setAttribute('role', 'log'); list.setAttribute('aria-live', 'polite');
    const form = h('form', 'composer');
    const ta = h('textarea');
    ta.rows = 1; ta.placeholder = o.placeholder; ta.spellcheck = false; ta.setAttribute('aria-label', o.placeholder);
    const send = h('button', 'send', I.up); send.type = 'submit'; send.setAttribute('aria-label', 'Envoyer');
    const bar = h('div', 'cbar', o.bar ?? '');
    bar.append(send);
    const chips = h('div', 'pastes', '<span>Coller :</span>');
    const grow = () => { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`; };
    const pasteables: [string, string][] = [['clé Stripe', FAKE.stripe], ['clé AWS', FAKE.aws], ['URL de base', DB_URL]];
    for (const [label, v] of pasteables) {
      const c = btn('', label, `Coller une fausse valeur : ${label}`);
      c.addEventListener('click', () => { ta.value = (ta.value ? ta.value + ' ' : '') + v; grow(); ta.focus({ preventScroll: true }); });
      chips.append(c);
    }
    form.append(ta, bar);
    box.append(list, chips, form);
    host.append(box);
    const bottom = () => { list.scrollTop = list.scrollHeight; };
    const push = <T extends HTMLElement>(m: T) => { list.querySelector('.hello')?.remove(); list.append(m); bottom(); return m; };
    const ui: ChatUi = {
      // Un message « me » est un message parti : la zone de saisie se vide à ce moment-là.
      add: (cls, html) => { if (cls === 'me') { ta.value = ''; grow(); } return push(h('div', `m ${cls}`, html)); },
      say: async (text) => { await stream(ui.add('ai', ''), text, bottom); },
      typing: async (ms = 700) => { const t = ui.add('typing', '<i></i><i></i><i></i><span>Réflexion…</span>'); await wait(ms); t.remove(); },
      tool: (name, arg) => {
        const d = push(h('details', 'm toolb', `<summary><b>${esc(name)}</b><code>${arg}</code></summary><div class="io"><div><span>IN</span><code>${arg}</code></div></div>`));
        d.open = true;
        return (html, state) => { d.querySelector('.io')!.append(h('div', '', `<span>OUT</span><code>${html}</code>`)); d.classList.add(state); bottom(); };
      },
      clear: () => { list.innerHTML = hello; },
      input: ta,
      submit: (text?: string) => { if (text !== undefined) { ta.value = text; grow(); } form.requestSubmit(); },
    };
    let busy = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text || busy) return;
      busy = true; send.disabled = true;
      try { await o.onSend(text, ui); } finally { busy = false; send.disabled = false; }
    });
    ta.addEventListener('input', grow);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
    return ui;
  }

  /** Échec fermé : si le moteur n'a pas pu analyser, rien ne part. */
  private failClosed(ui: ChatUi, where: string) {
    ui.add('flag ko', flag('Analyse impossible : envoi bloqué. Rien ne part sans avoir été vérifié.'));
    this.notify('ko', 'Envoi bloqué', `Analyse impossible · ${where}`);
    this.log('ko', 'bloqué', `analyse impossible · ${where}`);
    return false;
  }

  /* ---------- Notes ---------- */
  private notes() {
    const w = this.frame('notes', 'Notes', [1.5, 9, 27, 73]);
    const body = h('div', 'notes');
    const now = new Date();
    body.innerHTML = `<time>${esc(now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</time><h4>Accès client · Boulangerie Martin</h4><p class="nm">Fausses valeurs, tirées au hasard pour cette page. Copiez-en une, puis collez-la dans une IA.</p>`;
    const rows: [string, string][] = [['Clé Stripe (prod)', FAKE.stripe], ['Accès AWS', FAKE.aws], ['Jeton GitHub', FAKE.gh], ['Base de données', DB_URL]];
    for (const [k, v] of rows) {
      const r = h('div', 'nrow', `<span>${esc(k)}</span><code>${esc(v)}</code>`);
      const b = btn('', 'Copier', `Copier : ${k}`);
      b.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(v); b.textContent = 'Copié'; } catch { b.textContent = 'Sélectionné'; const range = document.createRange(); range.selectNodeContents(r.querySelector('code')!); getSelection()?.removeAllRanges(); getSelection()?.addRange(range); }
        setTimeout(() => { b.textContent = 'Copier'; }, 1400);
      });
      r.append(b); body.append(r);
    }
    w.append(body);
    return w;
  }

  /* ---------- VS Code avec Claude Code et Codex ---------- */
  private vscode() {
    const w = this.frame('vscode', 'boulangerie-martin', [30, 6.5, 68.5, 80], 'dark');
    w.querySelector('.tt')!.innerHTML = `<span class="cmdc">${I.search}boulangerie-martin</span>`;
    const body = h('div', 'vs');
    body.innerHTML = `<nav class="act" aria-label="Barre d'activités"><button type="button" class="on" aria-label="Explorateur" aria-pressed="true">${I.files}</button><span aria-hidden="true">${I.search}</span><span aria-hidden="true">${I.git}</span><span aria-hidden="true">${I.run}</span><span aria-hidden="true">${I.ext}</span><span class="sp"></span><span aria-hidden="true">${I.user}</span><span aria-hidden="true">${I.gear}</span></nav>
      <aside class="ex"><div class="t">Explorateur</div><div class="fold">⌄ boulangerie-martin</div></aside>
      <div class="ed"><div class="etabs" role="tablist" aria-label="Fichiers ouverts"></div><div class="crumb"></div><div class="code" tabindex="0" aria-label="Contenu du fichier"></div></div>
      <div class="side"><div class="stabs" role="tablist"><button type="button" role="tab" class="on" aria-selected="true" data-t="claude">Claude Code</button><button type="button" role="tab" aria-selected="false" data-t="codex">Codex</button></div>
        <div class="spane" data-p="claude"><div class="ph"><span class="spark">${I.spark}</span><b>Claude Code</b><button type="button" aria-label="Nouvelle conversation Claude Code">${I.plus}</button></div></div>
        <div class="spane" data-p="codex" hidden><div class="ph"><b>Codex</b><button type="button" aria-label="Nouvelle conversation Codex">${I.plus}</button></div></div></div>
      <footer class="sbar"><span class="rem" aria-hidden="true">&gt;&lt;</span><span>${I.branch}main</span><span class="opt">${I.sync}</span><span class="opt">⊗ 0 &nbsp;⚠ 0</span><span class="sp"></span><span class="pos">L 1, col 1</span><span class="opt">Espaces : 2</span><span class="opt">UTF-8</span><span class="opt">LF</span><span class="lang"></span><span class="sap">${LOGO}<span></span></span></footer>`;
    w.append(body);
    const q = <T extends HTMLElement = HTMLElement>(s: string) => body.querySelector(s) as T;
    const ex = q('.ex'), etabs = q('.etabs'), code = q('.code'), pos = q('.pos');
    onEngineState((s) => { q('.sap span').textContent = s === 'ready' ? 'Aparté actif' : s === 'failed' ? 'Aparté indisponible' : 'Aparté démarre…'; q('.sap').classList.toggle('off', s !== 'ready'); });
    const exBtn = q<HTMLButtonElement>('.act button');
    exBtn.addEventListener('click', () => { const hide = body.classList.toggle('noex'); exBtn.classList.toggle('on', !hide); exBtn.setAttribute('aria-pressed', String(!hide)); });

    const open: string[] = ['deploy.sh', 'app.py'];
    let current = '';
    const fi = (f: string) => `<i class="fi f-${LANG[f][0]}">${LANG[f][2]}</i>`;
    const setPos = (ln: number, col: number) => { pos.textContent = `L ${ln}, col ${col}`; code.querySelectorAll('.ln').forEach((x, i) => x.classList.toggle('cur', i === ln - 1)); };
    const openFile = async (name: string) => {
      if (!open.includes(name)) open.push(name);
      current = name;
      ex.querySelectorAll<HTMLElement>('[data-f]').forEach((d) => d.classList.toggle('sel', d.dataset.f === name));
      etabs.innerHTML = '';
      for (const f of open) {
        const tab = h('div', `etab${f === name ? ' on' : ''}`);
        const tn = btn('tn', `${fi(f)}${esc(f)}`); tn.setAttribute('role', 'tab'); tn.setAttribute('aria-selected', String(f === name));
        tn.addEventListener('click', () => void openFile(f));
        const tx = btn('tx', '×', `Fermer ${f}`);
        tx.addEventListener('click', () => { if (open.length < 2) return; open.splice(open.indexOf(f), 1); void openFile(f === current ? open[open.length - 1] : current); });
        tab.append(tn, tx); etabs.append(tab);
      }
      q('.crumb').innerHTML = `boulangerie-martin <span>›</span> ${fi(name)}${esc(name)}`;
      q('.lang').textContent = LANG[name][1];
      code.innerHTML = FILES[name].split('\n').map((line, i) => `<div class="ln"><span class="no">${i + 1}</span><span class="lt">${highlight(LANG[name][0], line) || ' '}</span></div>`).join('');
      code.scrollTop = 0;
      setPos(1, 1);
      if (name === '.env') {
        const a = await analyse(FILES[name]);
        if (current !== name) return;
        code.prepend(h('div', 'banner', `${LOGO}<span>${a.ok ? `Aparté : ${plural(a.count, 'secret', 'secrets')} dans ce fichier (${esc(a.labels.join(', '))}). Sa lecture par un agent est refusée.` : 'Aparté : analyse impossible. Par prudence, la lecture de ce fichier par un agent est refusée.'}</span>`));
      }
    };
    code.addEventListener('click', (e) => {
      const ln = (e.target as HTMLElement).closest<HTMLElement>('.ln');
      if (!ln) return;
      const lt = ln.querySelector('.lt')!, sel = getSelection();
      let col = 1;
      if (sel?.focusNode && lt.contains(sel.focusNode)) { const r = document.createRange(); r.setStart(lt, 0); r.setEnd(sel.focusNode, sel.focusOffset); col = r.toString().length + 1; }
      setPos([...code.querySelectorAll('.ln')].indexOf(ln) + 1, col);
    });
    for (const f of Object.keys(FILES)) { const d = btn('', `${fi(f)}${esc(f)}`); d.dataset.f = f; d.addEventListener('click', () => void openFile(f)); ex.append(d); }
    void openFile('deploy.sh');

    const tabs = body.querySelectorAll<HTMLButtonElement>('.stabs button');
    tabs.forEach((b) => b.addEventListener('click', () => { tabs.forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', String(x === b)); }); body.querySelectorAll<HTMLElement>('.spane').forEach((p) => { p.hidden = p.dataset.p !== b.dataset.t; }); }));
    const claude = this.chat(q('[data-p="claude"]'), {
      variant: 'cc', placeholder: 'Demandez à Claude…', bar: '<span class="mode">Demander avant de modifier</span>',
      empty: `<span class="spark big">${I.spark}</span><b>Claude Code</b><span>Collez une clé dans votre demande, ou demandez de lire le .env.</span>`,
      onSend: (t, ui) => this.agent(t, ui, 'Claude Code', true),
    });
    const codex = this.chat(q('[data-p="codex"]'), {
      variant: 'cx', placeholder: 'Demandez à Codex…', bar: '<span class="ctx">@ projet</span><span class="mode">Agent · local</span>',
      empty: '<b>Codex</b><span>Avec Codex, un envoi qui contient un secret est bloqué.</span>',
      onSend: (t, ui) => this.agent(t, ui, 'Codex', false),
    });
    q('[data-p="claude"] .ph button').addEventListener('click', () => claude.clear());
    q('[data-p="codex"] .ph button').addEventListener('click', () => codex.clear());
    this.api.claudeKey = () => { tabs[0].click(); claude.submit(`Déploie la préprod avec la clé ${FAKE.stripe}`); };
    this.api.readEnv = () => { tabs[1].click(); codex.submit('Vérifie la connexion à la base, tout est dans le .env'); };
    return w;
  }

  /** Agent de code : Claude Code masque (expurgation réversible), Codex bloque. */
  private async agent(text: string, ui: ChatUi, who: 'Claude Code' | 'Codex', reversible: boolean): Promise<boolean> {
    const a = await analyse(text);
    if (!a.ok) return this.failClosed(ui, who);
    if (a.count && !reversible) {
      ui.add('me struck', esc(text));
      ui.add('flag ko', flag(`Envoi refusé : ${esc(a.labels.join(', '))}. Rien n'est parti. Utilisez une variable d'environnement plutôt que la valeur.`));
      this.notify('ko', 'Envoi bloqué', `${a.labels.join(', ')} · ${who}`); this.log('ko', 'bloqué', `${a.labels[0]} · ${who}`);
      return false;
    }
    ui.add('me', a.count ? renderPieces(a) : esc(text));
    if (a.count) {
      ui.add('flag ok', flag(`${plural(a.count, 'secret masqué', 'secrets masqués')} avant l'envoi. L'IA reçoit le substitut, la vraie valeur reste sur votre poste.`));
      this.notify('ok', 'Secret masqué', `${a.labels.join(', ')} · ${who}`); this.log('ok', 'masqué', `${a.labels[0]} · ${who}`);
    }
    await ui.typing();
    if (/\.env|config|connexion|base/i.test(text) && !a.count) {
      await ui.say('Je regarde la configuration du projet.');
      const out = ui.tool('Read', '.env');
      const env = await analyse(FILES['.env']);
      await wait(400);
      out(env.ok ? `Refusé par Aparté : .env contient ${plural(env.count, 'secret', 'secrets')} (${esc(env.labels.join(', '))}).` : 'Refusé par Aparté : analyse impossible, lecture bloquée.', 'err');
      ui.add('flag ko', flag('Lecture de .env refusée : son contenu ne part pas vers l\'IA.'));
      this.notify('ko', 'Lecture bloquée', `.env · ${who}`); this.log('ko', 'bloqué', `lecture de .env · ${who}`);
      await ui.typing(500);
      await ui.say('Je ne peux pas lire .env. Je teste la connexion avec la variable DATABASE_URL déjà définie dans votre environnement, sans en afficher la valeur.');
      return true;
    }
    if (a.count && /d[ée]plo|deploy|lance/i.test(text)) {
      const sub = a.pieces.find((p) => p.masked);
      await ui.say('Je lance le script de déploiement de la préprod.');
      const out = ui.tool('Bash', `./deploy.sh ${chip(sub?.text ?? 'secret')}`);
      await wait(700);
      ui.add('flag ok', flag('Exécution sur votre poste : la vraie valeur est remise dans la commande, sans passer par l\'IA.'));
      await wait(500);
      out('Déploiement de la préprod\nTerminé', 'done');
      await ui.say('La préprod est déployée. Le script s\'est terminé sans erreur.');
      return true;
    }
    await ui.say(a.count ? 'C\'est noté. Je travaille avec le substitut, sans connaître la vraie valeur.' : 'D\'accord, je m\'en occupe. Dites-moi si vous voulez que je commence par un fichier précis.');
    return true;
  }

  /* ---------- Terminal : zsh, puis Claude Code en ligne de commande ---------- */
  private terminal() {
    const w = this.frame('terminal', '', [9, 15, 66, 68], 'dark');
    const out = h('div', 'term');
    out.setAttribute('role', 'log');
    const line = h('form', 'tline', '<span class="ps"></span><input aria-label="Commande" autocomplete="off" autocapitalize="off" spellcheck="false">');
    const hint = h('div', 'thint', '<span>? pour les raccourcis</span><span>exit pour quitter</span>');
    out.append(line, hint); w.append(out);
    const ps = line.querySelector('.ps') as HTMLElement, input = line.querySelector('input') as HTMLInputElement;
    const ZSH = '<span class="pa">➜</span> <span class="pd">boulangerie-martin</span> <span class="pg">git:(<span class="pb">main</span>)</span>';
    let agentMode = false;
    const setMode = (on: boolean) => { agentMode = on; ps.innerHTML = on ? '&gt;' : ZSH; out.classList.toggle('cc', on); input.placeholder = on ? 'Demandez à Claude…' : ''; w.querySelector('.tt')!.textContent = `boulangerie-martin — ${on ? '✳ claude' : '-zsh'} — 80×24`; };
    setMode(false);
    const bottom = () => { out.scrollTop = out.scrollHeight; };
    const print = (html: string, cls = '') => { const d = h('div', `tl ${cls}`, html); out.insertBefore(d, line); bottom(); return d; };
    const sub = (cls: string, html: string) => print(`<span class="el">⎿</span><span>${html}</span>`, `sub ${cls}`);
    const say = async (text: string) => { const d = print('<span class="bul">●</span><span></span>', 'ai'); await stream(d.lastElementChild as HTMLElement, text, bottom); };
    const tool = (name: string, arg: string) => print(`<span class="bul g">●</span><span><b>${name}</b>(${arg})</span>`, 'ai');
    const clear = () => out.querySelectorAll('.tl').forEach((n) => n.remove());
    print(`Last login: ${esc(new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }))} on ttys001`, 'dim');
    print('# Tapez <b>claude</b> pour lancer l\'agent, ou <b>help</b>.', 'dim');
    w.addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('button') && !getSelection()?.toString()) input.focus({ preventScroll: true }); });

    const run = async (raw: string) => {
      const cmd = raw.replace(/^!\s*/, '');
      print(agentMode ? `<span class="dim">&gt;</span> ${esc(raw)}` : `${ZSH} ${esc(raw)}`, agentMode ? 'you' : '');
      if (/^aparte\s+commande\s+accepter$/i.test(cmd)) {
        if (this.pending) { const p = this.pending; this.pending = null; p(); } else print('aparte : aucune commande en attente.', 'dim');
        return;
      }
      if (!agentMode) {
        const [c, ...rest] = cmd.split(/\s+/);
        if (c === 'help') print('Commandes : <b>claude</b> (agent), <b>ls</b>, <b>cat</b> &lt;fichier&gt;, <b>pwd</b>, <b>git status</b>, <b>aparte journal</b>, <b>clear</b>.', 'dim');
        else if (c === 'ls') print(Object.keys(FILES).filter((f) => rest.some((r) => /^-\w*a/.test(r)) || !f.startsWith('.')).map((f) => (f.endsWith('.sh') ? `<span class="x">${f}*</span>` : f)).join('    '));
        else if (c === 'cat') print(esc(FILES[rest[0]] ?? `cat: ${rest[0] ?? ''}: No such file or directory`));
        else if (c === 'pwd') print('/Users/julie/projets/boulangerie-martin');
        else if (c === 'git' && rest[0] === 'status') print('Sur la branche main\nVotre branche et « origin/main » ont divergé.\nrien à valider, la copie de travail est propre');
        else if (c === 'git') print('git : seule la commande « git status » est disponible dans la démonstration.', 'dim');
        else if (c === 'clear') clear();
        else if (c === 'aparte') print(this.journal.length ? this.journal.map((j) => `${j.at}  ${j.label.padEnd(10)}  ${esc(j.text)}`).join('\n') : 'aparte : journal vide.', 'dim');
        else if (c === 'claude') {
          setMode(true);
          print('<div><span class="or">✻</span> <b>Bienvenue dans Claude Code</b></div><div class="dim">/help pour l\'aide · exit pour quitter</div><div class="dim">cwd : ~/projets/boulangerie-martin</div>', 'ccbox');
          print('Essayez : <i>pousse ma version sur main</i>, <i>ajoute un paquet d\'authentification</i>, ou collez une clé.', 'dim');
        } else if (c) print(`zsh: command not found: ${esc(c)}`);
        return;
      }
      if (cmd === 'exit' || cmd === '/exit') { setMode(false); return; }
      if (cmd === '/help' || cmd === '?') { print('Écrivez votre demande en français. <b>exit</b> pour revenir à zsh, <b>aparte commande accepter</b> pour autoriser une commande suspendue.', 'dim'); return; }
      const a = await analyse(cmd);
      if (!a.ok) { sub('ko', 'Aparté : analyse impossible, envoi bloqué. Rien n\'est parti.'); this.notify('ko', 'Envoi bloqué', 'Analyse impossible · Terminal'); this.log('ko', 'bloqué', 'analyse impossible · Terminal'); return; }
      if (a.count) {
        sub('ok', `Aparté : ${plural(a.count, 'secret masqué', 'secrets masqués')} avant l'envoi. L'IA reçoit :`);
        print(renderPieces(a), 'recv');
        this.notify('ok', 'Secret masqué', `${a.labels.join(', ')} · Terminal`); this.log('ok', 'masqué', `${a.labels[0]} · Terminal`);
      }
      const think = print('<span class="or spin">✻</span> Réflexion…', 'dim');
      await wait(600); think.remove();
      /** Une commande dangereuse : suspendue jusqu'à « aparte commande accepter ». */
      const hold = (command: string, why: string, short: string, done: string, result = '') => {
        tool('Bash', command);
        sub('wait', `Aparté : ${why}. Commande suspendue, en attente de votre accord.`);
        sub('dim', 'Pour l\'autoriser une fois : <b>aparte commande accepter</b>');
        this.notify('wait', 'En attente de votre accord', `${short} · Claude Code`); this.log('wait', 'en attente', `${short} · Claude Code`);
        this.pending = () => { sub('ok', '✓ Autorisé une fois par vous.'); if (result) sub('', result); this.log('pass', 'autorisé', `${short} · votre accord`); void say(done); };
      };
      if (/push|pousse/i.test(cmd)) {
        await say('Le rebase a échoué. Je remplace main par votre version locale.');
        hold('git push --force origin main', 'push forcé sur une branche partagée', 'git push --force sur main', 'C\'est poussé : main correspond maintenant à votre version.', '+ a41c07e...9b2d6f3 main -&gt; main (forced update)');
        return;
      }
      if (/supprim|nettoie|rm -rf/i.test(cmd)) {
        await say('Je supprime les anciens projets pour faire de la place.');
        hold('rm -rf ~/projets/anciens', 'suppression récursive hors du projet', 'rm -rf hors du projet', 'Dossier supprimé.');
        return;
      }
      if (/paquet|install|librair|d[ée]pendance/i.test(cmd)) {
        const name = 'express-sesion-auth-helper';
        await say('J\'ajoute un paquet pour gérer les sessions.');
        tool('Bash', `npm install ${name}`); await wait(300);
        const chk = sub('dim', 'Aparté vérifie le paquet sur le registre npm…');
        let verdict: 'absent' | 'present' | 'unknown' = 'unknown';
        try { const r = await fetch(`https://registry.npmjs.org/${name}`, { method: 'GET' }); verdict = r.status === 404 ? 'absent' : r.ok ? 'present' : 'unknown'; } catch { verdict = 'unknown'; }
        chk.remove();
        if (verdict === 'present') { sub('ok', '✓ Paquet connu du registre, installé.'); return; }
        sub('ko', verdict === 'absent' ? `Aparté : « ${name} » n'existe pas sur npm. Nom probablement inventé par l'IA : installation refusée.` : 'Aparté : vérification impossible, installation refusée.');
        this.notify('ko', 'Paquet refusé', `${name} · ${verdict === 'absent' ? 'inexistant' : 'vérification impossible'}`); this.log('ko', 'bloqué', `${verdict === 'absent' ? 'paquet inexistant' : 'paquet non vérifié'} · Claude Code`);
        await wait(400); await say('Ce paquet a été refusé. J\'utilise express-session, un paquet existant et maintenu.');
        return;
      }
      if (/\.env/i.test(cmd) && !a.count) {
        await say('Je regarde la configuration du projet.');
        tool('Read', '.env'); await wait(400);
        const env = await analyse(FILES['.env']);
        sub('ko', env.ok ? `Aparté : lecture refusée, .env contient ${plural(env.count, 'secret', 'secrets')}.` : 'Aparté : analyse impossible, lecture bloquée.');
        this.notify('ko', 'Lecture bloquée', '.env · Claude Code'); this.log('ko', 'bloqué', 'lecture de .env · Claude Code');
        await say('Je ne peux pas lire .env. Je continue avec les variables déjà définies dans votre environnement.');
        return;
      }
      await say(a.count ? 'Compris. Je travaille avec le substitut, sans connaître la vraie valeur.' : 'D\'accord. Dites-moi ce que vous voulez faire dans ce projet.');
    };
    // Les commandes s'exécutent l'une après l'autre ; l'historique se parcourt avec les flèches.
    let chain: Promise<void> = Promise.resolve();
    const submit = (v: string) => { chain = chain.then(() => run(v)).catch(() => undefined); };
    const hist: string[] = [];
    let at = 0, draft = '';
    line.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); input.value = ''; if (!v) return; if (hist[hist.length - 1] !== v) hist.push(v); at = hist.length; submit(v); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && at > 0) { e.preventDefault(); if (at === hist.length) draft = input.value; input.value = hist[--at]; }
      else if (e.key === 'ArrowDown' && at < hist.length) { e.preventDefault(); at++; input.value = at === hist.length ? draft : hist[at]; }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); clear(); }
    });
    const ask = (q: string) => { if (!agentMode) submit('claude'); submit(q); };
    this.api.push = () => ask('le rebase a échoué, pousse ma version sur main');
    this.api.pkg = () => ask('ajoute un paquet d\'authentification par session');
    return w;
  }

  /* ---------- Claude Desktop ---------- */
  private claudeApp() {
    const w = this.frame('claude', 'Claude', [20, 9, 64, 76], 'warm');
    const body = h('div', 'cd', `<aside><button type="button" class="new">${I.plus}Nouvelle conversation</button><div class="sh">Récents</div><span class="on">Connexion à la base</span><span>Migration base client</span><span>Revue de l'API de commande</span><span>Devis refonte du site</span><div class="me"><i>JM</i>Julie Martin</div></aside><div class="cdm"></div>`);
    w.append(body);
    const ui = this.chat(body.querySelector('.cdm') as HTMLElement, {
      variant: 'cd', placeholder: 'Comment puis-je vous aider ?', bar: `<span class="add" aria-hidden="true">${I.plus}</span>`,
      empty: `<span class="spark big">${I.spark}</span><b>Bonjour, Julie</b><span>Collez une configuration avec un mot de passe pour voir Aparté retenir l'envoi.</span>`,
      onSend: async (text, c) => {
        const a = await analyse(text);
        if (!a.ok) return this.failClosed(c, 'Claude Desktop');
        if (a.count) {
          c.add('flag ko', flag(`Envoi retenu : ${esc(a.labels.join(', '))} dans votre message. Rien n'est parti. Retirez la valeur, puis renvoyez.`));
          this.notify('ko', 'Envoi retenu', `${a.labels.join(', ')} · Claude Desktop`); this.log('ko', 'retenu', `${a.labels[0]} · Claude Desktop`);
          return false;
        }
        c.add('me', esc(text));
        await c.typing(); await c.say('Bien sûr. Pouvez-vous me donner le message d\'erreur complet, sans le mot de passe ? Je regarderai d\'abord l\'hôte et le port.');
        return true;
      },
    });
    body.querySelector('.new')!.addEventListener('click', () => ui.clear());
    this.api.desktop = () => ui.submit(`Pourquoi ma connexion échoue ?\nDATABASE_URL=${DB_URL}`);
    return w;
  }

  /* ---------- Chrome : ChatGPT et Claude.ai, avec l'extension Aparté ---------- */
  private browser() {
    const w = this.frame('chatgpt', '', [10, 7.5, 78, 79], 'chrome');
    const tb = w.querySelector('.tb') as HTMLElement;
    tb.querySelector('.tt')!.remove();
    const sites = [
      { id: 'gpt', tab: 'ChatGPT', url: 'chatgpt.com', where: 'ChatGPT', hello: 'Que puis-je faire pour vous ?', ph: 'Poser une question', side: ['Nouveau chat', 'Rechercher', 'Erreur d\'envoi S3', 'Recette de pain au levain', 'Facture en retard'], reply: 'L\'erreur vient sans doute des droits du compte : vérifiez la politique attachée à cet utilisateur, puis relancez l\'envoi.' },
      { id: 'cl', tab: 'Claude', url: 'claude.ai/new', where: 'Claude.ai', hello: 'Bonjour, Julie', ph: 'Comment puis-je vous aider ?', side: ['Nouvelle conversation', 'Rechercher', 'Plan de migration', 'Relecture du contrat'], reply: 'Je vois deux pistes : les droits du compte, ou la région du compartiment. Commencez par vérifier la politique attachée.' },
    ];
    const tabs = h('div', 'ctabs'); tabs.setAttribute('role', 'tablist');
    const body = h('div', 'br', `<div class="ctool"><span class="nav" aria-hidden="true">${I.back}${I.fwd}${I.reload}</span><div class="omni">${I.lock}<span></span></div><button type="button" class="ext" aria-label="Extension Aparté" aria-expanded="false">${LOGO}<i></i></button><span class="nav" aria-hidden="true">${I.puzzle}${I.dots}</span></div><div class="pages"></div><div class="extpop" role="dialog" aria-label="Extension Aparté" hidden></div>`);
    w.append(body);
    const pages = body.querySelector('.pages') as HTMLElement, pop = body.querySelector('.extpop') as HTMLElement, ext = body.querySelector('.ext') as HTMLButtonElement, url = body.querySelector('.omni span') as HTMLElement;
    let deciding = false, active = sites[0];
    const showPop = (on: boolean) => { pop.hidden = !on; ext.setAttribute('aria-expanded', String(on)); };
    ext.addEventListener('click', () => {
      if (deciding) return;
      pop.innerHTML = `<b>${LOGO}Aparté</b><p><i class="dot"></i>Actif sur ${esc(active.url.split('/')[0])}</p><p class="s">Chaque message est analysé sur votre poste avant l'envoi. Si un secret est détecté, vous choisissez : le masquer, annuler l'envoi ou envoyer quand même.</p>`;
      showPop(pop.hidden);
    });
    body.addEventListener('pointerdown', (e) => { if (!deciding && !pop.contains(e.target as Node) && !(e.target as HTMLElement).closest('.ext')) showPop(false); });
    const uis: Record<string, ChatUi> = {};
    const select = (id: string) => {
      if (deciding) return;
      active = sites.find((s) => s.id === id) ?? sites[0];
      tabs.querySelectorAll<HTMLElement>('.ctab').forEach((t) => { t.classList.toggle('on', t.dataset.s === id); t.setAttribute('aria-selected', String(t.dataset.s === id)); });
      pages.querySelectorAll<HTMLElement>('.page').forEach((p) => { p.hidden = p.dataset.s !== id; });
      url.textContent = active.url; showPop(false);
    };
    for (const s of sites) {
      const t = btn('ctab', `<i class="fav"></i><span>${s.tab}</span>`); t.dataset.s = s.id; t.setAttribute('role', 'tab');
      t.addEventListener('click', () => select(s.id));
      tabs.append(t);
      const page = h('div', `page p-${s.id}`, `<aside>${s.side.map((x, i) => `<span class="${i < 2 ? 'a' : ''}">${i === 0 ? I.edit : i === 1 ? I.search : ''}${esc(x)}</span>`).join('')}</aside><div class="wm"><div class="wh"><b>${s.tab}</b><small>page simulée</small></div></div>`);
      page.dataset.s = s.id; pages.append(page);
      uis[s.id] = this.chat(page.querySelector('.wm') as HTMLElement, {
        variant: `web w-${s.id}`, placeholder: s.ph, bar: `<span class="add" aria-hidden="true">${I.plus}</span>`,
        empty: `<b>${s.hello}</b><span>Collez un journal d'erreur qui contient une clé.</span>`,
        onSend: async (text, c) => {
          const a = await analyse(text);
          if (!a.ok) return this.failClosed(c, s.where);
          if (!a.count) { c.add('me', esc(text)); await c.typing(); await c.say('Voici quelques pistes : vérifiez d\'abord le message d\'erreur exact, puis la configuration du service concerné.'); return true; }
          // L'extension s'ouvre sous son icône et attend le choix : rien n'est parti.
          deciding = true; ext.classList.add('alert');
          pop.innerHTML = `<b>${LOGO}${plural(a.count, 'secret', 'secrets')} dans votre message</b><p>${esc(a.labels.join(', '))}. Le message n'est pas encore parti. Que voulez-vous faire ?</p><div class="row"><button type="button" class="pri" data-c="mask">Masquer et envoyer</button><button type="button" data-c="edit">Annuler l'envoi</button><button type="button" data-c="send">Envoyer quand même</button></div>`;
          showPop(true);
          (pop.querySelector('.pri') as HTMLElement).focus({ preventScroll: true });
          const choice = await new Promise<string>((res) => pop.querySelectorAll<HTMLButtonElement>('[data-c]').forEach((b) => b.addEventListener('click', () => res(b.dataset.c!))));
          deciding = false; ext.classList.remove('alert'); showPop(false);
          if (choice === 'edit') { this.log('ko', 'retenu', `${a.labels[0]} · ${s.where}`); c.input.focus({ preventScroll: true }); return false; }
          c.add('me', choice === 'mask' ? renderPieces(a) : esc(text));
          if (choice === 'mask') c.add('flag ok', flag(`${plural(a.count, 'secret masqué', 'secrets masqués')} : ${s.where} a reçu le substitut, pas la valeur.`));
          this.log(choice === 'mask' ? 'ok' : 'pass', choice === 'mask' ? 'masqué' : 'envoyé', `${a.labels[0]} · ${s.where}${choice === 'send' ? ' · votre choix' : ''}`);
          await c.typing(); await c.say(s.reply);
          return true;
        },
      });
    }
    tb.append(tabs);
    select('gpt');
    this.api.web = () => { select('gpt'); uis.gpt.submit(`Pourquoi cette erreur ?\n[ERROR] S3 upload failed\naws_access_key_id=${FAKE.aws}`); };
    return w;
  }

  /** Lance une démonstration guidée (boutons hors du Mac). */
  run(name: string) {
    const app = APP_OF[name];
    if (!app) return;
    this.open(app);
    this.api[name]?.();
  }
}

interface ChatUi {
  add: (cls: string, html: string) => HTMLElement;
  /** Réponse de l'IA, écrite au fil de l'eau. */
  say: (text: string) => Promise<void>;
  typing: (ms?: number) => Promise<void>;
  /** Bloc d'outil repliable : affiche l'entrée, et rend la fonction qui ajoutera la sortie. */
  tool: (name: string, arg: string) => (html: string, state: string) => void;
  clear: () => void;
  input: HTMLTextAreaElement;
  submit: (text?: string) => void;
}
