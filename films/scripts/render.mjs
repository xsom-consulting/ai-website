// Renders every film of ai.xsom.fr, fleet.xsom.fr and guard.xsom.fr with Remotion into the frontend's
// public media, with their posters. Run `npm run footage` first (the fleet films also need the
// console captures in public/screens, see README). Optional arguments filter the jobs by name:
//   npm run render -- ai-hero home extension fleet-hero fleet-how
// A job with a `budget` (bytes) is moved to fast start and re-encoded at a higher CRF, two steps
// at a time, until it fits; the layout probe of the fleet films writes out/<file>.probe.log.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { score, cues, renderCue } from './score.mjs';
import { adScore } from './ad-score.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = path.resolve(root, '../frontend/public/signal-media');

// BT.709, limited range, like every other video on the site (JPEG frames would otherwise
// leave a full-range stream).
const video = { pixelFormat: 'yuv420p', colorSpace: 'bt709' };
const film = { ...video, codec: 'h264', crf: 21, x264Preset: 'slow', audioCodec: 'aac', audioBitrate: '128k' };
const loop = { ...video, codec: 'vp9', crf: 34, muted: true };
const clip = { ...video, codec: 'h264', crf: 26, x264Preset: 'slow', muted: true };
const MB = 1e6;
const HOW_FILMS = ['orgs', 'policy', 'block', 'coverage', 'costs'];
/** Poster time of each "how it works" loop: a plan with its box and callout on screen. */
const HOW_POSTERS = { orgs: 5, policy: 5, block: 6, coverage: 7.5, costs: 5 };

/** id: composition; outputs: [file, encoding]; poster: [file, seconds, format]; copies: extra destinations. */
const JOBS = [
  ...['fr', 'en'].map(lang => ({
    name: 'home', id: `home-${lang}`,
    outputs: [[path.join(media, `xsom-ia-home-${lang}.mp4`), film]],
    poster: [path.join(media, `xsom-ia-home-${lang}.jpg`), 13.4, 'jpeg'],
  })),
  {
    name: 'ai-hero', id: 'ai-hero', budget: 5 * MB,
    outputs: [[path.join(media, 'xsom-ia-hero.mp4'), { ...clip, crf: 25 }]],
    poster: [path.join(media, 'xsom-ia-hero.jpg'), 0, 'jpeg'],
  },
  {
    name: 'extension', id: 'extension',
    outputs: [[path.join(media, 'secret-guard-loop.webm'), loop]],
    poster: [path.join(media, 'secret-guard-loop.jpg'), 0, 'jpeg'],
  },
  ...['fr', 'en'].map(lang => ({
    name: 'fleet-hero', id: `fleet-hero-${lang}`, budget: 6 * MB, probe: true,
    outputs: [[path.join(media, `xsom-fleet-hero-${lang}.mp4`), { ...film, crf: 23 }]],
    poster: [path.join(media, `xsom-fleet-hero-${lang}.jpg`), 13.8, 'jpeg'],
  })),
  ...HOW_FILMS.flatMap(topic => ['fr', 'en'].map(lang => ({
    name: 'fleet-how', id: `fleet-how-${topic}-${lang}`, budget: 2.5 * MB, probe: true,
    outputs: [[path.join(media, `xsom-fleet-how-${topic}-${lang}.mp4`), { ...clip, crf: 24 }]],
    poster: [path.join(media, `xsom-fleet-how-${topic}-${lang}.jpg`), HOW_POSTERS[topic], 'jpeg'],
  }))),
];

/** Music bed of the "how it works" v2 film: one chord per scene, on the voice-over's timings. */
const HOW_V2_CHORDS = [[38, [50, 57, 64, 65, 69]], [34, [58, 62, 65, 69, 72]], [41, [53, 57, 60, 64, 67, 72]], [40, [52, 58, 62, 67, 70]], [33, [57, 62, 64, 67, 69]], [36, [55, 60, 64, 67, 71]], [38, [50, 57, 62, 64, 66, 69]]];
const howTiming = () => JSON.parse(fs.readFileSync(path.join(root, 'src/fleet/v2/voice-timing.json'), 'utf8'));
function howV2Music(lang) {
  const { seconds, scenes } = howTiming()[lang];
  const chords = scenes.map((scene, i) => ({ at: scene.start, bass: HOW_V2_CHORDS[i % HOW_V2_CHORDS.length][0], pad: HOW_V2_CHORDS[i % HOW_V2_CHORDS.length][1] }));
  renderCue({ seconds: Math.ceil(seconds), chords }, path.join(root, 'public/score', `fleet-how-v2-${lang}.wav`));
}
/** Poster of the "how it works" v2 film: the key blocked on the Poste, one second after the block. */
function howV2Poster(lang) {
  const scene = howTiming()[lang].scenes.find(s => s.id === 'invisible');
  return scene.start + scene.voiceAt + scene.cues[2].start + 1.2;
}

// Version 2 of the fleet.xsom.fr films, under new names (the first versions stay in place).
JOBS.push(
  ...['fr', 'en'].map(lang => ({
    name: 'fleet-ad', id: `fleet-ad-${lang}`, budget: 8 * MB,
    prepare: () => adScore(lang, path.join(root, 'public/score', `fleet-ad-${lang}.wav`)),
    outputs: [[path.join(media, `xsom-fleet-hero-v2-${lang}.mp4`), { ...film, crf: 22, audioBitrate: '160k' }]],
    poster: [path.join(media, `xsom-fleet-hero-v2-${lang}.jpg`), 19.3, 'jpeg'],
  })),
  ...['fr', 'en'].map(lang => ({
    name: 'fleet-how-v2', id: `fleet-how-v2-${lang}`, budget: 15 * MB,
    prepare: () => howV2Music(lang),
    outputs: [[path.join(media, `xsom-fleet-how-v2-${lang}.mp4`), { ...film, crf: 24 }]],
    poster: [path.join(media, `xsom-fleet-how-v2-${lang}.jpg`), () => howV2Poster(lang), 'jpeg'],
  })),
);

const wanted = process.argv.slice(2);
const jobs = JOBS.filter(job => !wanted.length || wanted.includes(job.name) || wanted.includes(job.id));
if (!jobs.length) throw new Error(`No job matches ${wanted.join(', ')}`);
if (!fs.existsSync(path.join(root, 'public/footage'))) throw new Error('Run `npm run footage` first.');

fs.mkdirSync(path.join(root, 'public/score'), { recursive: true });
for (const cue of cues) score(cue, path.join(root, 'public/score', `${cue}.wav`));

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
for (const job of jobs) {
  job.prepare?.();
  const composition = await selectComposition({ serveUrl, id: job.id });
  for (const [output, encoding] of job.outputs) {
    const probe = new Map();
    for (let crf = encoding.crf; ; crf += 2) {
      probe.clear();
      await renderMedia({
        serveUrl, composition, outputLocation: output, imageFormat: 'jpeg', jpegQuality: 92, ...encoding, crf,
        onBrowserLog: job.probe ? ({ text }) => recordProbe(probe, text) : undefined,
      });
      if (!job.budget) break;
      fastStart(output);
      if (fs.statSync(output).size <= job.budget || crf >= encoding.crf + 8) break;
      console.log(`${job.id}: ${(fs.statSync(output).size / MB).toFixed(2)} MB at CRF ${crf}, over budget, again at CRF ${crf + 2}`);
    }
    const size = fs.statSync(output).size;
    if (job.budget && size > job.budget) throw new Error(`${job.id}: ${(size / MB).toFixed(2)} MB, over its ${job.budget / MB} MB budget`);
    let note = '';
    if (job.probe) {
      const lines = [...probe].map(([issue, frames]) => `${(frames[0] / composition.fps).toFixed(2)}–${(frames.at(-1) / composition.fps).toFixed(2)} s (${frames.length} frames)  ${issue}`);
      fs.mkdirSync(path.join(root, 'out'), { recursive: true });
      fs.writeFileSync(path.join(root, 'out', `${path.basename(output, '.mp4')}.probe.log`), lines.join('\n') + '\n');
      note = `, probe: ${lines.length} issue(s)`;
    }
    console.log(`${job.id} → ${path.relative(path.resolve(root, '..'), output)} (${(size / MB).toFixed(2)} MB${note})`);
  }
  const [poster, at, imageFormat] = job.poster;
  const seconds = typeof at === 'function' ? at() : at;
  const frame = Math.min(composition.durationInFrames - 1, Math.round(seconds * composition.fps));
  await renderStill({ serveUrl, composition, frame, output: poster, imageFormat, ...(imageFormat === 'jpeg' && { jpegQuality: 82 }) });
  for (const destination of job.copies ?? []) {
    for (const file of [...job.outputs.map(([output]) => output), poster]) fs.copyFileSync(file, path.join(destination, path.basename(file)));
  }
}

/** Collects the layout probe's findings (src/fleet/kit.tsx): issue → frames where it shows. */
function recordProbe(probe, text) {
  const match = text.match(/^PROBE (\d+) \d+ (\S+) (\[.*\])$/);
  if (!match) return;
  const issues = JSON.parse(match[3]);
  if (match[2] !== '1920x1080') issues.push(`stage ${match[2]}`);
  for (const issue of issues) probe.set(issue, [...(probe.get(issue) ?? []), Number(match[1])]);
}

/** Moves the index (moov atom) to the front so the browser starts playing before the end arrives. */
function fastStart(file) {
  const moved = file.replace(/\.mp4$/, '.faststart.mp4');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-map', '0', '-c', 'copy', '-movflags', '+faststart', moved]);
  fs.renameSync(moved, file);
}
