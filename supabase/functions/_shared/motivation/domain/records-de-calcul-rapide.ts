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
  return records
    .map((record) => ({ record, position: positionDans(record, lecons) }))
    .toSorted((a, b) => comparerDansLeParcours(a, b))
    .map(({ record }) => ({ ...record, libelle: libelleDu(record, lecons) }));
}

type Position = Readonly<{ lecon: Lecon; rang: number }>;
type RecordPositionne = Readonly<{ record: RecordDuProfil; position: Position | undefined }>;

function positionDans(record: RecordDuProfil, lecons: readonly Lecon[]): Position | undefined {
  const lecon = lecons.find((candidate) => candidate.id === record.lecon);
  const rang = lecon?.exercices.findIndex((exercice) => estLaFluenceDuRecord(exercice, record)) ?? -1;
  return lecon && rang >= 0 ? { lecon, rang } : undefined;
}

function comparerDansLeParcours(a: RecordPositionne, b: RecordPositionne): number {
  if (a.position && b.position) return comparerPositions(a.position, b.position);
  if (a.position) return -1;
  if (b.position) return 1;
  return comparerTexte(cleDuRecord(a.record), cleDuRecord(b.record));
}

function comparerPositions(a: Position, b: Position): number {
  return comparerNiveaux(a.lecon, b.lecon) ||
    a.lecon.ordre - b.lecon.ordre ||
    comparerTexte(a.lecon.id, b.lecon.id) ||
    a.rang - b.rang;
}

function comparerNiveaux(a: Lecon, b: Lecon): number {
  if (a.niveau.estAuDessusDe(b.niveau)) return 1;
  return b.niveau.estAuDessusDe(a.niveau) ? -1 : 0;
}

function comparerTexte(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function cleDuRecord(record: RecordDuProfil): string {
  return `${record.lecon}/${record.exercice}`;
}

function libelleDu(record: RecordDuProfil, lecons: readonly Lecon[]): string {
  const lecon = lecons.find((candidate) => candidate.id === record.lecon);
  const fluence = lecon?.exercices.filter(estUneFluence).find((exercice) => cleDe(exercice) === record.exercice);
  return lecon && fluence ? fluence.titre ?? lecon.titre : record.exercice;
}

function estLaFluenceDuRecord(exercice: Exercice, record: RecordDuProfil): boolean {
  return estUneFluence(exercice) && cleDe(exercice) === record.exercice;
}

function estUneFluence(exercice: Exercice): exercice is ExerciceFluence {
  return exercice.type === "fluence";
}

function cleDe(fluence: ExerciceFluence): string {
  return fluence.titre ?? fluence.generateur.op;
}
