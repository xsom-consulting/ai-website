/**
 * Les mots communs aux sections de film et d'exposition : le lecteur du film
 * d'ouverture (partagé par les trois sites) et la section « Vos équipes face à l'IA ».
 */
export const HOME_COPY = {
  fr: {
    film: {
      label: "Film d’introduction",
      play: "Lecture",
      pause: "Pause",
      unmute: "Activer le son",
      mute: "Couper le son",
      next: "Découvrir",
    },
    exposure: {
      kicker: "03 · Vos équipes face à l’IA",
      risks: "Les risques · cliquer pour agrandir",
      readThreat: "Lire la fiche",
      teams: "Les équipes",
      close: "Fermer",
      enlarge: "Agrandir",
      attack: "Ce qui peut se passer",
      mitigation: "Comment réduire le risque",
      fullSheet: "Lire la fiche complète",
      closePreview: "Fermer l’aperçu",
    },
  },
  en: {
    film: {
      label: "Introduction film",
      play: "Play",
      pause: "Pause",
      unmute: "Turn sound on",
      mute: "Turn sound off",
      next: "Discover",
    },
    exposure: {
      kicker: "03 · Your teams and AI",
      risks: "Risks · click to enlarge",
      readThreat: "Read the explanation",
      teams: "Teams",
      close: "Close",
      enlarge: "Enlarge",
      attack: "What can happen",
      mitigation: "How to reduce the risk",
      fullSheet: "Read the full explanation",
      closePreview: "Close preview",
    },
  },
} as const;

export type HomeCopy = (typeof HOME_COPY)[keyof typeof HOME_COPY];
