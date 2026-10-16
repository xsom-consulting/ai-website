import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { CONTACT_EMAIL } from "@/lib/site-copy";

export const runtime = "nodejs";

/**
 * Le formulaire « Besoin d'une prestation personnalisée ? » de ai.xsom.fr : la demande
 * part par email, envoyée par Resend (API REST, sans SDK), avec l'adresse du visiteur en
 * réponse. Sans `RESEND_API_KEY`, la route répond « indisponible » et le formulaire
 * propose d'écrire directement : rien n'est obligatoire pour faire tourner le site.
 *
 * Variables : `RESEND_API_KEY` (clé d'envoi seule), `CONTACT_FROM` (expéditeur sur un
 * domaine vérifié chez Resend, par défaut `xSOM · IA <site@xsom.fr>`), `CONTACT_TO`
 * (destinataire, par défaut l'adresse de contact du site).
 */

const LIMITS = { name: 120, email: 254, company: 160, message: 4000 } as const;
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

/** Une demande d'un autre site est refusée : seul le formulaire de la page peut écrire ici. */
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** Un champ texte, borné ; les retours à la ligne sont retirés des champs d'une ligne. */
function field(body: Record<string, unknown>, key: keyof typeof LIMITS, multiline = false) {
  const value = typeof body[key] === "string" ? (body[key] as string).trim() : "";
  const clean = multiline ? value.replace(/\r\n?/g, "\n") : value.replace(/[\r\n\t]+/g, " ");
  return clean.slice(0, LIMITS[key]);
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  if (isRateLimited(request)) return NextResponse.json({ detail: "Too many requests" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return NextResponse.json({ detail: "Invalid request" }, { status: 400 });

  // Le champ piège, invisible pour un visiteur : un robot le remplit, on fait comme si.
  if (typeof body.website === "string" && body.website.trim() !== "") return NextResponse.json({ ok: true });

  const name = field(body, "name");
  const email = field(body, "email");
  const company = field(body, "company");
  const message = field(body, "message", true);
  const lang = body.lang === "en" ? "en" : "fr";
  if (!name || !EMAIL.test(email) || message.length < MIN_MESSAGE) {
    return NextResponse.json({ detail: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ detail: "Contact unavailable" }, { status: 503 });

  const who = company ? `${name} · ${company}` : name;
  const text = [
    `Nom : ${name}`,
    `Email : ${email}`,
    `Entreprise : ${company || "non indiquée"}`,
    `Langue du site : ${lang}`,
    "",
    message,
    "",
    "Envoyé depuis le formulaire « Besoin d’une prestation personnalisée ? » de ai.xsom.fr.",
  ].join("\n");

  const upstream = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Un double clic ou une nouvelle tentative n'envoie pas deux fois la même demande.
      "Idempotency-Key": `ai-contact/${createHash("sha256").update(`${email}\n${message}`).digest("hex").slice(0, 40)}`,
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "xSOM · IA <site@xsom.fr>",
      to: [process.env.CONTACT_TO || CONTACT_EMAIL],
      reply_to: email,
      subject: `[ai.xsom.fr] Demande de prestation · ${who}`,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  if (!upstream?.ok) return NextResponse.json({ detail: "Contact unavailable" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
