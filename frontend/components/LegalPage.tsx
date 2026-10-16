import { Brand } from "@/components/site/Brand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { brandName, CONTACT_EMAIL } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";
import "@/app/guard-landing.css";
import "@/app/guard-home.css";
import "@/app/guard-footer.css";

/**
 * Les pages légales, communes aux trois adresses (ai.xsom.fr, fleet.xsom.fr,
 * guard.xsom.fr) : le texte est le même, l'en-tête et le pied de page prennent la
 * marque de l'adresse demandée. Documents en français.
 */
const documents = {
  "mentions-legales": {
    title: "Mentions légales",
    sections: [
      ["Éditeur", "Les sites ai.xsom.fr, fleet.xsom.fr et guard.xsom.fr sont édités par XSOM CONSULTING, société par actions simplifiée au capital de 6 000 €. Siège social : 2 allée Pierre Latécoère, 33120 Arcachon, France. SIREN : 498 029 289. SIRET : 498 029 289 00036. RCS Bordeaux : 498 029 289. TVA intracommunautaire : FR80 498 029 289."],
      ["Publication et contact", `Directeur de la publication : Julian Talou. Contact : ${CONTACT_EMAIL}. Téléphone : +33 (0)6 23 02 40 31.`],
      ["Hébergement", "Les sites sont hébergés par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Téléphone publié par Vercel : +1 559 288 7060. Informations complémentaires : vercel.com/legal."],
      ["Propriété intellectuelle", "Les textes, les films, les graphismes et les marques de ces sites restent la propriété de XSOM CONSULTING, qui en réserve tous les droits, ou de leurs titulaires. Secret Guard est un logiciel open source publié sous licence Apache-2.0 dans son dépôt public ; cette licence s’applique à son code, pas aux contenus de ces sites. Les marques citées appartiennent à leurs détenteurs respectifs et ne servent qu’à nommer les outils concernés."],
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    draft: "Informations à compléter : durées de conservation des journaux d’hébergement et garanties applicables aux transferts hors Espace économique européen (l’hébergeur et le prestataire d’envoi d’emails sont établis aux États-Unis). Cette page ne constitue pas encore une politique finalisée.",
    sections: [
      ["Responsable et périmètre", `XSOM CONSULTING est le responsable des traitements liés à ces sites. Contact pour les données personnelles : ${CONTACT_EMAIL}, ou par courrier au 2 allée Pierre Latécoère, 33120 Arcachon. Ces sites n’ont ni compte, ni connexion ; ai.xsom.fr propose un formulaire de contact, qui sert aussi aux formulaires de www.xsom.fr. Cette page distingue la consultation, la recherche dans le glossaire et les échanges par email ou par ce formulaire.`],
      ["Consultation des sites", "L’hébergement implique le traitement de données techniques de connexion, notamment l’adresse IP et les informations de requête. Elles servent au fonctionnement et à la sécurité des sites. Le navigateur mémorise également vos choix de langue et d’affichage. Consultez la page Cookies et préférences pour leur détail."],
      ["Recherche dans le glossaire", "Quand elle est disponible, la recherche du glossaire des menaces envoie le texte que vous tapez (600 caractères au plus) à Mistral AI, prestataire établi en France, pour classer les menaces pertinentes ; elle n’envoie rien d’autre. Sans elle, un filtrage textuel local s’applique dans votre navigateur. N’y saisissez ni donnée personnelle, ni information confidentielle."],
      ["Contact", "Si vous nous écrivez, par email ou par le formulaire de contact, nous recevons votre nom, votre adresse email, votre entreprise si vous l’indiquez et les informations que vous choisissez d’inclure dans votre message, afin de répondre à votre demande. Le formulaire nous transmet votre demande par email, par l’intermédiaire de Resend (Resend, Inc., États-Unis), prestataire d’envoi d’emails. Évitez de transmettre des secrets, mots de passe ou données sensibles. Les échanges préparant une prestation relèvent des mesures précontractuelles prises à votre demande ; les autres demandes sont traitées pour notre intérêt légitime à répondre aux sollicitations."],
      ["Destinataires et conservation", "Les personnes habilitées chez xSOM et les prestataires nécessaires aux sites peuvent traiter les données correspondant à leurs missions : Vercel pour l’hébergement, Resend pour l’acheminement des demandes envoyées par le formulaire, et Mistral AI pour la recherche du glossaire quand elle est disponible. Les durées effectives de conservation restent à documenter. Nous ne présentons donc pas ces sites comme ne conservant aucune donnée."],
      ["Vos droits", `Selon le traitement et sa base légale, vous pouvez demander l’accès, la rectification, l’effacement, la limitation, l’opposition et la portabilité de vos données. Écrivez à ${CONTACT_EMAIL} en précisant votre demande. Vous pouvez également saisir la CNIL sur cnil.fr.`],
    ],
  },
  cookies: {
    title: "Cookies et préférences",
    sections: [
      ["Langue", "Le cookie xsom_lang mémorise la langue choisie pendant un an, séparément sur chacune des trois adresses. Il permet au serveur d’afficher directement le site dans cette langue."],
      ["Affichage", "La clé xsom-signal-preferences du stockage local conserve vos réglages d’affichage et de réduction des animations dans ce navigateur. Ces préférences restent présentes jusqu’à leur modification ou à l’effacement des données du site."],
      ["Vos réglages", "Vous pouvez ajuster l’affichage depuis le pied de page, changer la langue dans le menu et effacer les cookies et données du site dans les paramètres de votre navigateur. L’effacement peut réinitialiser vos préférences. Aucun cookie de connexion, de publicité ou de mesure d’audience n’est utilisé par ces sites."],
    ],
  },
  "conditions-utilisation": {
    title: "Conditions d’utilisation",
    sections: [
      ["Objet des sites", "Ces sites présentent les prestations de conseil et les produits de la division IA de xSOM Consulting : xSOM Fleet et Secret Guard. Les contenus pédagogiques et les illustrations facilitent la compréhension ; ils ne constituent pas un audit de votre environnement ni une garantie de protection exhaustive."],
      ["Utilisation des sites", "Utilisez les sites dans le respect du droit applicable et des droits des tiers. Ne tentez pas d’accéder à des données ou systèmes sans autorisation. Vous êtes responsable des informations que vous nous transmettez."],
      ["Produits et prestations", "Secret Guard est régi par sa licence open source. Les offres de xSOM Fleet et les missions de conseil font l’objet de documents contractuels précisant leur périmètre, prix, support et conditions applicables avant souscription. Ces conditions d’utilisation des sites ne remplacent pas ces contrats et ne constituent pas des conditions générales de vente."],
      ["Disponibilité et liens externes", `Les sites peuvent évoluer ou être interrompus pour maintenance. Les liens vers des sites tiers conduisent vers des services soumis à leurs propres conditions et politiques de confidentialité. Signalez toute erreur ou difficulté à ${CONTACT_EMAIL}.`],
    ],
  },
} as const;

export type LegalDocument = keyof typeof documents;
export function legalTitle(document: LegalDocument) { return documents[document].title; }

export function LegalPage({ document, site }: { document: LegalDocument; site: Site }) {
  const copy = documents[document];
  return <main className="guard-landing guard-home">
    <header className="guard-header"><div className="guard-wrap guard-header__inner"><Brand site={site} /><SiteNav site={site} /></div></header>
    <article className="guard-wrap studio-legal" lang="fr">
      <p className="guard-kicker">{brandName(site)} · Informations légales</p>
      <h1>{copy.title}</h1><p>Version du 13 octobre 2026 · Document en français</p>
      {"draft" in copy && <p className="studio-legal__draft">{copy.draft}</p>}
      {copy.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      <section><h2>Liens utiles</h2><p><a href={`mailto:${CONTACT_EMAIL}`}>Contacter xSOM</a> · <a href="https://www.cnil.fr/fr/plaintes">Saisir la CNIL</a> · <a href="https://vercel.com/legal">Informations Vercel</a></p></section>
    </article>
    <SiteFooter site={site} />
  </main>;
}
