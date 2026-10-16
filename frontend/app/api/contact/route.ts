import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { CONTACT_EMAIL } from "@/lib/site-copy";

export const runtime = "nodejs";

/**
 * Les formulaires de contact des sites xSOM : « Un projet, une question ? » de
 * ai.xsom.fr, et ceux de www.xsom.fr, servi par GitHub Pages sans serveur, qui écrit
 * ici. La demande part par email, envoyée par Resend (API REST, sans SDK), avec
 * l'adresse du visiteur en réponse. Sans `RESEND_API_KEY`, la route répond
 * « indisponible » et les formulaires proposent d'écrire directement.
 *
 * Variables : `RESEND_API_KEY` (clé d'envoi seule), `CONTACT_FROM` (expéditeur sur un
 * domaine vérifié chez Resend, par défaut `xSOM <site@xsom.fr>`), `CONTACT_TO` et
 * `CONTACT_TO_WWW` (destinataires des demandes de ai.xsom.fr et de www.xsom.fr, une
 * ou plusieurs adresses séparées par des virgules ; par défaut, les deux associés),
 * `CONTACT_EXTRA_ORIGINS` (origines de test, séparées par des virgules, traitées comme
 * www.xsom.fr).
 */

type Site = "ai" | "www";

/** Les deux associés reçoivent chaque demande, d'où qu'elle vienne. */
const PARTNERS = ["jean-philippe.talou@xsom.fr", CONTACT_EMAIL];

/** Une liste d'adresses lue dans une variable (séparées par des virgules), sinon `fallback`. */
function recipients(value: string | undefined, fallback: string[]) {
  const list = (value ?? "").split(",").map((address) => address.trim()).filter(Boolean);
  return list.length ? list : fallback;
}

const SITES: Record<Site, { label: string; to: () => string[] }> = {
  ai: { label: "ai.xsom.fr", to: () => recipients(process.env.CONTACT_TO, PARTNERS) },
  www: { label: "www.xsom.fr", to: () => recipients(process.env.CONTACT_TO_WWW, PARTNERS) },
};
const WWW_ORIGINS = ["https://www.xsom.fr", "https://xsom.fr"];

const LIMITS = { name: 120, email: 254, company: 160, subject: 120, message: 4000 } as const;
const MIN_MESSAGE = 10;
const requestTimes = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60_000;
// Une adresse plausible, sans chercher à valider toute la RFC 5322.
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

function clientId(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isRateLimited(request: NextRequest) {
  const now = Date.now();
  const id = clientId(request);
  const recent = (requestTimes.get(id) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  requestTimes.set(id, recent);
  return recent.length > MAX_REQUESTS;
}

/** Le site qui écrit : ai.xsom.fr lui-même, ou www.xsom.fr ; tout autre site est refusé. */
function siteOf(request: NextRequest): Site | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const extra = (process.env.CONTACT_EXTRA_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  if ([...WWW_ORIGINS, ...extra].includes(origin)) return "www";
  try {
    return new URL(origin).host === request.headers.get("host") ? "ai" : null;
  } catch {
    return null;
  }
}

/** Les en-têtes qui laissent www.xsom.fr lire la réponse (CORS) ; rien pour ai.xsom.fr. */
function cors(request: NextRequest, site: Site | null): Record<string, string> {
  if (site !== "www") return {};
  return {
    "Access-Control-Allow-Origin": request.headers.get("origin") ?? "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Un champ texte, borné ; les retours à la ligne sont retirés des champs d'une ligne. */
function field(body: Record<string, unknown>, key: keyof typeof LIMITS, multiline = false) {
  const value = typeof body[key] === "string" ? (body[key] as string).trim() : "";
  const clean = multiline ? value.replace(/\r\n?/g, "\n") : value.replace(/[\r\n\t]+/g, " ");
  return clean.slice(0, LIMITS[key]);
}

/** Le corps, en JSON (fetch) ou en formulaire classique (sans JavaScript). */
async function readBody(request: NextRequest): Promise<{ body: Record<string, unknown> | null; native: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData().catch(() => null);
    return { body: form ? Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)])) : null, native: true };
  }
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  return { body: body && typeof body === "object" ? body : null, native: false };
}

type Outcome = { status: number; detail?: string };

/** `limited` n'est consulté qu'au moment d'envoyer : une demande refusée ne compte pas. */
async function send(site: Site, body: Record<string, unknown> | null, limited: () => boolean): Promise<Outcome> {
  if (!body) return { status: 400, detail: "Invalid request" };
  // Les champs pièges, invisibles pour un visiteur : un robot les remplit, on fait comme si.
  const trap = [body.website, body.botcheck].some((value) => typeof value === "string" ? value.trim() !== "" && value !== "false" : value === true);
  if (trap) return { status: 200 };

  const name = field(body, "name");
  const email = field(body, "email");
  const company = field(body, "company");
  const subject = field(body, "subject");
  const message = field(body, "message", true);
  const lang = body.lang === "en" ? "en" : "fr";
  if (!name || !EMAIL.test(email) || message.length < MIN_MESSAGE) return { status: 400, detail: "Invalid request" };
  if (limited()) return { status: 429, detail: "Too many requests" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: 503, detail: "Contact unavailable" };

  const { label, to } = SITES[site];
  const who = company ? `${name} · ${company}` : name;
  const text = [
    `Nom : ${name}`,
    `Email : ${email}`,
    `Organisation : ${company || "non indiquée"}`,
    ...(subject ? [`Sujet : ${subject}`] : []),
    `Langue : ${lang}`,
    "",
    message,
    "",
    `Envoyé depuis le formulaire de contact de ${label}.`,
  ].join("\n");

  const upstream = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Un double clic ou une nouvelle tentative n'envoie pas deux fois la même demande.
      "Idempotency-Key": `contact/${createHash("sha256").update(`${site}\n${email}\n${message}`).digest("hex").slice(0, 40)}`,
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "xSOM <site@xsom.fr>",
      to: to(),
      reply_to: email,
      subject: `[${label}] ${subject || "Demande de contact"} · ${who}`,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  return upstream?.ok ? { status: 200 } : { status: 502, detail: "Contact unavailable" };
}

/** Le formulaire sans JavaScript revient sur sa page, avec le résultat dans l'adresse. */
function backTo(request: NextRequest, ok: boolean) {
  const origin = request.headers.get("origin") ?? "";
  const referer = request.headers.get("referer");
  const page = referer && referer.startsWith(`${origin}/`) ? new URL(referer) : new URL(`${origin}/`);
  page.searchParams.set("envoi", ok ? "ok" : "erreur");
  return NextResponse.redirect(page, 303);
}

export function OPTIONS(request: NextRequest) {
  const site = siteOf(request);
  return new NextResponse(null, { status: site ? 204 : 403, headers: cors(request, site) });
}

export async function POST(request: NextRequest) {
  const site = siteOf(request);
  if (!site) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  const headers = cors(request, site);
  const { body, native } = await readBody(request);
  const outcome = await send(site, body, () => isRateLimited(request));
  if (native) return backTo(request, outcome.status === 200);
  return outcome.status === 200
    ? NextResponse.json({ ok: true }, { headers })
    : NextResponse.json({ detail: outcome.detail }, { status: outcome.status, headers });
}
