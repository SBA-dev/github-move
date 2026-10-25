import { SEUIL_DE_LECON_ACQUISE, SEUIL_DE_LECON_REUSSIE } from "../../apprentissage/domain/index.ts";
import type { LeconId } from "../../apprentissage/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import type { EntreesDuSuivi } from "./entrees-du-suivi.ts";

export function leconsDeLaClasseEnCours(entrees: EntreesDuSuivi): readonly Lecon[] {
  return entrees.lecons.filter((lecon) => lecon.niveau.valeur === entrees.enfant.niveau.valeur);
}

export function meilleuresEtoilesDeLaLecon(entrees: EntreesDuSuivi, lecon: LeconId): number {
  return entrees.meilleuresEtoiles.find((lue) => lue.lecon === lecon)?.etoiles ?? 0;
}

export function leconReussie(entrees: EntreesDuSuivi, lecon: LeconId): boolean {
  return meilleuresEtoilesDeLaLecon(entrees, lecon) >= SEUIL_DE_LECON_REUSSIE ||
    entrees.leconsReussiesAuTestDeDepart.includes(lecon);
}

export function leconAcquise(entrees: EntreesDuSuivi, lecon: LeconId): boolean {
  return meilleuresEtoilesDeLaLecon(entrees, lecon) >= SEUIL_DE_LECON_ACQUISE;
}

export function leconTravailleeEnSeance(entrees: EntreesDuSuivi, lecon: LeconId): boolean {
  return entrees.seances.some((seance) => seance.lecon === lecon);
}
