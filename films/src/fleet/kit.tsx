import { useLayoutEffect, type CSSProperties, type ReactNode } from "react";
import { Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { clamp, enter, leave } from "../kit";

/** A block that fades and rises in at `at`, and fades out from `out`. */
export function Reveal({
  t,
  at,
  out,
  className,
  style,
  children,
}: {
  t: number;
  at: number;
  out?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const shown = enter(t, at, 0.7);
  const gone = leave(t, out, 0.4);
  return (
    <div className={className} style={{ ...style, opacity: shown * (1 - gone), transform: `translateY(${(1 - shown) * 28 - gone * 20}px)` }}>
      {children}
    </div>
  );
}

/** The act marker, top left: a number and the act's name. */
export function Act({ t, at, out, n, name }: { t: number; at: number; out?: number; n: string; name: string }) {
  return (
    <Reveal t={t} at={at} out={out} className="act">
      <b>{n}</b>
      <span>{name}</span>
    </Reveal>
  );
}

/** The small source line under every figure. */
export function Source({ t, at, out, children }: { t: number; at: number; out?: number; children: ReactNode }) {
  return (
    <Reveal t={t} at={at} out={out} className="source">
      {children}
    </Reveal>
  );
}

/** A full-frame shade behind one beat's words, as in the site's films. */
export function Shade({ t, at, out, className }: { t: number; at: number; out?: number; className: string }) {
  return <div className={`shade ${className}`} style={{ opacity: clamp((t - at) / 0.4) * (1 - leave(t, out, 0.4)) }} />;
}

/** A word that lands large and sharp, then dims to blue when the next one arrives. */
export function Slam({ t, at, dim, out, children }: { t: number; at: number; dim?: number; out: number; children: ReactNode }) {
  const shown = enter(t, at, 0.42);
  const exit = leave(t, out, 0.34);
  const dimmed = dim === undefined ? 0 : clamp((t - dim) / 0.3);
  const channel = (from: number, to: number) => Math.round(from + (to - from) * dimmed);
  return (
    <div
      className="slam"
      style={{
        opacity: shown * (1 - exit),
        transform: `translateX(${-exit * 90}px) scale(${1.14 - 0.14 * shown})`,
        filter: `blur(${(1 - shown) * 16}px)`,
        color: `rgb(${channel(245, 111)},${channel(248, 182)},${channel(255, 255)})`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A block of seats filling up to the cap: `cap` seats light up between `at` and `at + fill`,
 * then optional `extra` seats in a second colour after them.
 */
export function Seats({
  t,
  at,
  out,
  cols,
  rows,
  cap,
  extra = 0,
  fill = 2.6,
  cell = 34,
}: {
  t: number;
  at: number;
  out?: number;
  cols: number;
  rows: number;
  cap: number;
  extra?: number;
  fill?: number;
  cell?: number;
}) {
  const size = cell;
  const gap = Math.round(cell * 0.35);
  const lit = cap * clamp((t - at) / fill);
  const more = extra * clamp((t - at - fill - 0.5) / (fill * 0.5));
  const fade = clamp((t - at + 0.4) / 0.4) * (1 - leave(t, out, 0.4));
  return (
    <svg width={cols * (size + gap)} height={rows * (size + gap)} style={{ opacity: fade, overflow: "visible" }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) * (size + gap);
        const y = Math.floor(i / cols) * (size + gap);
        const inCap = i < cap;
        const on = inCap ? clamp(lit - i) : clamp(more - (i - cap));
        const fillColor = inCap ? "#7cc0ff" : "#cad2dc";
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={size}
            height={size}
            rx={8}
            fill={on > 0 ? fillColor : "none"}
            fillOpacity={on * (inCap ? 0.95 : 0.7)}
            stroke={inCap ? "rgba(124,192,255,.45)" : "rgba(202,210,220,.35)"}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

/** The xSOM mark and wordmark, with the product's name. */
export function Logo({ t, at, product = "Fleet" }: { t: number; at: number; product?: string }) {
  const shown = enter(t, at, 0.9);
  return (
    <div className="logo" style={{ opacity: clamp((t - at) / 0.5), transform: `scale(${0.92 + 0.08 * shown})` }}>
      <Img src={staticFile("brand/mark.svg")} style={{ width: 170, height: 170, transform: `rotate(${(1 - shown) * -40}deg)` }} />
      <div className="wordmark">
        xSOM <span>{product}</span>
      </div>
    </div>
  );
}


const BLOCKS = ".stack, .seats, .pillars, .never, .bars, .steps, .act, .diagram, .note, .badge-wrap, .callout, .mention, .terminal, .console-shot, .tour-note";
const ITEMS = ".line > span, .slam, .source, .pillar, .never-item, .bar-row, .step, .logo, .url, .legend, .badge, .seats svg, .act, .diagram text, .diagram rect, .note .sub, .callout, .mention, .term-line, .tour-note";

/** How visible an element is: the product of its and its ancestors' opacity. */
function opacityOf(el: Element | null): number {
  let value = 1;
  for (let node = el; node && node !== document.body; node = node.parentElement) value *= Number(getComputedStyle(node).opacity);
  return value;
}

/**
 * Layout QA without looking at frames: on every frame, logs (picked up by the render script)
 * how many visible titles it checked and any that leaves the frame's safe area or overlaps a title of
 * another block. Draws nothing.
 */
export function Probe() {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    // Measured on the next animation frame, once Remotion has sized and placed the stage,
    // relative to the stage itself; the frame waits for the measure.
    // A stage still unsized (a film whose media are still loading) is measured again on the
    // following animation frames, ten at most.
    const handle = delayRender(`Layout probe ${frame}`);
    let id = 0;
    let tries = 0;
    const measure = () => {
      const stage = document.querySelector(".film")?.getBoundingClientRect();
      if (stage && stage.width < 2 && ++tries < 10) {
        id = requestAnimationFrame(measure);
        return;
      }
      const issues: string[] = [];
      let checked = 0;
      const seen: { rect: DOMRect; block: Element; text: string }[] = [];
      document.querySelectorAll(ITEMS).forEach((el) => {
        if (!stage || opacityOf(el) < 0.3) return;
        const raw = el.getBoundingClientRect();
        if (raw.width < 2 || raw.height < 2) return;
        const rect = new DOMRect(raw.x - stage.x, raw.y - stage.y, raw.width, raw.height);
        const parent = el.parentElement;
        if (parent?.classList.contains("line")) {
          const mask = parent.getBoundingClientRect();
          if (Math.min(raw.bottom, mask.bottom) - Math.max(raw.top, mask.top) < raw.height * 0.5) return;
        }
        checked++;
        const text = (el.textContent ?? el.tagName).trim().slice(0, 40);
        if (rect.left < 60 || rect.right > 1860 || rect.top < 40 || rect.bottom > 1040) {
          issues.push(`out-of-frame "${text}" [${Math.round(rect.left)},${Math.round(rect.top)},${Math.round(rect.right)},${Math.round(rect.bottom)}]`);
        }
        const block = el.closest(BLOCKS) ?? el;
        for (const other of seen) {
          if (other.block === block || other.block.contains(el) || block.contains(other.block)) continue;
          const w = Math.min(rect.right, other.rect.right) - Math.max(rect.left, other.rect.left);
          const h = Math.min(rect.bottom, other.rect.bottom) - Math.max(rect.top, other.rect.top);
          if (w > 4 && h > 4) issues.push(`overlap "${text}" × "${other.text}"`);
        }
        seen.push({ rect, block, text });
      });
      const size = stage ? `${Math.round(stage.width)}x${Math.round(stage.height)}` : "none";
      console.log(`PROBE ${frame} ${checked} ${size} ${JSON.stringify(issues)}`);
      continueRender(handle);
    };
    id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [frame]);
  return null;
}
