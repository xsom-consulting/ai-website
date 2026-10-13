// Renders key frames of compositions to out/stills/<id>-<seconds>.png, with one bundle, and
// prints what the layout probe (src/fleet/kit.tsx) reports for each frame.
//   node scripts/stills.mjs fleet-hero-fr:1.5,4.6,10.8 fleet-how-block-en:5
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out/stills');
fs.mkdirSync(out, { recursive: true });
const requests = process.argv.slice(2).map(arg => {
  const [id, times] = arg.split(':');
  return { id, seconds: (times ?? '0').split(',').map(Number) };
});
if (!requests.length) throw new Error('Usage: node scripts/stills.mjs <id>:<s>,<s> …');

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
for (const { id, seconds } of requests) {
  const composition = await selectComposition({ serveUrl, id });
  for (const s of seconds) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    const output = path.join(out, `${id}-${s}.png`);
    let probe = 'no probe';
    await renderStill({
      serveUrl, composition, frame, output,
      onBrowserLog: ({ text }) => {
        const match = text.match(/^PROBE \d+ (\d+) (\S+) (\[.*\])$/);
        if (match) probe = `${match[1]} checked ${match[2]} ${match[3]}`;
      },
    });
    console.log(`${path.relative(root, output)}  probe: ${probe}`);
  }
}
