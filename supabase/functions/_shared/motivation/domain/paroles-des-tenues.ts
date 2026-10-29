import { accorder } from "./accord.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";
import type { EtatDesTenues, TenueDuPersonnageGuide } from "./tenues.ts";

export function titreDeLAnnonceDeLaTenue(personnage: PersonnageGuide): string {
  return `Pour ${personnage.nom}`;
}

export function annonceDeLaTenueRecue(personnage: PersonnageGuide, tenue: TenueDuPersonnageGuide): string {
  return `${personnage.nom} a reçu ${tenue.nom} !`;
}

export function descriptionDuPersonnageGuide(
  personnage: PersonnageGuide,
  tenue: TenueDuPersonnageGuide | undefined,
): string {
  return tenue === undefined ? personnage.nom : `${personnage.nom}, avec ${tenue.nom}`;
}

export function titreDeLaSectionDesTenues(personnage: PersonnageGuide): string {
  return `Les tenues de ${personnage.nom}`;
}

export function phraseDeLEtatDesTenues(personnage: PersonnageGuide, { prochainPalier }: EtatDesTenues): string {
  if (prochainPalier === undefined) return `${personnage.nom} a reçu toutes ses tenues !`;
  const manquantes = accorder(prochainPalier.etoilesManquantes, "étoile");
  return `Encore ${manquantes} et ${personnage.nom} recevra ${prochainPalier.tenue.nom} !`;
}

export function descriptionDeLaSectionDesTenues(personnage: PersonnageGuide, { tenuesRecues }: EtatDesTenues): string {
  return `${titreDeLaSectionDesTenues(personnage)}, avec ${accorder(tenuesRecues.length, "tenue")}`;
}
