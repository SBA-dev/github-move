import { annonceDeLEpisodeOuvert, annonceLueDeLEpisodeOuvert, type Episode, titreDeLAnnonceDeLEpisode } from "@domain/motivation";

type Props = { readonly episode: Episode | undefined };

/** L'encart de fin de séance : l'épisode que la séance vient d'ouvrir. Vide, il disparaît ; il n'est pas lu à voix haute, mais annoncé aux lecteurs d'écran. */
export function AnnonceDuNouvelEpisode({ episode }: Props) {
  return (
    <div
      className="pour-l-episode"
      role="status"
      aria-label={episode && annonceLueDeLEpisodeOuvert(episode)}
      data-testid="annonce-du-nouvel-episode"
    >
      {episode && (
        <>
          <strong>{titreDeLAnnonceDeLEpisode()}</strong>
          <p>{annonceDeLEpisodeOuvert(episode)}</p>
        </>
      )}
    </div>
  );
}
