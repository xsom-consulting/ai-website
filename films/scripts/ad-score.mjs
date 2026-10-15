// Soundtrack of the xSOM Fleet v2 commercial (20 s, 120 BPM): music and sound effects, all
// synthesised here from the cue sheet src/fleet/v2/ad-cues.json that the pictures also read,
// so every click, whoosh and impact lands on its frame. No sample library, no licence.
// Deterministic: the same language always renders the same file.
//
//   node scripts/ad-score.mjs fr public/score/fleet-ad-fr.wav
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { freeverb, polyBlep, writeWav } from './score.mjs';

const RATE = 48000;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CUES = JSON.parse(fs.readFileSync(path.join(root, 'src/fleet/v2/ad-cues.json'), 'utf8'));
const BEAT = 60 / CUES.bpm;
const TARGET_RMS_DB = -17;

/** Keystroke times of the opening line: slow first keys, then faster and faster. */
export function keystrokes(text, from, to) {
  const n = [...text].length;
  return Array.from({ length: n }, (_, k) => from + (to - from) * Math.sqrt((k + 1) / n) ** 1.35);
}

const hz = note => 440 * 2 ** ((note - 69) / 12);
const smooth = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export function adScore(lang, file) {
  const seconds = CUES.seconds;
  const length = Math.round(seconds * RATE);
  const L = new Float32Array(length), R = new Float32Array(length);
  const sendL = new Float32Array(length), sendR = new Float32Array(length);
  let seed = 7;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const put = (i, l, r, send = 0) => {
    if (i < 0 || i >= length) return;
    L[i] += l; R[i] += r; sendL[i] += l * send; sendR[i] += r * send;
  };
  const span = (at, dur) => [Math.max(0, Math.round(at * RATE)), Math.min(length, Math.round((at + dur) * RATE))];

  // --- Instruments -------------------------------------------------------------------------
  function click(at, gain, bright) {
    // A keyboard click: a 2-4 kHz tick and a short noise burst.
    const [a, b] = span(at, 0.05);
    const f = 2200 + 1800 * bright;
    let lp = 0;
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      const noise = rand() * 2 - 1;
      lp += 0.5 * (noise - lp);
      const v = (Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.004) * 0.6 + (noise - lp) * Math.exp(-t / 0.009)) * gain;
      put(i, v * 0.9, v, 0.15);
    }
  }
  function kick(at, gain = 0.5) {
    const [a, b] = span(at, 0.45);
    let phase = 0;
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      phase += 2 * Math.PI * (45 + 110 * Math.exp(-t / 0.035)) / RATE;
      const v = Math.sin(phase) * Math.exp(-t / 0.18) * Math.min(1, t / 0.002) * gain;
      put(i, v, v, 0.05);
    }
  }
  function noiseHit(at, dur, gain, tone, send = 0.3, pan = 0) {
    // Band-limited noise burst: claps, hats, cracks.
    const [a, b] = span(at, dur);
    let lp = 0, hp = 0;
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      const x = rand() * 2 - 1;
      lp += tone * (x - lp);
      hp = x - lp;
      const v = (tone > 0.5 ? hp : lp) * Math.exp(-t / (dur / 4)) * gain;
      put(i, v * (1 - pan), v * (1 + pan), send);
    }
  }
  function boom(at, gain, low = 32, high = 140, decay = 0.6) {
    // A deep impact: a falling sine and a sub tail.
    const [a, b] = span(at, decay * 4);
    let phase = 0;
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      phase += 2 * Math.PI * (low + (high - low) * Math.exp(-t / 0.08)) / RATE;
      const v = Math.tanh(1.6 * Math.sin(phase)) * Math.exp(-t / decay) * Math.min(1, t / 0.003) * gain;
      put(i, v, v, 0.25);
    }
  }
  function whoosh(peak, dur, gain, rising = true) {
    // Filtered noise swept up into the cut (or down after it).
    const from = rising ? peak - dur : peak;
    const [a, b] = span(from, dur + (rising ? 0.08 : 0));
    let low = 0, band = 0;
    for (let i = a; i < b; i++) {
      const x = Math.min(1, (i - a) / (dur * RATE));
      const env = rising ? x ** 2.2 * (i / RATE > peak ? Math.exp(-(i / RATE - peak) / 0.03) : 1) : (1 - x) ** 2;
      const cutoff = rising ? 300 + 5200 * x * x : 4800 - 4200 * x;
      const f = 2 * Math.sin(Math.PI * cutoff / RATE);
      const n = rand() * 2 - 1;
      low += f * band; band += f * (n - low - 0.6 * band);
      const pan = Math.sin(x * Math.PI) * 0.6 * (rising ? 1 : -1);
      put(i, band * env * gain * (1 - pan), band * env * gain * (1 + pan), 0.35);
    }
  }
  function bell(at, freq, gain, decay = 1.2, send = 0.5) {
    // FM bell: dings and magnetic snaps.
    const [a, b] = span(at, decay * 4);
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      const mod = Math.sin(2 * Math.PI * freq * 1.4 * t) * 2.2 * Math.exp(-t / (decay * 0.3));
      const v = Math.sin(2 * Math.PI * freq * t + mod) * Math.exp(-t / decay) * Math.min(1, t / 0.002) * gain;
      put(i, v, v * 0.92, send);
    }
  }
  function glass(at, gain) {
    // Shatter: dozens of short high pings scattered over 400 ms, plus a bright crack.
    for (let k = 0; k < 46; k++) {
      const t = at + 0.42 * rand() ** 1.8;
      const f = 2600 + 7000 * rand();
      const [a, b] = span(t, 0.25);
      const pan = rand() * 1.6 - 0.8;
      const g = gain * (0.25 + 0.75 * rand()) * Math.exp(-(t - at) / 0.25);
      for (let i = a; i < b; i++) {
        const u = (i - a) / RATE;
        const v = Math.sin(2 * Math.PI * f * u) * Math.exp(-u / (0.02 + 0.05 * rand())) * g;
        put(i, v * (1 - pan), v * (1 + pan), 0.5);
      }
    }
    noiseHit(at, 0.35, gain * 1.4, 0.9, 0.5);
  }
  function pad(notes, from, to, gain, attack = 0.4, release = 0.5) {
    // Detuned saw pad through a gentle low-pass.
    const voices = notes.flatMap((note, n) => [-8, 0, 8].map((c, v) => ({ step: hz(note) * 2 ** (c / 1200) / RATE, phase: (n * 0.31 + v * 0.17) % 1, pan: (v - 1) * 0.5 })));
    const [a, b] = span(from, to - from + release);
    const s = [{ low: 0, band: 0 }, { low: 0, band: 0 }];
    for (let i = a; i < b; i++) {
      const t = i / RATE;
      const env = smooth((t - from) / attack) * (1 - smooth((t - to) / release));
      let l = 0, r = 0;
      for (const v of voices) {
        v.phase += v.step; if (v.phase >= 1) v.phase -= 1;
        const x = (2 * v.phase - 1 - polyBlep(v.phase, v.step)) * gain / Math.sqrt(voices.length);
        l += x * (1 - v.pan); r += x * (1 + v.pan);
      }
      const f = 2 * Math.sin(Math.PI * (900 + 1400 * smooth((t - from) / (to - from + 0.01))) / RATE);
      const out = [l, r].map((x, c) => { const st = s[c]; st.low += f * st.band; st.band += f * (x - st.low - 1.2 * st.band); return st.low * env; });
      put(i, out[0], out[1], 0.6);
    }
  }
  function bass(note, at, dur, gain) {
    const [a, b] = span(at, dur);
    for (let i = a; i < b; i++) {
      const t = (i - a) / RATE;
      const w = 2 * Math.PI * hz(note) * t;
      const v = (Math.sin(w) + 0.35 * Math.sin(2 * w) + 0.12 * Math.sin(3 * w)) * Math.min(1, t / 0.005) * Math.exp(-t / (dur * 0.9)) * gain;
      put(i, v, v, 0.02);
    }
  }
  function riser(from, to, gain) {
    const [a, b] = span(from, to - from);
    let phase = 0, low = 0, band = 0;
    for (let i = a; i < b; i++) {
      const x = (i - a) / (b - a);
      phase += 2 * Math.PI * (180 + 1500 * x ** 2) / RATE;
      const n = rand() * 2 - 1;
      const f = 2 * Math.sin(Math.PI * (400 + 6000 * x * x) / RATE);
      low += f * band; band += f * (n - low - 0.7 * band);
      const v = (Math.sin(phase) * 0.35 + band * 0.9) * x ** 2.4 * gain;
      put(i, v, v, 0.4);
    }
  }
  function beats(from, to, fn) {
    for (let t = from; t < to - 1e-6; t += BEAT) fn(t, Math.round((t - from) / BEAT));
  }

  // --- 0–2 s: the line typed faster and faster, then the impact --------------------------
  const text = CUES.typing.text[lang];
  keystrokes(text, CUES.typing.from, CUES.typing.to).forEach((at, k, all) => click(at, 0.32 + 0.25 * (k / all.length), rand()));
  whoosh(CUES.impact, 0.28, 0.32);
  boom(CUES.impact, 0.75, 34, 160, 0.5);
  noiseHit(CUES.impact, 0.25, 0.5, 0.85, 0.6);

  // --- 2–5 s: the burst, a whoosh on every cut, a driving beat -----------------------------
  CUES.burst.slice(1).forEach(at => { whoosh(at, 0.22, 0.28); noiseHit(at, 0.08, 0.16, 0.9); });
  beats(2, 5, (t, n) => {
    kick(t, 0.55);
    noiseHit(t + BEAT / 2, 0.05, 0.09, 0.95, 0.1, 0.3);
    if (n % 2 === 1) noiseHit(t, 0.18, 0.28, 0.75, 0.4);
    bass(38, t, BEAT * 0.45, 0.16); bass(38, t + BEAT / 2, BEAT * 0.45, 0.12);
  });
  pad([50, 57, 62, 65, 69], 2, 5, 0.06, 0.2, 0.3);

  // --- 5–8 s: the pills snap onto the grid, the riser -------------------------------------
  pad([46, 53, 58, 62, 65, 69], 5, 8, 0.08, 0.6, 0.15);
  CUES.pills.forEach((at, k) => { whoosh(at + CUES.pillFlight, CUES.pillFlight, 0.18); bell(at + CUES.pillFlight, [880, 1046.5, 1318.5][k], 0.16, 0.5); kick(at + CUES.pillFlight, 0.3); });
  CUES.words.forEach(at => { boom(at, 0.3, 50, 120, 0.25); noiseHit(at, 0.12, 0.18, 0.8); });
  beats(5, 8, (t) => { bass(34, t, BEAT * 0.9, 0.12); });
  riser(5.2, 8, 0.22);
  for (let k = 0; k < 16; k++) noiseHit(7 + 1 - (1 - k / 16) ** 0.6, 0.06, 0.08 + 0.12 * (k / 16), 0.8, 0.3);

  // --- 8–11 s: the key flies in and breaks on the Poste -----------------------------------
  whoosh(CUES.key.hit, 1.0, 0.3);
  boom(CUES.key.hit, 1.0, 26, 120, 0.9);
  glass(CUES.key.hit, 0.32);
  noiseHit(CUES.nothing, 0.12, 0.12, 0.85);
  beats(9.5, 11, (t, n) => { kick(t, 0.45); if (n % 2) noiseHit(t, 0.16, 0.22, 0.75, 0.4); bass(36, t, BEAT * 0.8, 0.12); });
  pad([48, 55, 62, 63, 67], 9, 11, 0.06, 0.4, 0.3);

  // --- 11–14 s: the stamp, a dull thud and its echo ---------------------------------------
  whoosh(CUES.stamp.hit, 0.5, 0.3);
  [0, 0.375, 0.75, 1.125, 1.5].forEach((d, k) => boom(CUES.stamp.hit + d, 0.85 * 0.45 ** k, 38, 95, 0.4));
  noiseHit(CUES.stamp.hit, 0.3, 0.3, 0.2, 0.7);
  CUES.everywhere.forEach(at => noiseHit(at, 0.14, 0.15, 0.8));
  pad([41, 53, 57, 60, 64, 67], 11.5, 14, 0.08, 0.3, 0.3);
  beats(12, 14, (t, n) => { kick(t, 0.42); noiseHit(t + BEAT / 2, 0.05, 0.08, 0.95, 0.1); if (n % 2) noiseHit(t, 0.16, 0.2, 0.75, 0.35); bass(41, t, BEAT * 0.45, 0.13); });

  // --- 14–17 s: the counters tick, a ding when they land -----------------------------------
  for (let t = CUES.counters.from + 0.06; t < CUES.counters.lands.at(-1); t += BEAT / 4) bell(t, 2100, 0.05, 0.03, 0.1);
  CUES.counters.lands.forEach(at => { click(at, 0.5, 1); kick(at, 0.25); });
  bell(CUES.control, 1568, 0.22, 1.1);
  bell(CUES.control, 2093, 0.1, 0.9);
  beats(14, 17, (t) => { kick(t, 0.32); bass(43, t, BEAT * 0.4, 0.1); });
  pad([43, 55, 59, 62, 66], 14, 16.95, 0.06, 0.4, 0.05);

  // --- 18–20 s: the final chord -------------------------------------------------------------
  pad([38, 50, 57, 62, 64, 66, 69], CUES.finale, 19.9, 0.1, 0.05, 0.1);
  boom(CUES.finale, 0.55, 30, 90, 0.8);
  [62, 66, 69, 73, 76].forEach((n, k) => bell(CUES.finale + k * 0.03, hz(n), 0.07, 1.4, 0.6));
  bell(CUES.logo, hz(81), 0.06, 1.2);

  // Reverb, then the silence before the finale is made exact and the end fades into the loop.
  const [wetL, wetR] = freeverb(sendL, sendR, 0.8, 0.4);
  let peak = 0, power = 0;
  const [mute0, mute1] = CUES.silence;
  for (let i = 0; i < length; i++) {
    const t = i / RATE;
    const silence = t < mute0 ? 1 : t < mute0 + 0.06 ? 1 - (t - mute0) / 0.06 : t < mute1 ? 0 : 1;
    const fade = 1 - smooth((t - CUES.fadeOut) / (seconds - CUES.fadeOut));
    L[i] = Math.tanh((L[i] + wetL[i] * 0.3) * 1.2) * silence * fade;
    R[i] = Math.tanh((R[i] + wetR[i] * 0.3) * 1.2) * silence * fade;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    power += (L[i] ** 2 + R[i] ** 2) / 2;
  }
  const scale = Math.min(0.89 / peak, 10 ** (TARGET_RMS_DB / 20) / Math.sqrt(power / length));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  writeWav(file, L.map(v => v * scale), R.map(v => v * scale));
  return file;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [lang = 'fr', out = path.join(root, `public/score/fleet-ad-${lang}.wav`)] = process.argv.slice(2);
  console.log(adScore(lang, out));
}
