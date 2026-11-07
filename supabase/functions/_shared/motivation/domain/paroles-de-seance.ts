import type { Hasard } from "./hasard.ts";
import type { Humeur } from "./humeur.ts";
import { feliciter, tirerDans } from "./paroles.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";
import { vocatif, vocatifApresVirgule } from "./vocatif.ts";

export type InvitationAJouer = { readonly texte: string; readonly humeur: Humeur };

const INVITATIONS_A_JOUER: readonly string[] = [
  "À toi de jouer maintenant !",
  "C'est parti, à toi !",
  "Prêt ? On joue !",
];

const ANNONCES_D_EXERCICE: readonly string[] = [
  "Nouveau jeu",
  "Jeu suivant",
  "Place au jeu",
];

function accueil(prenom?: string): string {
  return `Coucou${
    vocatif(prenom)
  } ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.`;
}

export function accueillirSurLaPageDeLaLecon(prenom: string): string {
  return accueil(prenom);
}

export function accueillirSurLaPageDeLaLeconSansPrenom(): string {
  return accueil();
}

export function inviterAJouerApresLesEtapes(hasard: Hasard): InvitationAJouer {
  return { texte: tirerDans(INVITATIONS_A_JOUER, hasard), humeur: "applaudit" };
}

function finDeSeance(etoiles: number, personnageGuide: PersonnageGuide, hasard: Hasard, prenom?: string): string {
  if (etoiles === 3) {
    return `${tirerDans(personnageGuide.expressions, hasard)} Trois étoiles${
      vocatifApresVirgule(prenom)
    } ! Tu es incroyable !`;
  }
  const pluriel = etoiles > 1 ? "s" : "";
  return `${feliciter(personnageGuide, hasard).texte} Tu gagnes ${etoiles} étoile${pluriel}${
    vocatifApresVirgule(prenom)
  }. Tu rejoues pour aller chercher les autres ?`;
}

export function parolesDeFinDeSeance(
  etoiles: number,
  prenom: string,
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
): string {
  return finDeSeance(etoiles, personnageGuide, hasard, prenom);
}

export function parolesDeFinDeSeanceSansPrenom(
  etoiles: number,
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
): string {
  return finDeSeance(etoiles, personnageGuide, hasard);
}

export function annoncerExerciceSuivant(titre: string, hasard: Hasard): string {
  return `${tirerDans(ANNONCES_D_EXERCICE, hasard)} : ${titre} !`;
}
