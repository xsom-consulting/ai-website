import type { CSSProperties, ReactNode } from "react";
import { Img, getStaticFiles, staticFile } from "remotion";

/**
 * A capture of the xSOM Fleet console: a PNG taken at device scale 2 and stored in
 * public/screens/<lang>/<name>.png (not versioned, see README). `width` and `height` are the
 * page's size in CSS pixels, half the PNG's; every focus box of a tour is in these units.
 */
export type Capture = { src: string; width: number; height: number };

/** The captures' default page size: a 1440 × 900 window, taken at 2x. */
export const PAGE = { width: 1440, height: 900 };

/** The console's own address, shown in the browser frame. */
export const CONSOLE_HOST = "console.fleet.xsom.fr";

/** Whether the capture is in public/: until the captures arrive, a grey stand-in is drawn. */
export function captureExists(src: string) {
  return getStaticFiles().some((file) => file.name === src);
}

/** The capture at its page size, or a grey stand-in that says which file is missing. */
export function CaptureImage({ capture, style }: { capture: Capture; style?: CSSProperties }) {
  const size: CSSProperties = { width: capture.width, height: capture.height, display: "block", ...style };
  if (captureExists(capture.src)) return <Img src={staticFile(capture.src)} style={size} />;
  return <Placeholder capture={capture} style={size} />;
}

/** A neutral page outline: header, side navigation, a title and table rows. */
function Placeholder({ capture, style }: { capture: Capture; style: CSSProperties }) {
  const block = (left: number, top: number, width: number, height: number, tone = "#3a4656"): ReactNode => (
    <div key={`${left}-${top}`} style={{ position: "absolute", left, top, width, height, background: tone, borderRadius: 6 }} />
  );
  const rows = Array.from({ length: Math.floor((capture.height - 300) / 64) }, (_, i) => block(300, 260 + i * 64, capture.width - 360, 44, i % 2 ? "#36414f" : "#3d4a5b"));
  return (
    <div style={{ ...style, position: "relative", background: "#2b3440", overflow: "hidden" }}>
      {block(0, 0, capture.width, 64, "#232b35")}
      {block(24, 96, 220, capture.height - 120, "#323c49")}
      {block(300, 96, 520, 56, "#4a5869")}
      {block(300, 176, 760, 30)}
      {rows}
      <div style={{ position: "absolute", right: 40, bottom: 30, font: "500 22px Mono, monospace", color: "#a9b6c6" }}>capture à venir · {capture.src}</div>
    </div>
  );
}

/** A sober browser window: three grey dots, the address, and an optional note on the right. */
export function BrowserChrome({ path, note, height = 64 }: { path: string; note?: ReactNode; height?: number }) {
  return (
    <div className="chrome" style={{ height }}>
      <span className="dots">
        <i />
        <i />
        <i />
      </span>
      <span className="address">
        {CONSOLE_HOST}
        {path}
      </span>
      {note}
    </div>
  );
}
