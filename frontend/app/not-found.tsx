import Link from "next/link";

import { getLang } from "@/lib/lang";
import "./guard-landing.css";
import "./guard-home.css";
import "./guard-footer.css";

/** Une adresse que le site ne sert pas : un mot, et le chemin de l'accueil. */
export default async function NotFound() {
  const fr = (await getLang()) === "fr";
  return (
    <main id="main" className="guard-landing guard-home xweb">
      <div className="guard-wrap studio-legal">
        <h1>{fr ? "Page introuvable" : "Page not found"}</h1>
        <p>{fr ? "Cette adresse n’existe pas sur ce site." : "This address does not exist on this site."}</p>
        <p><Link href="/">{fr ? "Retour à l’accueil" : "Back to the home page"}</Link></p>
      </div>
    </main>
  );
}
