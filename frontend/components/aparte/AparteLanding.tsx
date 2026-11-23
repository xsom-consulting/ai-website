"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY, SITE_ORIGINS, signupUrl } from "@/lib/sites";
import { loadEngine } from "./engine";
import { Desktop, FAKE } from "./os";

const XSOM = MAIN_SITE_ORIGIN;
const FLEET = SITE_ORIGINS.fleet;
const DOCS = "#essai";

const Logo = ({ color = "currentColor", bar = "#015fce" }: { color?: string; bar?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M3.5 10.5L13 16L3.5 21.5" fill="none" stroke={color} strokeWidth="3.6" />
    <rect x="16.5" y="13.6" width="12.5" height="4.8" rx="1" fill={bar} />
  </svg>
);

type Cat = "sec" | "perso" | "ent" | "act" | "app";
const CATS: Record<Cat, [string, string]> = {
  sec: ["Secrets", "#c2410c"],
  perso: ["Données clients", "#8a5a00"],
  ent: ["Entrées de l'IA", "#015fce"],
  act: ["Actions d'agent", "#146c3e"],
  app: ["Outils", "#0d1116"],
};
/** Ce qu'Aparté protège : règles du moteur et garde-fous du Client Fleet (23/11/2026). */
const ITEMS: [Cat, string, string, boolean?][] = [
  ["sec", "Clé d'accès AWS", "AKIA… · identifiants cloud"], ["sec", "Jeton GitHub", "ghp_… · gho_… · github_pat_…"], ["sec", "Clé secrète Stripe", "sk_live_… · rk_live_…"],
  ["sec", "Clé privée", "PEM, SSH, certificats"], ["sec", "Jeton JWT", "eyJ… · jetons de session"], ["sec", "Jetons de fournisseurs", "paiement, IA, messagerie, cloud : formes connues"],
  ["sec", "Clé d'API générique", "api_key=… · token=…"], ["sec", "Secret à forte entropie", "chaîne aléatoire longue"], ["sec", "URL avec identifiants", "https://user:motdepasse@…"],
  ["sec", "Mot de passe de base de données", "postgres://, mongodb://, mysql://"], ["sec", "Mot de passe dans une affectation", 'password = "…" · DB_PASS=…'], ["sec", "Code à usage unique", "codes de vérification"],
  ["perso", "IBAN et RIB", "clé de contrôle vérifiée"], ["perso", "Carte bancaire", "numéro (Luhn) et cryptogramme"], ["perso", "Numéro de sécurité sociale", "NIR, avec sa clé"],
  ["perso", "SIREN, SIRET, TVA", "numéros d'entreprise vérifiés"], ["perso", "Passeport et identifiants nationaux", "DE, ES, IT, PL, SE, FI, UK"], ["perso", "Numéro de téléphone", "formats français et européens"],
  ["perso", "Adresse e-mail", "à activer dans vos réglages"], ["perso", "Adresse postale", "à activer dans vos réglages"], ["perso", "Adresse IP interne", "10.…, 192.168.…"], ["perso", "Plaque d'immatriculation", "formats européens"],
  ["ent", "Prompt", "ce que vous tapez ou collez"], ["ent", "Fichier lu par l'agent", ".env, config, clés"], ["ent", "Fichier cité par @", "dans le prompt de Claude Code"],
  ["ent", "Commande shell", "arguments de Bash"], ["ent", "Appel d'outil MCP", "arguments envoyés à l'outil"], ["ent", "Instructions cachées", "texte invisible dans un fichier lu"],
  ["ent", "Message dans un chat web", "ChatGPT, Claude.ai"], ["ent", "Pièce jointe", "image, PDF, document Office"],
  ["act", "git push --force", "sur une branche partagée"], ["act", "git reset --hard", "sur une branche déjà poussée"], ["act", "rm -rf hors du projet", "suppression récursive"],
  ["act", "Envoi de fichier vers un hôte inconnu", "curl, scp…"], ["act", "Paquet inexistant", "nom inventé par l'IA"], ["act", "Paquet publié il y a moins de 7 jours", "npm, pnpm, pip, uv, Go, Cargo"],
  ["act", "Paquet avec faille connue", "base OSV"], ["act", "Serveur MCP ou compétence modifié", "empreinte épinglée"], ["act", "Configuration de l'agent modifiée", "réglages surveillés"],
  ["app", "Claude Code", "terminal et VS Code · expurgation réversible"], ["app", "Codex", "terminal · bloque"], ["app", "Claude Desktop", "macOS · bloque"],
  ["app", "ChatGPT", "Chrome, Edge · masque ou bloque"], ["app", "Claude.ai", "Chrome, Edge · masque ou bloque"],
  ["app", "Copilot CLI", "bientôt", true], ["app", "Cursor", "bientôt", true], ["app", "VS Code · Copilot", "bientôt", true], ["app", "Mistral Vibe", "à la demande", true],
];
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const TRIES: [string, string][] = [
  ["claudeKey", "🔑 Une clé dans Claude Code"], ["readEnv", "📄 Codex veut lire le .env"], ["push", "⚠️ Un push forcé"],
  ["pkg", "📦 Un paquet inventé"], ["desktop", "💬 Une config dans Claude Desktop"], ["web", "🌐 Un journal dans ChatGPT"],
];

export function AparteLanding() {
  const mac = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  const exp = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const desktop = useRef<Desktop | null>(null);
  const started = useRef(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat | "">("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [stripe, setStripe] = useState("");

  const start = () => {
    if (started.current || !desktop.current) return;
    started.current = true;
    void loadEngine().catch(() => undefined);
    desktop.current.open("notes");
    desktop.current.open("vscode");
  };

  useEffect(() => {
    if (!desk.current || !mac.current) return;
    desktop.current = new Desktop(desk.current);
    setStripe(FAKE.stripe);
    const el = mac.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Le capot se lève quand le Mac arrive à l'écran ; ouvert, il est à plat et se manipule comme un bureau.
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.75)));
      el.style.setProperty("--open", String(p));
      el.classList.toggle("opened", p >= 1);
      if (p > 0.2) start();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) exp.current?.classList.add("in"); }), { threshold: 0.3 });
    if (exp.current) io.observe(exp.current);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); io.disconnect(); };
  }, []);

  const runTry = (name: string) => {
    start();
    mac.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    desktop.current?.run(name);
  };

  const list = useMemo(() => {
    const t = norm(q.trim());
    return ITEMS.filter(([c, n, e]) => (!cat || c === cat) && (!t || norm(`${n} ${e} ${CATS[c][0]}`).includes(t)));
  }, [q, cat]);

  const openDl = () => { setErr(""); setSent(false); dialog.current?.showModal(); };
  const submitDl = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr("Adresse e-mail invalide."); return; }
    // L'inscription vérifie l'adresse par un lien et crée l'espace ; l'adresse passe dans le fragment, jamais à ce site.
    window.open(signupUrl(email), "_blank", "noopener");
    setSent(true);
  };

  const navLinks = (
    <>
      <a href="#essai">Essayer</a><a href="#expurgation">Expurgation</a><a href="#protege">Ce qu&apos;on protège</a>
      <a href={DOCS}>Docs</a><a href={FLEET}>Entreprises</a>
    </>
  );

  return (
    <div className="ap">
      <div className="maquette">Préproduction · page non publiée</div>
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#" aria-label="Aparté, accueil"><Logo /><b>Aparté</b><small>par xSOM</small></a>
          <nav className="nav" aria-label="Menu">{navLinks}<a className="xsom" href={XSOM}>xSOM Consulting <span>↗</span></a></nav>
          <span className="r">
            <button className="btn sm" type="button" onClick={openDl}>Télécharger <span className="price">0 €</span></button>
            <button className="burger" type="button" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </span>
        </div>
        <nav className={`mnav${menu ? " open" : ""}`} aria-label="Menu mobile" onClick={() => setMenu(false)}>{navLinks}<a className="xsom" href={XSOM}>xSOM Consulting ↗</a></nav>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Gardez votre IA.<br /><span>Rassurez vos clients.</span></h1>
            <p className="lead">Claude Code, Codex, ChatGPT : vous ne codez plus sans. Aparté masque vos secrets avant chaque envoi, sur votre poste, pour que vos clients vous disent oui.</p>
            <div className="cta">
              <button className="btn big" type="button" onClick={openDl}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" /></svg>
                Télécharger <span className="price">0 €</span>
              </button>
              <a className="btn ghost big" href="#essai">Essayer sur un Mac</a>
            </div>
            <div className="sub">macOS · Windows · Linux · sans carte bancaire</div>
            <div className="perks">
              <div className="perk zero"><span className="bigp">0 €</span><b>pour les indépendants</b><span>Protection complète, sans limite de durée.</span></div>
              <a className="perk" href={XSOM}><span className="em" aria-hidden="true">🛡️</span><b>xSOM Consulting</b><span>Télécoms et cybersécurité depuis 2007.</span></a>
              <div className="perk"><span className="em" aria-hidden="true">🇫🇷</span><b>Conçu en France</b><span>Une équipe joignable, en français.</span></div>
              <div className="perk"><span className="em" aria-hidden="true">🇪🇺</span><b>Hébergé dans l&apos;UE</b><span>Vos prompts restent sur votre poste.</span></div>
            </div>
          </div>
        </section>

        <section className="macsec" id="essai">
          <div className="wrap center">
            <h2>Essayez sur ce Mac.</h2>
            <p className="lede">Un vrai bureau : ouvrez les applis du Dock, déplacez les fenêtres, tapez, collez. Le moteur Aparté tourne dans votre navigateur, rien n&apos;est envoyé.</p>
          </div>
          <div className="wrap">
            <div className="mac3d" ref={mac}>
              <div className="hinge">
                <div className="lid">
                  <div className="face front"><div className="screen"><div className="desk" ref={desk} /></div></div>
                  <div className="face back"><Logo color="#5b6470" bar="#5b6470" /></div>
                </div>
              </div>
              <div className="deckwrap"><div className="deck" /></div>
            </div>
            <div className="tries" role="group" aria-label="Essais guidés">
              <span>Ou laissez-vous guider :</span>
              {TRIES.map(([k, label]) => <button key={k} type="button" onClick={() => runTry(k)}>{label}</button>)}
            </div>
          </div>
        </section>

        <section className="block" id="expurgation">
          <div className="wrap">
            <div className="center">
              <h2>L&apos;expurgation : l&apos;IA travaille,<br /><span>sans jamais voir la clé.</span></h2>
              <p className="lede">Bloquer, c&apos;est casser votre élan. Aparté remplace le secret par un substitut, laisse l&apos;IA faire son travail, puis remet la vraie valeur chez vous.</p>
            </div>
            <div className="exp" ref={exp}>
              <div className="st"><span className="n">01 · Vous</span><b>Vous écrivez comme d&apos;habitude</b><div className="ui">déploie avec <span className="real">{stripe || "sk_live_…"}</span></div><span className="who"><i style={{ background: "var(--bloque)" }} />la vraie clé, sur votre poste</span></div>
              <div className="st"><span className="n">02 · Aparté</span><b>Le secret devient un substitut</b><div className="ui">déploie avec sk_live_<span className="tok">[secret masqué par xSOM n°1 : clé secrète Stripe, pas la vraie valeur]</span></div><span className="who"><i style={{ background: "var(--accent)" }} />la correspondance reste sur votre poste</span></div>
              <div className="st"><span className="n">03 · L&apos;IA</span><b>L&apos;IA répond avec le substitut</b><div className="ui">● Bash(./deploy.sh <span className="tok">[secret masqué n°1]</span>)</div><span className="who"><i style={{ background: "var(--accent)" }} />elle n&apos;a jamais vu la valeur</span></div>
              <div className="st"><span className="n">04 · Votre poste</span><b>La vraie clé est remise à l&apos;exécution</b><div className="ui">./deploy.sh <span className="real">•••• vraie clé</span><br /><span className="green">✓ déployé</span></div><span className="who"><i style={{ background: "var(--ok)" }} />la tâche aboutit</span></div>
            </div>
            <div className="split">
              <div className="ia"><b>Ce que voit l&apos;IA</b><ul><li>Votre code, vos questions</li><li>Des substituts qui disent ce qu&apos;ils remplacent, jamais la valeur</li></ul></div>
              <div className="poste"><b>Ce qui reste sur votre poste</b><ul><li>La valeur des clés, jetons, mots de passe</li><li>La correspondance entre substitut et valeur</li></ul></div>
            </div>
            <p className="where">Expurgation réversible avec Claude Code. Dans ChatGPT et Claude.ai, le secret est masqué avant l&apos;envoi. Avec Codex et Claude Desktop, l&apos;envoi est bloqué.</p>
          </div>
        </section>

        <section className="block" id="protege">
          <div className="wrap">
            <div className="center"><h2>Tout ce qu&apos;Aparté protège.</h2><p className="lede">Cherchez une clé, un fichier, une commande ou un outil.</p></div>
            <div className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="AWS, .env, IBAN, git push, Claude Desktop…" aria-label="Rechercher dans ce qu'Aparté protège" autoComplete="off" />
            </div>
            <div className="filters" role="group" aria-label="Catégories">
              <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>Tout</button>
              {(Object.keys(CATS) as Cat[]).map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{CATS[c][0]}</button>)}
            </div>
            <div className="count">{list.length} élément{list.length > 1 ? "s" : ""}</div>
            <ul className="items">
              {list.length ? list.map(([c, n, e, soon]) => (
                <li key={n}><span className="dt" style={{ background: CATS[c][1] }} /><span><span className="nm">{n}</span><span className="ex2">{e}</span></span><span className={`tg${soon ? " soon" : ""}`}>{soon ? "Bientôt" : CATS[c][0]}</span></li>
              )) : <li className="empty">Rien pour « {q} ». <a href={XSOM}>Dites-nous ce qu&apos;il vous faut</a>.</li>}
            </ul>
          </div>
        </section>

        <section className="block">
          <div className="wrap client">
            <div><h2>Vos clients disent <span>oui</span> à l&apos;IA.</h2><p className="lede">Quand ils demandent comment vous utilisez l&apos;IA avec leurs accès, vous montrez votre journal : ce qui a été masqué ou bloqué. Jamais leur code.</p></div>
            <div className="stagebox"><div className="report">
              <div className="rt"><b>Journal · mission client</b><span>novembre</span></div>
              <div className="r"><span>Secrets masqués avant l&apos;envoi</span><b>14</b></div><div className="r"><span>Lectures de fichiers bloquées</span><b>3</b></div>
              <div className="r"><span>Commandes soumises à accord</span><b>2</b></div><div className="r"><span>Contenu transmis à xSOM</span><b>aucun</b></div>
              <div className="foot">Exemple. Attestation mensuelle à transmettre : bientôt.</div>
            </div></div>
          </div>
        </section>

        <div className="wrap">
          <div className="end">
            <div><span className="bigp">0 €</span><h2>pour les indépendants.</h2><p>Protection complète sur votre poste, sans limite de durée, sans carte bancaire.</p><button className="btn light big" type="button" onClick={openDl}>Télécharger <span className="price">0 €</span></button></div>
            <div className="facts">
              <a href={XSOM}><span className="em" aria-hidden="true">🛡️</span><span><b>xSOM Consulting</b>Télécoms et cybersécurité depuis 2007</span></a>
              <div><span className="em" aria-hidden="true">🇫🇷</span><span><b>Conçu en France</b>Une équipe joignable, en français</span></div>
              <div><span className="em" aria-hidden="true">🇪🇺</span><span><b>Espace hébergé dans l&apos;UE</b>Pays-Bas ; vos prompts restent sur votre poste</span></div>
              <a href={SECRET_GUARD_REPOSITORY}><span className="em" aria-hidden="true">🔓</span><span><b>Moteur open source</b>Celui qui tourne dans la démo ci-dessus</span></a>
              <a href={FLEET}><span className="em" aria-hidden="true">🏢</span><span><b>Entreprises : xSOM Fleet</b>Toute une équipe, une console, des preuves</span></a>
            </div>
          </div>
        </div>

        <section className="block" id="faq">
          <div className="wrap">
            <h2 className="center">Questions</h2>
            <div className="faq">
              <details><summary>Vous lisez mes prompts ?</summary><p>Non. L&apos;analyse se fait sur votre poste. Votre espace ne reçoit que les décisions (règle, assistant, heure) et l&apos;état de votre poste, jamais le contenu.</p></details>
              <details><summary>Ça empêche toute fuite ?</summary><p>Non, personne ne peut le promettre. Aparté couvre les outils listés plus haut ; il ne voit pas les agents qui tournent dans le cloud ni un secret de forme inconnue.</p></details>
              <details><summary>Et si Aparté plante ?</summary><p>L&apos;envoi est bloqué, avec le motif. Un contrôle qui laisse passer quand il échoue ne protège de rien.</p></details>
              <details><summary>La démo est-elle truquée ?</summary><p>Non : le Mac ci-dessus utilise le vrai moteur de détection d&apos;Aparté, compilé en WebAssembly, dans votre navigateur. Les réponses des IA sont simulées.</p></details>
              <details><summary>Pourquoi 0 € ?</summary><p>xSOM vit du conseil et de l&apos;offre pour les entreprises. Pour les indépendants, c&apos;est 0 €.</p></details>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap"><span>Aparté par xSOM Consulting · 🇫🇷 France</span>
          <nav><a href={XSOM}>xSOM Consulting</a><a href={FLEET}>xSOM Fleet</a><a href={SECRET_GUARD_REPOSITORY}>Moteur open source</a><a href="/mentions-legales">Mentions légales</a><a href="/confidentialite">Confidentialité</a></nav>
        </div>
      </footer>

      <dialog className="dl" ref={dialog} aria-labelledby="dlTitle" onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <button className="x" type="button" aria-label="Fermer" onClick={() => dialog.current?.close()}>×</button>
        <div className="in">
          {sent ? (
            <div>
              <h3>Vérifiez votre boîte mail</h3>
              <p>La page d&apos;inscription s&apos;est ouverte : confirmez votre adresse avec le lien reçu. Votre espace est créé, puis vous téléchargez Aparté pour votre système.</p>
              <p className="fine">Rien reçu ? Regardez les indésirables, ou <button type="button" className="link" onClick={() => setSent(false)}>changez d&apos;adresse</button>.</p>
            </div>
          ) : (
            <form onSubmit={submitDl}>
              <h3 id="dlTitle">Télécharger Aparté · 0 €</h3>
              <p>Votre adresse crée votre espace. Vous la confirmez par un lien, puis le téléchargement démarre.</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vous@exemple.fr" required aria-label="Adresse e-mail" />
              <button className="btn" type="submit">Continuer</button>
              <p className="err" role="alert">{err}</p>
              <p className="fine">macOS, Windows, Linux. Sans carte bancaire.</p>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
}
