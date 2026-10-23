import { Niveau } from "@domain/catalogue";
import { lireCleUnivers, ParentId, Prenom, ProfilEnfant, ProfilEnfantId, Reglages, type ReglagesBruts } from "@domain/famille";
import { enReglagesComplets, estUnReglagesBruts } from "../../reglages/index.ts";

/** Un profil enfant tel que le front le lit ou le garde sur l'appareil : jamais utilisé hors de ce dossier. */
export type LigneDeProfil = {
  readonly id: string;
  readonly prenom: string;
  readonly niveau: string;
  readonly univers: string;
  readonly creeLe: string;
  readonly parents: readonly string[];
  /** Absents d'une copie gardée avant les réglages : les valeurs par défaut s'appliquent. */
  readonly reglages?: ReglagesBruts;
};

export function estUneLigneDeProfil(valeur: unknown): valeur is LigneDeProfil {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { id, prenom, niveau, univers, creeLe, parents, reglages } = valeur as Record<string, unknown>;
  return typeof id === "string" && typeof prenom === "string" && typeof niveau === "string" &&
    typeof univers === "string" && typeof creeLe === "string" && Array.isArray(parents) &&
    parents.every((parent) => typeof parent === "string") &&
    (reglages === undefined || estUnReglagesBruts(reglages));
}

export function enProfilEnfant(ligne: LigneDeProfil): ProfilEnfant {
  return ProfilEnfant.reconstituer(
    ProfilEnfantId.de(ligne.id),
    Prenom.de(ligne.prenom),
    Niveau.de(ligne.niveau),
    lireCleUnivers(ligne.univers),
    new Date(ligne.creeLe),
    ligne.parents.map(ParentId.de),
    Reglages.depuis(ligne.reglages ?? {}),
  );
}

export function enLigneDeProfil(profil: ProfilEnfant): LigneDeProfil {
  return {
    id: profil.id.valeur,
    prenom: profil.prenom.valeur,
    niveau: profil.niveau.valeur,
    univers: profil.univers,
    creeLe: profil.creeLe.toISOString(),
    parents: profil.rattaches.map((parent) => parent.valeur),
    reglages: enReglagesComplets(profil.reglages),
  };
}
