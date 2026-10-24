import type { Exercice, ExerciceFluence, Lecon } from "../../catalogue/domain/index.ts";

export type RecordDuProfil = Readonly<{
  lecon: string;
  exercice: string;
  meilleurScore: number;
}>;

export type PastilleDeRecord = Readonly<{
  lecon: string;
  exercice: string;
  libelle: string;
  meilleurScore: number;
}>;

export function pastillesDesRecords(
  records: readonly RecordDuProfil[],
  lecons: readonly Lecon[],
): PastilleDeRecord[] {
  return records.map((record) => ({ ...record, libelle: libelleDu(record, lecons) }));
}

function libelleDu(record: RecordDuProfil, lecons: readonly Lecon[]): string {
  const lecon = lecons.find((candidate) => candidate.id === record.lecon);
  const fluence = lecon?.exercices.filter(estUneFluence).find((exercice) => cleDe(exercice) === record.exercice);
  return lecon && fluence ? fluence.titre ?? lecon.titre : record.exercice;
}

function estUneFluence(exercice: Exercice): exercice is ExerciceFluence {
  return exercice.type === "fluence";
}

function cleDe(fluence: ExerciceFluence): string {
  return fluence.titre ?? fluence.generateur.op;
}
