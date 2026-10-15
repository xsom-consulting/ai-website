import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserChrome, CaptureImage, PAGE, type Capture } from "./screen";

/** A box on the page, in the capture's CSS pixels (half the PNG's pixels). */
export type Focus = { x: number; y: number; w: number; h: number };

/**
 * One plan of a tour, from `at` (film seconds) until the next one. Without `focus`, the
 * camera shows the page's top at full width (the overview, where every tour starts and ends,
 * so it loops cleanly). With it, the camera centres the box, at `zoom` times the overview
 * scale (by default as much as fits), surrounds it, points at it and shows `callout`.
 */
export type TourStep = { at: number; focus?: Focus; zoom?: number; callout?: string; pointer?: boolean };

/** One capture and its plans; a later page dissolves over the previous one at its first step. */
export type TourPage = { src: string; width?: number; height?: number; path: string; steps: TourStep[]; redact?: Focus[] };

/** Where the browser window sits in the 1920 × 1080 frame, and its title bar. */
export type TourWindow = { left: number; top: number; width: number; height: number; chrome: number };
const DEFAULT_WINDOW: TourWindow = { left: 100, top: 46, width: 1720, height: 988, chrome: 64 };
type View = { width: number; height: number };
const viewOf = (w: TourWindow): View => ({ width: w.width, height: w.height - w.chrome });

/** Motion: the camera eases over 0.9 s, everything that appears takes 250 ms. */
const CAMERA_SECONDS = 0.9;
const APPEAR = 0.25;

type Camera = { cx: number; cy: number; zoom: number };

/** The camera that shows a step, kept inside the page. */
function cameraFor(step: TourStep, page: Capture, VIEW: View): Camera {
  const base = VIEW.width / page.width;
  const focus = step.focus;
  const zoom = focus ? (step.zoom ?? Math.min(2.4, Math.max(1, Math.min(VIEW.width / (focus.w * 1.5), VIEW.height / (focus.h * 1.9)) / base))) : 1;
  const scale = base * zoom;
  const halfW = VIEW.width / scale / 2;
  const halfH = VIEW.height / scale / 2;
  const within = (value: number, half: number, size: number) => (size <= half * 2 ? size / 2 : Math.min(size - half, Math.max(half, value)));
  const cx = focus ? focus.x + focus.w / 2 : page.width / 2;
  const cy = focus ? focus.y + focus.h / 2 : 0;
  return { cx: within(cx, halfW, page.width), cy: within(cy, halfH, page.height), zoom };
}

const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Page → window coordinates for a camera. */
function project(camera: Camera, page: Capture, VIEW: View) {
  const scale = (VIEW.width / page.width) * camera.zoom;
  const ox = VIEW.width / 2 - camera.cx * scale;
  const oy = VIEW.height / 2 - camera.cy * scale;
  return { scale, ox, oy, at: (x: number, y: number) => ({ x: ox + x * scale, y: oy + y * scale }) };
}

function Page({ page, VIEW }: { page: TourPage; VIEW: View }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const capture: Capture = { src: page.src, width: page.width ?? PAGE.width, height: page.height ?? PAGE.height };
  const steps = page.steps;
  const ease = (from: number) => spring({ frame: frame - Math.round(from * fps), fps, config: { damping: 200 }, durationInFrames: Math.round(CAMERA_SECONDS * fps) });

  // The camera: each step pulls it from wherever it was towards its own target.
  let camera = cameraFor(steps[0], capture, VIEW);
  steps.slice(1).forEach((step) => {
    const p = ease(step.at);
    if (p <= 0) return;
    const target = cameraFor(step, capture, VIEW);
    camera = { cx: mix(camera.cx, target.cx, p), cy: mix(camera.cy, target.cy, p), zoom: Math.exp(mix(Math.log(camera.zoom), Math.log(target.zoom), p)) };
  });
  const view = project(camera, capture, VIEW);

  // The current step, and how far into it the highlight and callout are.
  const index = steps.reduce((found, step, i) => (t >= step.at ? i : found), 0);
  const step = steps[index];
  const next = steps[index + 1]?.at;
  const shown = (delay: number) =>
    interpolate(t, [step.at + delay, step.at + delay + APPEAR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    (next === undefined ? 1 : interpolate(t, [next - APPEAR, next], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const box = step.focus ? { ...view.at(step.focus.x, step.focus.y), w: step.focus.w * view.scale, h: step.focus.h * view.scale } : undefined;
  const ring = shown(CAMERA_SECONDS * 0.6);
  const caption = shown(CAMERA_SECONDS * 0.5);

  // The pointer glides between the boxes, in window coordinates; it rests low right on an overview.
  const rest = { x: VIEW.width * 0.64, y: VIEW.height * 0.78 };
  // On a box, it settles just under its lower edge, so it never hides what the box shows.
  const aim = (s: TourStep) => {
    if (!s.focus || s.pointer === false) return rest;
    const p = view.at(s.focus.x + s.focus.w * 0.7, s.focus.y + s.focus.h);
    return { x: p.x, y: Math.min(VIEW.height - 70, p.y + 16) };
  };
  let pointer = aim(steps[0]);
  steps.slice(1).forEach((s) => {
    const p = ease(s.at + 0.15);
    if (p > 0) pointer = { x: mix(pointer.x, aim(s).x, p), y: mix(pointer.y, aim(s).y, p) };
  });
  const press = step.focus && step.pointer !== false ? interpolate(t - step.at, [CAMERA_SECONDS, CAMERA_SECONDS + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const above = box ? box.y + box.h / 2 > VIEW.height * 0.55 : false;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${view.ox}px, ${view.oy}px) scale(${view.scale})` }}>
        <CaptureImage capture={capture} />
        {page.redact?.map((r, i) => <Redaction key={i} capture={capture} box={r} />)}
      </div>
      {box && (
        <svg width={VIEW.width} height={VIEW.height} style={{ position: "absolute", inset: 0 }}>
          <path
            fillRule="evenodd"
            fill={`rgba(3,12,26,${0.5 * ring})`}
            d={`M0,0H${VIEW.width}V${VIEW.height}H0Z M${box.x - 10},${box.y - 10}h${box.w + 20}v${box.h + 20}h${-box.w - 20}Z`}
          />
          <rect x={box.x - 10} y={box.y - 10} width={box.w + 20} height={box.h + 20} rx={12} fill="none" stroke="#7cc0ff" strokeWidth={5} opacity={ring} style={{ filter: "drop-shadow(0 0 12px rgba(124,192,255,.7))" }} />
        </svg>
      )}
      {press > 0 && press < 1 && (
        <div style={{ position: "absolute", left: pointer.x - 40 * press, top: pointer.y - 40 * press, width: 80 * press, height: 80 * press, borderRadius: "50%", border: "4px solid #7cc0ff", opacity: 0.7 * (1 - press) }} />
      )}
      <svg width={46} height={56} viewBox="0 0 23 28" style={{ position: "absolute", left: pointer.x - 4, top: pointer.y - 3, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.45))" }}>
        <path d="M2 2 L2 22 L7.5 17 L11 25.5 L14.6 24 L11.2 16 L18.5 16 Z" fill="#fff" stroke="#0b1626" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      {step.callout && caption > 0 && (
        <div
          className="callout"
          style={{ [above ? "top" : "bottom"]: 40, opacity: caption, transform: `translateY(${(1 - caption) * (above ? -18 : 18)}px)` }}
        >
          {step.callout}
        </div>
      )}
    </AbsoluteFill>
  );
}

/**
 * Walks through one or more console captures in a browser window: gentle camera moves,
 * a highlighted box, a pointer and a short callout per plan. Pages after the first dissolve
 * in over 300 ms at their first step. The window's title bar carries the console's address
 * and the demonstration notice, readable on every frame.
 */
export function ScreenTour({ pages, mention, window: WINDOW_IN }: { pages: TourPage[]; mention: string; window?: TourWindow }) {
  const WINDOW = WINDOW_IN ?? DEFAULT_WINDOW;
  const VIEW = viewOf(WINDOW);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const current = pages.reduce((found, page, i) => (t >= page.steps[0].at ? i : found), 0);
  return (
    <div className="tour-window" style={{ left: WINDOW.left, top: WINDOW.top, width: WINDOW.width, height: WINDOW.height }}>
      <BrowserChrome path={pages[current].path} height={WINDOW.chrome} note={<span className="mention">{mention}</span>} />
      <div style={{ position: "absolute", left: 0, top: WINDOW.chrome, width: VIEW.width, height: VIEW.height, overflow: "hidden", background: "#0b1626" }}>
        {pages.map((page, i) => {
          const start = page.steps[0].at;
          const end = pages[i + 1]?.steps[0].at;
          if (t < start || (end !== undefined && t > end + 0.3)) return null;
          const opacity = i ? interpolate(t, [start, start + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
          return (
            <AbsoluteFill key={i} style={{ opacity }}>
              <Page page={page} VIEW={VIEW} />
            </AbsoluteFill>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A box of the capture made unreadable: the same pixels, heavily blurred, in place. Used to
 * hide a provider's name or product (no AI provider is named in the films), never to change
 * what the console shows.
 */
function Redaction({ capture, box }: { capture: Capture; box: Focus }) {
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", borderRadius: 4 }}>
      <div style={{ position: "absolute", left: -box.x, top: -box.y, filter: "blur(7px)" }}>
        <CaptureImage capture={capture} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(225,230,238,.45)" }} />
    </div>
  );
}
