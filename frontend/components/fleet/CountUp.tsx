"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;

/**
 * Un nombre qui monte jusqu'à sa valeur quand il entre dans la fenêtre. Le rendu serveur
 * et le rendu sans mouvement (`data-motion` absent sur `<html>`) montrent la valeur
 * finale : le nombre n'est jamais faux, seulement animé.
 */
export function CountUp({ value, locale }: { value: number; locale: string }) {
  const node = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const element = node.current;
    if (!element || document.documentElement.getAttribute("data-motion") !== "on") return;
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    setShown(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = window.requestAnimationFrame(step);
        };
        frame = window.requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={node} className="fl-count">{shown.toLocaleString(locale)}</span>;
}
