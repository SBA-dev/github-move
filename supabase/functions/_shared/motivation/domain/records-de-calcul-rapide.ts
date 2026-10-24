import type { Lecon } from "../../catalogue/domain/index.ts";

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
  _lecons: readonly Lecon[],
): PastilleDeRecord[] {
  return records.map((record) => ({ ...record, libelle: record.exercice }));
}
