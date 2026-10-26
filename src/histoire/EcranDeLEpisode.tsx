import { useCallback, useEffect } from "react";
import {
  type Episode,
  type EtatDeLHistoire,
  episodeOuvert,
  episodeSuivant,
  positionDeLEpisode,
  texteALireDeLEpisode,
  type Univers,
} from "@domain/motivation";
import { motsDeLaConsigne } from "@domain/voix";
import type { ProfilEnCours } from "@domain/famille";
import { useHistoire } from "../medailles/useHistoire.ts";
import { TexteSurligne } from "../seance/TexteSurligne.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
  readonly numero: number;
  readonly onFermerLeLivre: () => void;
  readonly onEpisodeSuivant: (numero: number) => void;
};

function episodeALire(histoire: EtatDeLHistoire | undefined, numero: number): Episode | undefined {
  if (histoire === undefined) return undefined;
  try {
    return episodeOuvert(histoire, numero);
  } catch {
    return undefined;
  }
}

function nombreDeMots(texte: string): number {
  return motsDeLaConsigne(texte).filter(({ rang }) => rang !== undefined).length;
}

/** L'écran d'un épisode ouvert : le texte lu par le personnage guide du profil, mot à mot. Un épisode fermé ou illisible ramène d'où l'enfant vient. */
export function EcranDeLEpisode({ profil, univers, voix, numero, onFermerLeLivre, onEpisodeSuivant }: Props) {
  const { chargee, histoire } = useHistoire(profil.id);
  const episode = episodeALire(histoire, numero);
  useEffect(() => {
    if (chargee && episode === undefined) onFermerLeLivre();
  }, [chargee, episode, onFermerLeLivre]);
  if (histoire === undefined || episode === undefined) return null;
  return (
    <LectureDeLEpisode
      key={episode.numero}
      episode={episode}
      suivant={episodeSuivant(histoire, episode.numero)}
      univers={univers}
      voix={voix}
      onFermerLeLivre={onFermerLeLivre}
      onEpisodeSuivant={onEpisodeSuivant}
    />
  );
}

type PropsDeLaLecture = Pick<Props, "univers" | "voix" | "onFermerLeLivre" | "onEpisodeSuivant"> & {
  readonly episode: Episode;
  readonly suivant: Episode | undefined;
};

function LectureDeLEpisode({ episode, suivant, univers, voix, onFermerLeLivre, onEpisodeSuivant }: PropsDeLaLecture) {
  const { rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  const lire = useCallback(
    () => dire({ texte: episode.texte, aLire: texteALireDeLEpisode(episode), nature: "annonce" }),
    [dire, episode],
  );
  useEffect(() => {
    void lire();
    return faireSilence;
  }, [lire, faireSilence]);

  const rangDansLeTexte = rangDuMotPrononce === undefined ? undefined : rangDuMotPrononce - nombreDeMots(episode.titre);
  const fermerLeLivre = () => {
    faireSilence();
    onFermerLeLivre();
  };

  return (
    <section className="ecran-de-l-episode" aria-labelledby="titre-de-l-episode" data-testid="ecran-de-l-episode">
      <p className="position-de-l-episode" data-testid="position-de-l-episode">{positionDeLEpisode(episode)}</p>
      <h1 id="titre-de-l-episode">{episode.titre}</h1>
      <PersonnageGuide univers={univers} humeur={humeur} />
      <p className="texte-de-l-episode" data-testid="texte-de-l-episode">
        <TexteSurligne texte={episode.texte} rangDuMotPrononce={rangDansLeTexte} />
      </p>
      <div className="actions-de-l-episode">
        <button type="button" className="secondaire" onClick={() => void lire()}>Réécouter</button>
        {suivant && <button type="button" onClick={() => onEpisodeSuivant(suivant.numero)}>Épisode suivant</button>}
        <button type="button" className="secondaire" onClick={fermerLeLivre}>Fermer le livre</button>
      </div>
    </section>
  );
}
