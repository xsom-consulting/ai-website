"use client";

import type { ReactNode } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { HOME_COPY } from "./home-copy";
import { ChevronDownIcon, MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "./icons";
import { glideTo } from "./motion";
import { useFilmPlayback } from "./useFilmPlayback";

/**
 * Un film par langue du site : la vidéo titrée, son affiche et sa transcription.
 * `name` nomme la section du film ; sans lui, le nom de l'accueil s'applique.
 */
export type FilmMedia = Record<Lang, { mp4: string; poster: string; label: string; name?: string }>;

/**
 * Le film d'ouverture, plein cadre. Il ne joue que visible, onglet au premier plan,
 * et jamais de lui-même quand le mouvement est réduit (`useFilmPlayback`). Les trois
 * sites le partagent, chacun avec son film et la section qui le suit. `fallback` se dessine sous la vidéo : il ne se voit que si
 * l'affiche manque.
 */
export function HomeFilm({ media, next, fallback }: { media: FilmMedia; next: string; fallback?: ReactNode }) {
  const { lang } = useT();
  const film = media[lang];
  const copy = HOME_COPY[lang].film;
  const { video, playing, muted, toggle: togglePlay, toggleSound, events } = useFilmPlayback(film.mp4);

  return (
    <section id="home-film" className="home-film" aria-label={film.name ?? copy.label}>
      {fallback ? <div className="home-film__fallback" aria-hidden="true">{fallback}</div> : null}
      <video
        ref={video}
        className="home-film__video"
        src={film.mp4}
        poster={film.poster}
        muted
        playsInline
        loop
        preload="none"
        aria-label={film.label}
        {...events}
      />
      <div className="guard-wrap home-film__bar">
        <a className="home-film__next" href={next} onClick={glideTo}>{copy.next}<ChevronDownIcon /></a>
        <div className="home-film__controls">
          <button type="button" onClick={togglePlay} aria-label={playing ? copy.pause : copy.play} title={playing ? copy.pause : copy.play}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" onClick={toggleSound} aria-label={muted ? copy.unmute : copy.mute} title={muted ? copy.unmute : copy.mute}>
            {muted ? <MutedIcon /> : <VolumeIcon />}
          </button>
        </div>
      </div>
    </section>
  );
}
