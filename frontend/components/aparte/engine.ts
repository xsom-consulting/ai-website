// Moteur de détection Aparté (module public @xsom/secret-guard-wasm), exécuté dans le navigateur du visiteur.
// Aucune requête réseau pour l'analyse : le texte tapé dans la démo ne quitte jamais la page.
import type { SecretGuard } from '@xsom/secret-guard-wasm/browser';

let loading: Promise<SecretGuard> | null = null;
let state: 'idle' | 'loading' | 'ready' | 'failed' = 'idle';
const listeners = new Set<(s: typeof state) => void>();
const setState = (s: typeof state) => { state = s; listeners.forEach((f) => f(s)); };

export const engineState = () => state;
export const onEngineState = (f: (s: typeof state) => void) => { listeners.add(f); f(state); };

export function loadEngine(): Promise<SecretGuard> {
  if (!loading) {
    setState('loading');
    loading = (async () => {
      // Chargé à la demande, dans le navigateur seulement : le module WebAssembly fait 6,9 Mo.
      const { createSecretGuard, wasmUrl } = await import('@xsom/secret-guard-wasm/browser');
      const res = await fetch(wasmUrl);
      if (!res.ok) throw new Error('module indisponible');
      const guard = await createSecretGuard(new Uint8Array(await res.arrayBuffer()));
      // Clé d'Empreinte locale tirée au hasard pour cette page : elle ne sort jamais du navigateur.
      if (!guard.setFingerprintKey(crypto.getRandomValues(new Uint8Array(32)))) throw new Error('clé refusée');
      setState('ready');
      return guard;
    })().catch((e) => { setState('failed'); loading = null; throw e; });
  }
  return loading;
}

export interface Piece { text: string; masked: boolean; label?: string }
export interface Analysis {
  /** Faux : l'analyse n'a pas pu aboutir. Échec fermé : rien ne doit partir. */
  readonly ok: boolean;
  readonly count: number;
  readonly labels: string[];
  /** Texte tel que l'IA le recevrait après expurgation, découpé pour l'affichage. */
  readonly pieces: Piece[];
  readonly maskedText: string;
}

const enc = new TextEncoder();
const dec = new TextDecoder();
const labelOf = (replacement: string) => /:\s*(.+?),\s*pas la vraie valeur/.exec(replacement)?.[1] ?? 'secret';

export async function analyse(text: string): Promise<Analysis> {
  try {
    const guard = await loadEngine();
    const res = guard.expurgate(enc.encode(text), { substituteLanguage: 'fr' });
    if (res.failure !== 'none' || !res.initial.complete || res.text === null) {
      return { ok: false, count: 0, labels: [], pieces: [{ text, masked: false }], maskedText: '' };
    }
    const subs = [...res.substitutions].sort((a, b) => a.utf16Start - b.utf16Start);
    const pieces: Piece[] = [];
    let at = 0;
    for (const s of subs) {
      if (s.utf16Start > at) pieces.push({ text: text.slice(at, s.utf16Start), masked: false });
      pieces.push({ text: s.replacement, masked: true, label: labelOf(s.replacement) });
      at = s.utf16End;
    }
    if (at < text.length) pieces.push({ text: text.slice(at), masked: false });
    const labels = [...new Set(subs.map((s) => labelOf(s.replacement)))];
    return { ok: true, count: subs.length, labels, pieces, maskedText: dec.decode(res.text) };
  } catch {
    return { ok: false, count: 0, labels: [], pieces: [{ text, masked: false }], maskedText: '' };
  }
}
