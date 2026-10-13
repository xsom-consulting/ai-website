#!/usr/bin/env node
// Captures the real xSOM Fleet console (filled by `fleet-ops demo-data generate`) for the Remotion films and the site.
//
//   node films/scripts/capture-fleet-console.mjs \
//     --fleet "<path to the xsom-fleet repository>" \
//     --url http://localhost:3951 \
//     --code-file <file holding the demonstration code>   (or env FLEET_DEMO_CODE) \
//     --out films/public/screens
//
// Needs: the console built (`pnpm --filter console build` in the Fleet repo), `fleet-server serve` running with
// DEMO_LOGIN_ENABLED=true and CONSOLE_ORIGIN equal to --url, and Chromium installed for the Playwright of the Fleet
// repository (`pnpm exec playwright install chromium` there). Playwright is loaded from the Fleet repository: nothing
// to install here. The demonstration code is never printed and never written in the manifest.
//
// Output: <out>/{fr,en}/<name>.png (viewport 1600x1000 at 2x), <name>-main.png (crop of the main block) and, for short
// pages, <name>-full.png (whole page), plus <out>/manifest.json.
//
// The console has no language switch (French catalogue by default, `contracts/i18n/en.json` not wired). English
// captures patch, in the browser only, the default locale of the built bundle (nothing is written in the Fleet
// repository). API texts that the server renders (error messages) and the demonstration data stay as they are.

import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    fleet: { type: 'string' },
    url: { type: 'string', default: 'http://localhost:3000' },
    'code-file': { type: 'string' },
    out: { type: 'string', default: 'films/public/screens' },
    langs: { type: 'string', default: 'fr,en' },
    month: { type: 'string' },
  },
});

if (!values.fleet) {
  console.error('Usage: capture-fleet-console.mjs --fleet <repo> --url <origin> --code-file <file> [--out <dir>] [--langs fr,en] [--month AAAA-MM]');
  process.exit(1);
}
const code = (values['code-file'] ? readFileSync(values['code-file'], 'utf8') : (process.env.FLEET_DEMO_CODE ?? '')).trim();
if (code === '') {
  console.error('Missing demonstration code: --code-file <file> or env FLEET_DEMO_CODE.');
  process.exit(1);
}

const baseUrl = values.url.replace(/\/$/, '');
const outDir = resolve(values.out);
const languages = values.langs.split(',');
const require = createRequire(join(resolve(values.fleet), 'package.json'));
const { chromium } = require('@playwright/test');

const VIEWPORT = { width: 1600, height: 1000 };
const FULL_PAGE_MAX_HEIGHT = 2600;
const MAIN_CROP_MAX_HEIGHT = 1100;

/** Texts per view and language. `figures` are read from the page itself. */
const VIEWS = [
  {
    name: 'login',
    path: '/',
    anonymous: true,
    page: { fr: 'Connexion de démonstration', en: 'Demonstration sign-in' },
    description: {
      fr: "Écran de connexion de la console, avant la saisie du code de démonstration. Il rappelle que les métriques par Développeur ne servent pas à évaluer les personnes.",
      en: 'Console sign-in screen, before the demonstration code is entered. It states that per-developer metrics are never used to rate people.',
    },
  },
  {
    name: 'provider-orgs',
    path: '/organisations-fournisseur',
    page: { fr: 'Organisations fournisseur', en: 'Provider organizations' },
    ready: '[data-testid="provider-org-row"]',
    description: {
      fr: 'Quatre Organisations fournisseur déclarées (trois Claude Team, un Espace ChatGPT Business) avec leur Plafond de Sièges et les Sièges actifs.',
      en: 'Four declared provider organizations (three Claude Team, one ChatGPT Business space) with their seat cap and active seats.',
    },
    figures: async (page) => page.$$eval('[data-testid="provider-org-row"]', (rows) => rows.map((row) => row.innerText.replace(/\s+/g, ' ').trim())),
  },
  {
    name: 'developers',
    path: '/developpeurs',
    page: { fr: 'Développeurs', en: 'Developers' },
    ready: '[data-testid="developer-row"]',
    description: {
      fr: 'Liste des Développeurs du Groupe : identité SSO, Équipe, adresses chez les Fournisseurs et Sièges. Le haut de la liste de 450 Développeurs.',
      en: 'Developers of the Group: SSO identity, team, provider addresses and seats. The top of the list of 450 developers.',
    },
    figures: async (page) => [`${await page.locator('[data-testid="developer-row"]').count()} developers`],
  },
  {
    name: 'developer-detail',
    page: { fr: 'Fiche d’un Développeur', en: 'Developer sheet' },
    ready: '[data-testid="seat-row"]',
    open: async (page) => {
      await page.goto(`${baseUrl}/developpeurs`);
      await page.waitForSelector('[data-testid="developer-row"]');
      // dev-001 holds a Claude Team seat and a ChatGPT Business seat in the generator profile.
      await page.locator('a', { hasText: 'dev-001@demo.invalid' }).first().click();
    },
    description: {
      fr: 'Fiche d’un Développeur : identité, Équipe, adresses chez les Fournisseurs, ses Sièges (Claude Team Premium, ChatGPT Business Standard) et l’affectation d’un Siège.',
      en: 'Sheet of one developer: identity, team, provider addresses, his seats (Claude Team Premium, ChatGPT Business Standard) and the seat assignment form.',
    },
    figures: async (page) => page.$$eval('[data-testid="seat-row"]', (rows) => rows.map((row) => row.innerText.replace(/\s+/g, ' ').trim())),
  },
  {
    name: 'teams',
    path: '/equipes',
    page: { fr: 'Équipes', en: 'Teams' },
    ready: '[data-testid="team-row"]',
    description: {
      fr: 'Les six Équipes du Groupe de démonstration.',
      en: 'The six teams of the demonstration Group.',
    },
    figures: async (page) => page.$$eval('[data-testid="team-row"]', (rows) => rows.map((row) => row.innerText.replace(/\s+/g, ' ').trim())),
  },
  {
    name: 'coverage',
    path: '/couverture',
    page: { fr: 'Couverture', en: 'Coverage' },
    ready: '[data-testid="coverage-scope-row"]',
    description: {
      fr: 'État du poste par Groupe et par Équipe : 438 Postes sains, 9 dégradés, 3 en échec sur 450 ; liste des Postes en écart avec leurs Motifs.',
      en: 'Workstation state by Group and by team: 438 healthy, 9 degraded, 3 failing out of 450; list of deviating workstations with their reasons.',
    },
    figures: async (page) => page.$$eval('[data-testid="coverage-scope-row"]', (rows) => rows.map((row) => row.innerText.replace(/\s+/g, ' ').trim())),
  },
  ...['developer', 'team', 'group'].map((scope) => ({
    name: `costs-${scope}`,
    path: '/couts',
    page: {
      fr: `Coûts, onglet ${{ developer: 'Développeur', team: 'Équipe', group: 'Groupe' }[scope]}`,
      en: `Costs, ${scope} tab`,
    },
    ready: '[data-testid="costs-row"]',
    open: async (page) => {
      await page.goto(`${baseUrl}/couts`);
      await page.waitForSelector('[data-testid="costs-row"]');
      if (values.month) {
        await page.fill('#costs-month', values.month);
      }
      await page.click(`[data-testid="costs-tab-${scope}"]`);
      await page.waitForSelector(`[data-testid="costs-table"][data-scope="${scope}"]`);
    },
    description: {
      fr: `Facture réelle (Sièges, Dépassements) et, à part, Équivalent API estimé (estimation, Catalogue de prix daté), vue par ${{ developer: 'Développeur', team: 'Équipe', group: 'Groupe' }[scope]}, septembre 2026. Les deux montants ne sont jamais additionnés.`,
      en: `Actual invoice (seats, overages) and, kept apart, estimated API equivalent (estimate, dated price catalog), ${scope} view, September 2026. The two amounts are never added.`,
    },
    figures: async (page) => page.$$eval('[data-testid="costs-row"]', (rows) => rows.slice(0, 3).map((row) => row.innerText.replace(/\s+/g, ' ').trim().slice(0, 240))),
  })),
  {
    name: 'overages',
    path: '/depassements',
    page: { fr: 'Dépassements', en: 'Overages' },
    ready: '[data-testid="overage-row"]',
    description: {
      fr: 'Dépassement saisi pour septembre 2026 sur Claude Team Démo A (1 840,00 $) et formulaire de saisie.',
      en: 'Overage entered for September 2026 on Claude Team Démo A ($1,840.00) and the entry form.',
    },
    figures: async (page) => page.$$eval('[data-testid="overage-row"]', (rows) => rows.map((row) => row.innerText.replace(/\s+/g, ' ').trim())),
  },
  {
    name: 'policy',
    path: '/politique',
    page: { fr: 'Politique', en: 'Policy' },
    ready: '[data-testid="policy-current"]',
    description: {
      fr: 'Politique signée en vigueur (version 1, expiration à 30 jours) et formulaire prérempli : liste blanche MCP, modèles, Pack de règles, durée du hook, contraintes Codex.',
      en: 'Signed policy in force (version 1, expires in 30 days) and the prefilled form: MCP allowlist, models, rule pack, hook timeout, Codex constraints.',
    },
    figures: async (page) => [(await page.locator('[data-testid="policy-current"]').innerText()).replace(/\s+/g, ' ').trim()],
  },
  {
    name: 'policy-preview',
    page: { fr: 'Politique, aperçu avant publication', en: 'Policy, preview before publishing' },
    ready: '[data-testid="policy-preview"]',
    open: async (page) => {
      await page.goto(`${baseUrl}/politique`);
      await page.waitForSelector('[data-testid="policy-current"]');
      await page.waitForSelector('form button[type="submit"]:not([disabled])');
      await page.click('form button[type="submit"]');
      await page.waitForSelector('[data-testid="policy-preview-below"]');
    },
    fullAsPrimary: true,
    cropSelector: '[data-testid="policy-preview"]',
    description: {
      fr: 'Aperçu avant publication : version minimale d’Agent xSOM de la Politique et nombre de Postes sous cette version. Rien n’est publié.',
      en: 'Preview before publishing: minimum xSOM agent version of the policy and how many workstations are below it. Nothing is published.',
    },
    figures: async (page) => [(await page.locator('[data-testid="policy-preview"]').innerText()).replace(/\s+/g, ' ').trim()],
  },
  {
    name: 'block-journal',
    path: '/journal-des-blocages',
    page: { fr: 'Journal des blocages', en: 'Block journal' },
    ready: 'main h1, main h2',
    description: {
      fr: 'Journal des blocages : filtres par période, vérification de la chaîne et Dossier de preuves. Le Groupe de démonstration n’a aucun Événement de blocage : la liste est vide.',
      en: 'Block journal: period filters, chain verification and evidence dossier. The demonstration Group has no block events: the list is empty.',
    },
    figures: async () => [],
  },
];

/** Patches the default locale of the built bundle to English (browser side only). */
async function routeEnglish(context) {
  await context.route('**/assets/index-*.js', async (route) => {
    const response = await route.fetch();
    let body = await response.text();
    let hits = 0;
    body = body
      .replace(/(\(\w+,\w+=)`fr`(\)\{return \w+\[\w+\]\[\w+\]\})/, (...m) => { hits += 1; return `${m[1]}\`en\`${m[2]}`; })
      .replace(/(\(\w+,\w+,\w+=)`fr`(\)\{return \w+\(\w+,\w+\)\.replace)/, (...m) => { hits += 1; return `${m[1]}\`en\`${m[2]}`; });
    if (hits !== 2) {
      throw new Error(`English patch: ${hits}/2 default-locale sites found in the bundle (console build changed?).`);
    }
    await route.fulfill({ response, body });
  });
}

async function settle(page, ready) {
  if (ready) {
    await page.waitForSelector(ready, { timeout: 30_000 });
  }
  await page.waitForLoadState('networkidle');
  // No loading line, no busy control left, fonts ready, then a short pause for the last paint.
  await page.waitForFunction(() => document.querySelector('.loading, [aria-busy="true"]') === null, undefined, { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

async function pageText(page, selector) {
  return page.locator(selector).first().innerText();
}

const manifest = [];
const browser = await chromium.launch();
try {
  for (const lang of languages) {
    const langDir = join(outDir, lang);
    mkdirSync(langDir, { recursive: true });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      locale: lang === 'fr' ? 'fr-FR' : 'en-US',
      timezoneId: 'Europe/Paris',
    });
    if (lang === 'en') {
      await routeEnglish(context);
    }
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));

    // Sign-in screen first (anonymous), then sign in.
    const loginView = VIEWS.find((view) => view.anonymous);
    await page.goto(baseUrl + loginView.path);
    await settle(page, '#demo-code');
    await page.screenshot({ path: join(langDir, `${loginView.name}.png`) });
    manifest.push(entry(loginView, lang, [], 'viewport'));
    await page.fill('#demo-code', code);
    await page.click('button[type="submit"]');
    await page.waitForSelector('nav');

    for (const view of VIEWS.filter((candidate) => !candidate.anonymous)) {
      if (view.open) {
        await view.open(page);
      } else {
        await page.goto(baseUrl + view.path);
      }
      await settle(page, view.ready);
      // The demonstration notice must stay visible in every capture.
      const banner = await page.locator('main').first().evaluate(() => document.body.innerText.includes('Démonstration · données illustratives') || document.body.innerText.includes('Demonstration · illustrative data'));
      if (!banner) {
        console.warn(`[${lang}] ${view.name}: demonstration notice not found in the page text.`);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const figures = view.figures ? await view.figures(page) : [];
      if (view.fullAsPrimary) {
        // The preview sits below the form: the whole page keeps the header and the demonstration notice in frame.
        const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.screenshot({ path: join(langDir, `${view.name}.png`), fullPage: true });
        manifest.push({ ...entry(view, lang, figures, 'full'), height: fullHeight * 2 });
      } else {
        await page.screenshot({ path: join(langDir, `${view.name}.png`) });
        manifest.push(entry(view, lang, figures, 'viewport'));
      }

      const main = await page.locator(view.cropSelector ?? 'main').first().boundingBox();
      if (main) {
        const clip = { x: 0, y: Math.max(0, main.y), width: VIEWPORT.width, height: Math.min(main.height, MAIN_CROP_MAX_HEIGHT) };
        await page.screenshot({ path: join(langDir, `${view.name}-main.png`), clip, fullPage: true });
        manifest.push({ ...entry(view, lang, figures, 'main'), name: `${view.name}-main`, width: VIEWPORT.width * 2, height: Math.round(clip.height * 2) });
      }
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      if (!view.fullAsPrimary && scrollHeight > VIEWPORT.height && scrollHeight <= FULL_PAGE_MAX_HEIGHT) {
        await page.screenshot({ path: join(langDir, `${view.name}-full.png`), fullPage: true });
        manifest.push({ ...entry(view, lang, figures, 'full'), name: `${view.name}-full`, width: VIEWPORT.width * 2, height: scrollHeight * 2 });
      }
      console.log(`[${lang}] ${view.name}`);
    }
    if (problems.length > 0) {
      console.warn(`[${lang}] page errors:\n${problems.join('\n')}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}

function entry(view, lang, figures, kind) {
  return {
    name: view.name,
    view: view.page[lang],
    lang,
    kind,
    width: VIEWPORT.width * 2,
    height: VIEWPORT.height * 2,
    description: view.description[lang],
    keyFigures: figures,
    source: 'xSOM Fleet console, demonstration data (throwaway database)',
  };
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), viewport: VIEWPORT, deviceScaleFactor: 2, screens: manifest }, null, 2)}\n`);
console.log(`${manifest.length} entries, manifest: ${join(outDir, 'manifest.json')}`);
