import claudeCode from "@/public/signal-media/hosts/claude-code.png";
import codex from "@/public/signal-media/hosts/codex.png";

/** Les assistants que xSOM Fleet gouverne : des noms de produits, identiques dans les deux langues. */
export const HOSTS = [
  { id: "claude-code", name: "Claude Code", logo: claudeCode },
  { id: "codex", name: "Codex", logo: codex },
] as const;
