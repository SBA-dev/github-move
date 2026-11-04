import type { Matiere, Niveau } from "../../catalogue/domain/index.ts";
import { partiesDuParcours } from "./partie-du-parcours.ts";
import { estUneLeconReussie, type LeconId, type Parcours } from "./parcours.ts";

export type Defi = Readonly<{ matiere: Matiere; niveau: Niveau; numero: number; lecons: readonly LeconId[] }>;

export function defisDeLaMatiere(parcours: Parcours, matiere: Matiere, niveau: Niveau): Defi[] {
  return partiesDuParcours(parcours)
    .slice(0, -1)
    .map(({ numero, lecons }) => ({ matiere, niveau, numero, lecons }));
}

export type GrandDefi = Readonly<{ matiere: Matiere; niveau: Niveau; lecons: readonly LeconId[] }>;

export function grandDefiDeLaMatiere(parcours: Parcours, matiere: Matiere, niveau: Niveau): GrandDefi | undefined {
  const lecons = partiesDuParcours(parcours).flatMap((partie) => partie.lecons);
  return lecons.length === 0 ? undefined : { matiere, niveau, lecons };
}

export type DefiReleve =
  | Readonly<{ matiere: Matiere; niveau: Niveau; numero: number }>
  | Readonly<{ matiere: Matiere; niveau: Niveau; grandDefi: true }>;

export function estUnGrandDefi(defi: Defi | GrandDefi | DefiReleve): boolean {
  return !("numero" in defi);
}

export type EtatDuDefi =
  | { genre: "aVenir"; leconsRestantes: number }
  | { genre: "ouvert" }
  | { genre: "releve" };

export function etatDuDefi(
  defi: Defi | GrandDefi,
  parcours: Parcours,
  defisReleves: readonly DefiReleve[],
): EtatDuDefi {
  if (defisReleves.some((releve) => estLeMemeDefi(releve, defi))) return { genre: "releve" };
  const leconsRestantes = defi.lecons.filter((lecon) => !estReussieDansLeParcours(parcours, lecon)).length;
  return leconsRestantes === 0 ? { genre: "ouvert" } : { genre: "aVenir", leconsRestantes };
}

export function defiOuvertParLaSeance(
  avant: Parcours,
  apres: Parcours,
  matiere: Matiere,
  niveau: Niveau,
  defisReleves: readonly DefiReleve[],
): Defi | undefined {
  return defisDeLaMatiere(apres, matiere, niveau).find((defi) =>
    etatDuDefi(defi, avant, defisReleves).genre === "aVenir" &&
    etatDuDefi(defi, apres, defisReleves).genre === "ouvert"
  );
}

function estLeMemeDefi(a: DefiReleve, b: Defi | GrandDefi | DefiReleve): boolean {
  return a.matiere.code === b.matiere.code && a.niveau.valeur === b.niveau.valeur &&
    numeroDuDefi(a) === numeroDuDefi(b);
}

export function numeroDuDefi(defi: Defi | GrandDefi | DefiReleve): number | undefined {
  return "numero" in defi ? defi.numero : undefined;
}

function estReussieDansLeParcours(parcours: Parcours, id: LeconId): boolean {
  const etat = parcours.lecons.find(({ lecon }) => lecon === id)?.etat;
  return etat !== undefined && estUneLeconReussie(etat);
}
