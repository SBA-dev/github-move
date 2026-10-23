import { LeconMalFormee } from "./erreurs.ts";

export type Objet = Readonly<Record<string, unknown>>;

export function enObjet(valeur: unknown, quoi: string): Objet {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    throw new LeconMalFormee(`${quoi} n'est pas un objet`);
  }
  return Object.fromEntries(Object.entries(valeur));
}

export function texteRequis(valeur: unknown, quoi: string): string {
  if (typeof valeur !== "string" || valeur === "") throw new LeconMalFormee(`${quoi} manque`);
  return valeur;
}

export function texteFacultatif(valeur: unknown, quoi: string): string | undefined {
  if (valeur === undefined) return undefined;
  if (typeof valeur !== "string") throw new LeconMalFormee(`${quoi} n'est pas un texte`);
  return valeur;
}

export function nombreRequis(valeur: unknown, quoi: string): number {
  if (typeof valeur !== "number" || !Number.isFinite(valeur)) throw new LeconMalFormee(`${quoi} n'est pas un nombre`);
  return valeur;
}

export function nombreFacultatif(valeur: unknown, quoi: string): number | undefined {
  return valeur === undefined ? undefined : nombreRequis(valeur, quoi);
}

export function liste(valeur: unknown, quoi: string): readonly unknown[] {
  if (!Array.isArray(valeur)) throw new LeconMalFormee(`${quoi} n'est pas une liste`);
  return Object.freeze([...valeur]);
}

export function listeFacultative(valeur: unknown, quoi: string): readonly unknown[] | undefined {
  return valeur === undefined ? undefined : liste(valeur, quoi);
}

export function listeDeTextes(valeur: unknown, quoi: string): readonly string[] {
  const textes = liste(valeur, quoi).map((texte) => texteDeListe(texte, quoi));
  return Object.freeze(textes);
}

function texteDeListe(valeur: unknown, quoi: string): string {
  if (typeof valeur !== "string") throw new LeconMalFormee(`${quoi} contient autre chose que du texte`);
  return valeur;
}
