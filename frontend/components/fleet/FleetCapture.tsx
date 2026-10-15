"use client";

import Image from "next/image";
import { useRef } from "react";

type Capture = { readonly webp: string; readonly png: string; readonly width: number; readonly height: number };

/**
 * Une capture probante en vignette : un clic l'ouvre en grand dans une boîte de dialogue
 * native (Échap, le bouton ou un clic à côté la ferment). L'image garde sa taille lisible ; sur un petit
 * écran, elle défile dans son cadre, jamais la page. Le fichier PNG reste la source ;
 * la page sert le WebP, sans perte.
 */
export function FleetCapture({ image, alt, open, close }: { image: Capture; alt: string; open: string; close: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  /** Sur un écran étroit, le relevé s'ouvre sur sa colonne des coûts, à droite. */
  const show = () => {
    dialog.current?.showModal();
    frame.current?.scrollTo({ left: frame.current.scrollWidth });
  };

  return (
    <div className="fl-capture">
      <button type="button" className="fl-capture__thumb" onClick={show} aria-haspopup="dialog">
        <Image src={image.webp} alt={alt} width={image.width} height={image.height} unoptimized sizes="20rem" />
        <span>{open}</span>
      </button>
      <dialog
        ref={dialog}
        className="fl-capture__dialog"
        aria-label={open}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      >
        <div className="fl-capture__frame">
          <button type="button" className="fl-capture__close" onClick={() => dialog.current?.close()}>{close} <span aria-hidden="true">×</span></button>
          <div ref={frame} className="fl-capture__scroll" tabIndex={0}>
            <Image src={image.webp} alt={alt} width={image.width} height={image.height} unoptimized />
          </div>
        </div>
      </dialog>
    </div>
  );
}
