import { useEffect, useState } from "react";
import { type Episode, episodeOuvertParLaSeance } from "@domain/motivation";

export type EpisodeOuvert = { readonly pret: boolean; readonly episode: Episode | undefined };

/**
 * L'épisode que la séance a ouvert, une fois lu le nombre de séances d'avant la séance.
 * Sans lui (lecture impossible), aucun épisode n'est annoncé.
 */
export function useEpisodeOuvertParLaSeance(
  nombreAvant: Promise<number | undefined>,
  terminee: boolean,
): EpisodeOuvert {
  const [ouvert, setOuvert] = useState<EpisodeOuvert>({ pret: false, episode: undefined });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void nombreAvant
      .then(episodeOuvertParLaSeance)
      .catch(() => undefined)
      .then((episode) => {
        if (!annule) setOuvert({ pret: true, episode });
      });
    return () => {
      annule = true;
    };
  }, [nombreAvant, terminee]);
  return ouvert;
}
