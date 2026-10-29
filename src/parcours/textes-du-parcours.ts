import { libelleCourtDe } from "@domain/catalogue";
import type { CodeDeMatiere, Niveau } from "@domain/catalogue";
import type { EtatDansLeParcours, LeconDuParcours, LeconReussieDUneClasseAuDessus } from "@domain/apprentissage";
import { etoilesSurTrois } from "../seance/fin-de-seance/texte-des-etoiles.ts";

export const AUCUNE_LECON_POUR_LA_CLASSE = "Aucune leçon pour ta classe pour l'instant.";

export function libelleDeLOnglet(matiere: CodeDeMatiere): string {
  return libelleCourtDe(matiere);
}

export function compteurDuParcours(reussies: number, total: number): string {
  return `${reussies} leçon${reussies > 1 ? "s réussies" : " réussie"} sur ${total}`;
}

export function libelleDeLEtat(lecon: { readonly etat: EtatDansLeParcours }): string {
  switch (lecon.etat.genre) {
    case "reussie":
      return "Réussie";
    case "reussieAuTestDeDepart":
      return "Test de départ";
    case "prochaine":
      return "À toi !";
    case "aDecouvrir":
      return "À découvrir";
  }
}

/** Ce que lit un lecteur d'écran pour une leçon du parcours. */
export function annonceDeLaLecon(lecon: LeconDuParcours): string {
  return `${lecon.titre} : ${reussiteDeLEtat(lecon.etat)}`;
}

export function titreDesLeconsDejaReussies(niveau: string): string {
  return `Déjà réussies en ${niveau}`;
}

/** Ce que lit un lecteur d'écran pour une leçon réussie d'une classe au-dessus. */
export function annonceDeLaLeconDUneClasseAuDessus(lecon: LeconReussieDUneClasseAuDessus): string {
  const reussite = lecon.etoiles ? `réussie, ${etoilesSurTrois(lecon.etoiles.nombre)}` : "réussie au test de départ";
  return `${lecon.titre}, ${lecon.niveau.valeur} : ${reussite}`;
}

export function reussiteDeLEtat(etat: EtatDansLeParcours): string {
  switch (etat.genre) {
    case "reussie":
      return `réussie, ${etoilesSurTrois(etat.etoiles.nombre)}`;
    case "reussieAuTestDeDepart":
      return "réussie au test de départ";
    case "prochaine":
      return "à toi !";
    case "aDecouvrir":
      return "à découvrir";
  }
}

export const TITRE_DES_LECONS_DES_CLASSES_D_AVANT = "Leçons des classes d'avant";

export function nombreDeLecons(nombre: number): string {
  return `${nombre} leçon${nombre > 1 ? "s" : ""}`;
}

export function titreDuBlocDesClassesDAvant(nombre: number): string {
  return `${TITRE_DES_LECONS_DES_CLASSES_D_AVANT} (${nombre})`;
}

export function annonceDuBlocDesClassesDAvant(nombre: number): string {
  return `${TITRE_DES_LECONS_DES_CLASSES_D_AVANT}, ${nombreDeLecons(nombre)}`;
}

/** Ce que lit un lecteur d'écran pour une leçon des classes d'avant dans « Mon parcours ». */
export function annonceDeLaLeconDesClassesDAvant(lecon: { readonly titre: string; readonly niveau: Niveau; readonly etat: EtatDansLeParcours }): string {
  return `${lecon.titre}, ${lecon.niveau.valeur} : ${reussiteDeLEtat(lecon.etat)}`;
}

export const SOUS_TITRE_DU_PARCOURS = "Ma carte au trésor";

/** Le nom de l'arrêt où le personnage guide se tient quand la matière est réussie. */
export const NOM_DE_LA_FIN_DU_DESSIN = "fin";

/** Ce que lit un lecteur d'écran quand le personnage guide arrive, une seule fois. */
export function annonceDeLArriveeDuPersonnageGuide(nomDuPersonnageGuide: string, arret: string): string {
  return arret === NOM_DE_LA_FIN_DU_DESSIN
    ? `${nomDuPersonnageGuide} arrive à la fin du parcours`
    : `${nomDuPersonnageGuide} arrive à la leçon ${arret}`;
}
