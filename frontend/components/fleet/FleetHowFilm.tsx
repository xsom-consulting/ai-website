"use client";

import { useState } from "react";
import { MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/home/icons";
import { useFilmPlayback } from "@/components/home/useFilmPlayback";

type Chapter = { readonly id: string; readonly at: number; readonly title: string; readonly body: string };
type Labels = { film: string; play: string; pause: string; unmute: string; mute: string; chapters: string; demo: string };

/** Place la lecture ; avec `preload="none"`, la durée n'est connue qu'après le premier chargement. */
function seekTo(media: HTMLVideoElement, at: number) {
  if (media.readyState >= HTMLMediaElement.HAVE_METADATA) media.currentTime = at;
  else media.addEventListener("loadedmetadata", () => { media.currentTime = at; }, { once: true });
}

/**
 * Le film « Comment ça marche », avec voix off : il joue muet quand il est visible
 * (sous-titres incrustés), comme les autres films, et jamais de lui-même quand le
 * mouvement est réduit. Le bouton du son est en clair : la voix est l'intérêt du film.
 * À côté, un chapitre par scène ; un clic y place la lecture et la lance.
 */
export function FleetHowFilm({ media, chapters, labels }: { media: { mp4: string; poster: string }; chapters: readonly Chapter[]; labels: Labels }) {
  const { video, playing, muted, broken, toggle, toggleSound, events } = useFilmPlayback(media.mp4, 0.4);
  const [current, setCurrent] = useState(0);

  const onTime = () => {
    const time = video.current?.currentTime ?? 0;
    let index = 0;
    chapters.forEach((chapter, i) => { if (time >= chapter.at) index = i; });
    setCurrent(index);
  };

  const seek = (index: number) => {
    const media = video.current;
    if (!media) return;
    seekTo(media, chapters[index].at);
    setCurrent(index);
    if (media.paused) toggle();
  };

  return (
    <div className="fl-howfilm">
      <figure className="fl-howfilm__media">
        <div className="fl-film fl-film--voiced">
          <div className="fl-film__fallback" aria-hidden="true">xSOM Fleet</div>
          <video
            ref={video}
            className="fl-film__video"
            src={media.mp4}
            poster={media.poster}
            muted
            playsInline
            loop
            preload="none"
            aria-label={labels.film}
            onTimeUpdate={onTime}
            {...events}
          />
        </div>
        <figcaption className="fl-howfilm__bar">
          <span>{labels.demo}</span>
          {broken ? null : (
            <div className="fl-film__controls">
              <button type="button" className="fl-film__sound" onClick={toggleSound} aria-pressed={!muted}>
                {muted ? <MutedIcon /> : <VolumeIcon />}
                <span>{muted ? labels.unmute : labels.mute}</span>
              </button>
              <button type="button" className="fl-film__toggle" onClick={toggle} aria-label={playing ? labels.pause : labels.play} title={playing ? labels.pause : labels.play}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          )}
        </figcaption>
      </figure>
      <ol className="fl-chapters" aria-label={labels.chapters}>
        {chapters.map((chapter, index) => (
          <li key={chapter.id} id={`etape-${chapter.id}`}>
            <button type="button" className="fl-chapter" onClick={() => seek(index)} aria-current={index === current ? "step" : undefined} disabled={broken}>
              <span className="fl-chapter__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="fl-chapter__text">
                <strong>{chapter.title}</strong>
                <span>{chapter.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
