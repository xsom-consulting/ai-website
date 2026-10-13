"use client";

import type { ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/home/icons";
import { useFilmPlayback } from "@/components/home/useFilmPlayback";

export type LoopFilmMedia = { mp4: string; poster: string; label: string };

/**
 * Un court film muet en boucle : il joue quand il est visible aux deux cinquièmes,
 * se met en pause hors de l'écran, et reste sur son affiche quand le mouvement est
 * réduit. Le bouton laisse le visiteur l'arrêter ou le relancer (WCAG 2.2.2).
 * `fallback` se dessine sous la vidéo et ne se voit que si l'affiche manque.
 */
export function LoopFilm({ media, play, pause, fallback }: { media: LoopFilmMedia; play: string; pause: string; fallback: ReactNode }) {
  const { video, playing, broken, toggle, events } = useFilmPlayback(media.mp4, 0.4);

  return (
    <div className="fl-film">
      <div className="fl-film__fallback" aria-hidden="true">{fallback}</div>
      <video
        ref={video}
        className="fl-film__video"
        src={media.mp4}
        poster={media.poster}
        muted
        playsInline
        loop
        preload="none"
        aria-label={media.label}
        {...events}
      />
      {broken ? null : (
        <button type="button" className="fl-film__toggle" onClick={toggle} aria-label={playing ? pause : play} title={playing ? pause : play}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      )}
    </div>
  );
}
