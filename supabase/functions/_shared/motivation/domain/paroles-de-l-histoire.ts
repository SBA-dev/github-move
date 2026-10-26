import { type Episode, HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";

export function titreDeLaSectionDeLHistoire(): string {
  return "L'histoire des Savanturiers";
}

export function sousTitreDeLaSectionDeLHistoire(): string {
  return "Un nouvel épisode s'ouvre à chaque séance terminée.";
}

export function parolesDeLaSectionDeLHistoire(): readonly string[] {
  return [titreDeLaSectionDeLHistoire(), sousTitreDeLaSectionDeLHistoire()];
}

export function positionDeLEpisode(episode: Episode): string {
  return `Épisode ${episode.numero} sur ${HISTOIRE_DES_SAVANTURIERS.length}`;
}

export function texteALireDeLEpisode(episode: Episode): string {
  return `${episode.titre}. ${episode.texte}`;
}

export function titreDeLAnnonceDeLEpisode(): string {
  return "Nouvel épisode !";
}

export function annonceDeLEpisodeOuvert(episode: Episode): string {
  return episode.titre;
}

export function annonceLueDeLEpisodeOuvert(episode: Episode): string {
  return `${titreDeLAnnonceDeLEpisode()} ${annonceDeLEpisodeOuvert(episode)}`;
}

export function finDePhraseDeLEpisode(): string {
  return "Un nouvel épisode de l'histoire t'attend !";
}
