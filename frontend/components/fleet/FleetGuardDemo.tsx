type Item = { readonly title: string; readonly body: string; readonly label: string };
type Labels = { readonly title: string; readonly lead: string; readonly items: readonly Item[]; readonly caption: string };
type Media = { readonly id: string; readonly mp4: string; readonly poster: string };

/**
 * Les captures vidéo de Fleet Guard : un secret dans le prompt, puis un secret dans une
 * capture d'écran. Lecteur natif, muet (les captures n'ont pas de son), sans lecture
 * automatique : rien ne se télécharge avant le clic (`preload="none"`), l'affiche montre
 * le résultat.
 */
export function FleetGuardDemo({ labels, media }: { labels: Labels; media: readonly Media[] }) {
  return (
    <section className="fl-gdemo" aria-labelledby="securite-demo-title">
      <header className="fl-gdemo__head">
        <h3 id="securite-demo-title" className="fl-gdemo__title">{labels.title}</h3>
        <p className="fl-gdemo__lead">{labels.lead}</p>
      </header>
      <div className="fl-gdemo__grid">
        {media.map((clip, index) => {
          const item = labels.items[index];
          return (
            <figure key={clip.id} className="fl-gdemo__item" data-clip={clip.id}>
              <div className="fl-gdemo__frame">
                <video className="fl-gdemo__video" src={clip.mp4} poster={clip.poster} controls muted playsInline preload="none" aria-label={item.label} />
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="xp-caption fl-gdemo__caption">{labels.caption}</p>
    </section>
  );
}
