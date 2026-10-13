"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motionReduced } from "./motion";

/** `auto` suit les préférences de mouvement ; un clic du visiteur les emporte. */
type Intent = "auto" | "paused" | "playing";

/**
 * La lecture d'un film muet : il ne joue que visible, onglet au premier plan, et
 * jamais de lui-même quand le mouvement est réduit (réglage du système ou du site,
 * événement `signal-preference`). Dans ce cas, `play()` n'est jamais appelé : avec
 * `preload="none"`, rien n'est téléchargé avant que le visiteur ne demande la lecture.
 * Un fichier absent ou illisible arrête les tentatives : l'affiche, ou le repli
 * dessiné sous la vidéo, reste en place. `video` se pose sur l'élément `<video>`.
 */
export function useFilmPlayback(source: string, threshold = 0.25) {
  const video = useRef<HTMLVideoElement>(null);
  const intent = useRef<Intent>("auto");
  const visible = useRef(false);
  const failed = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  const [muted, setMuted] = useState(true);

  const apply = useCallback(() => {
    const media = video.current;
    if (!media) return;
    const wanted = intent.current === "playing" || (intent.current === "auto" && !motionReduced());
    if (wanted && visible.current && !document.hidden && !failed.current) void media.play().catch(() => setPlaying(false));
    else media.pause();
  }, []);

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    failed.current = false;
    setBroken(false);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; apply(); }, { threshold });
    const fail = () => { failed.current = true; setBroken(true); setPlaying(false); };
    observer.observe(media);
    media.addEventListener("error", fail);
    preference.addEventListener("change", apply);
    window.addEventListener("signal-preference", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      observer.disconnect();
      media.removeEventListener("error", fail);
      preference.removeEventListener("change", apply);
      window.removeEventListener("signal-preference", apply);
      document.removeEventListener("visibilitychange", apply);
      media.pause();
    };
  }, [apply, source, threshold]);

  const toggle = () => {
    intent.current = playing ? "paused" : "playing";
    apply();
  };

  /** Le son, coupé par défaut ; l'activer lance la lecture si le film est arrêté. */
  const toggleSound = () => {
    const media = video.current;
    if (!media) return;
    media.muted = !media.muted;
    setMuted(media.muted);
    if (!media.muted && media.paused) toggle();
  };

  return {
    video,
    muted,
    toggleSound,
    playing,
    broken,
    toggle,
    events: { onPlay: () => setPlaying(true), onPause: () => setPlaying(false) },
  };
}
