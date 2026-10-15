// Voice-over of the "how it works" film (v2): reads the scenes of src/fleet/v2/how-script.json,
// has ElevenLabs speak each one (with character timings, for the burned-in subtitles), caches
// the mp3 in public/voice/<lang>/ (not versioned) and writes src/fleet/v2/voice-timing.json:
// every scene's start and length in the film, its audio file and its subtitle cues.
//
//   ELEVENLABS_API_KEY="$(security find-generic-password -s elevenlabs-api-key -a xsom -w)" node scripts/voiceover.mjs
//   node scripts/voiceover.mjs --silent     # no API call: estimated lengths, no voice track
//
// The key is read from the environment (or, failing that, from the macOS Keychain) only at
// the moment of the call; it is never written, logged or passed on. Every character sent is
// counted and printed (ElevenLabs credits). A scene already in the cache is never sent again.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = JSON.parse(fs.readFileSync(path.join(root, 'src/fleet/v2/how-script.json'), 'utf8'));
const TIMING = path.join(root, 'src/fleet/v2/voice-timing.json');
const API = 'https://api.elevenlabs.io/v1';

/**
 * Chosen on 2026-10-15 from GET /v1/models and the voice library:
 * - model: eleven_multilingual_v2, which the API itself describes as its most life-like model,
 *   "best for voice overs" (eleven_v4 is described as the fastest, eleven_v3 as the most
 *   expressive but needing prompt work);
 * - output: mp3 44.1 kHz 192 kbit/s, the highest mp3 quality of the Creator plan;
 * - voices: a calm, professional male narrator in each language (never the "JTA" voice).
 */
export const VOICE = {
  model: 'eleven_multilingual_v2',
  format: 'mp3_44100_192',
  settings: { stability: 0.55, similarity_boost: 0.8, style: 0.12, use_speaker_boost: true, speed: 1.0 },
  // The French narrator reads fast at speed 1: slowed to 0.9 for a calmer pace.
  fr: { speed: 0.9, id: 'aQROLel5sQbj1vuIVi6B', name: 'Nicolas - Narrator (bibliothèque ElevenLabs, voix française parisienne)', owner: 'b247dc107f092f9c7fd88dd7ac6a4e149890d670ca93290b7924034b604422c1' },
  en: { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel - Steady Broadcaster (voix standard ElevenLabs, accent britannique)' },
};

/** Film layout around the voice: silence before and after each scene's sentence. */
const LEAD = 0.6, TAIL = 1.0, LAST_TAIL = 2.4;
/** A scene never lasts less than this, so its screen has time to be read. */
const MIN_SCENE = 9;
const settingsOf = lang => ({ ...VOICE.settings, speed: VOICE[lang].speed ?? VOICE.settings.speed });

const silent = process.argv.includes('--silent');
let apiKey;
const key = () => {
  if (apiKey) return apiKey;
  apiKey = process.env.ELEVENLABS_API_KEY || execFileSync('security', ['find-generic-password', '-s', 'elevenlabs-api-key', '-a', 'xsom', '-w'], { encoding: 'utf8' }).trim();
  if (!apiKey) throw new Error('No ElevenLabs key (environment or Keychain).');
  return apiKey;
};
let charactersSent = 0;
/** fetch, tried again after a network failure (never after an HTTP answer). */
async function request(url, init, tries = 4) {
  for (let k = 1; ; k++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      if (k >= tries) throw error;
      await new Promise(r => setTimeout(r, 2000 * k));
    }
  }
}

async function speak(lang, text) {
  const voice = VOICE[lang];
  const body = { text, model_id: VOICE.model, language_code: lang, voice_settings: settingsOf(lang) };
  const call = () =>
    request(`${API}/text-to-speech/${voice.id}/with-timestamps?output_format=${VOICE.format}`, {
      method: 'POST',
      headers: { 'xi-api-key': key(), 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  let response = await call();
  if (!response.ok && voice.owner && [400, 404].includes(response.status)) {
    // A library voice must be in the account's voices before the API can use it.
    const added = await request(`${API}/voices/add/${voice.owner}/${voice.id}`, {
      method: 'POST',
      headers: { 'xi-api-key': key(), 'content-type': 'application/json' },
      body: JSON.stringify({ new_name: voice.name.split(' (')[0] }),
    });
    if (!added.ok) throw new Error(`Adding the library voice failed: HTTP ${added.status}`);
    response = await call();
  }
  if (!response.ok) throw new Error(`ElevenLabs HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  charactersSent += [...text].length;
  return response.json();
}

/** Subtitle cues: sentences, a long one split at its comma nearest the middle. */
function chunks(text) {
  const sentences = text.match(/[^.:!?]+[.:!?]+/g)?.map(s => s.trim()) ?? [text];
  return sentences.flatMap(s => {
    if (s.length <= 80) return [s];
    const commas = [...s.matchAll(/, /g)].map(m => m.index);
    if (!commas.length) return [s];
    const cut = commas.reduce((best, i) => (Math.abs(i - s.length / 2) < Math.abs(best - s.length / 2) ? i : best));
    return [s.slice(0, cut + 1), s.slice(cut + 2)];
  });
}

function cues(text, say, alignment, duration) {
  const shown = chunks(text);
  const spoken = chunks(say);
  if (alignment && shown.length === spoken.length) {
    const chars = alignment.characters.join('');
    let from = 0;
    return spoken.map((piece, k) => {
      const at = chars.indexOf(piece[0], from);
      const end = at + piece.length - 1;
      from = end + 1;
      return { text: shown[k], start: alignment.character_start_times_seconds[at] ?? 0, end: alignment.character_end_times_seconds[Math.min(end, chars.length - 1)] ?? duration };
    });
  }
  // No timings: share the length out by characters.
  const total = shown.reduce((n, s) => n + s.length, 0);
  let at = 0;
  return shown.map(s => {
    const start = at;
    at += (duration * s.length) / total;
    return { text: s, start, end: at };
  });
}

const mp3Length = file => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim());

const timing = { model: VOICE.model, format: VOICE.format, voices: { fr: VOICE.fr.name, en: VOICE.en.name }, voiced: !silent };
for (const lang of ['fr', 'en']) {
  const dir = path.join(root, 'public/voice', lang);
  fs.mkdirSync(dir, { recursive: true });
  let at = 0;
  const scenes = [];
  for (const [index, scene] of SCRIPT[lang].entries()) {
    const say = scene.say ?? scene.text;
    let file = null, duration, alignment = null;
    if (silent) {
      duration = [...say].length / (lang === 'fr' ? 14.5 : 15.5);
    } else {
      const hash = createHash('sha256').update(JSON.stringify([VOICE.model, VOICE.format, settingsOf(lang), VOICE[lang].id, say])).digest('hex').slice(0, 12);
      const base = path.join(dir, `${scene.id}-${hash}`);
      if (!fs.existsSync(`${base}.mp3`)) {
        const result = await speak(lang, say);
        fs.writeFileSync(`${base}.mp3`, Buffer.from(result.audio_base64, 'base64'));
        fs.writeFileSync(`${base}.json`, JSON.stringify(result.alignment));
        console.log(`${lang} ${scene.id}: ${[...say].length} characters sent`);
      }
      alignment = JSON.parse(fs.readFileSync(`${base}.json`, 'utf8'));
      duration = mp3Length(`${base}.mp3`);
      file = path.relative(path.join(root, 'public'), `${base}.mp3`).split(path.sep).join('/');
    }
    const last = index === SCRIPT[lang].length - 1;
    const length = Math.max(last ? 0 : MIN_SCENE, LEAD + duration + (last ? LAST_TAIL : TAIL) + (scene.hold ?? 0));
    const voiceAt = last ? LEAD : Math.max(LEAD, (length - duration - TAIL - (scene.hold ?? 0)) * 0.5 + LEAD * 0.5);
    scenes.push({ id: scene.id, start: round(at), length: round(length), voiceAt: round(voiceAt), voice: file, voiceLength: round(duration), cues: cues(scene.text, say, alignment, duration).map(c => ({ ...c, start: round(c.start), end: round(c.end) })) });
    at += length;
  }
  timing[lang] = { seconds: round(at), scenes };
  console.log(`${lang}: ${round(at)} s`);
}
fs.writeFileSync(TIMING, JSON.stringify(timing, null, 2) + '\n');
console.log(`Characters sent to ElevenLabs this run: ${charactersSent}`);

function round(x) { return Math.round(x * 1000) / 1000; }
