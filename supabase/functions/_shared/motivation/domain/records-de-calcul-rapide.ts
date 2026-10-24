import type { ExerciceFluence, Lecon } from "../../catalogue/domain/index.ts";

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
  const fluence = lecon?.exercices.find((exercice) => exercice.type === "fluence" && cleDe(exercice) === record.exercice);
  if (lecon === undefined || fluence === undefined) return record.exercice;
  return fluence.titre ?? lecon.titre;
}

function cleDe(fluence: ExerciceFluence): string {
  return fluence.titre ?? fluence.generateur.op;
}
