import { LINKEDIN_PATH } from "@/lib/site-copy";

/** Le logo LinkedIn, dans la couleur du texte qui l'entoure (blanc sur fond marine). */
export function LinkedInMark({ className = "linkedin-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="3 3 18 18" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d={LINKEDIN_PATH} />
    </svg>
  );
}
