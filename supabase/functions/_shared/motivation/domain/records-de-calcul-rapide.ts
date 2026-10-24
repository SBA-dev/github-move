import { cleDeLaFluence, type Exercice, type ExerciceFluence, type Lecon } from "../../catalogue/domain/index.ts";

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
    .map(({ record, position }) => ({ ...record, libelle: libelleDu(record, position) }));
}

type Position = Readonly<{ lecon: Lecon; rang: number; fluence: ExerciceFluence }>;
type RecordPositionne = Readonly<{ record: RecordDuProfil; position: Position | undefined }>;

function positionDans(record: RecordDuProfil, lecons: readonly Lecon[]): Position | undefined {
  const lecon = lecons.find((candidate) => candidate.id === record.lecon);
  const rang = lecon?.exercices.findIndex((exercice) => estLaFluenceDuRecord(exercice, record)) ?? -1;
  const fluence = lecon?.exercices[rang];
  return lecon && fluence && estUneFluence(fluence) ? { lecon, rang, fluence } : undefined;
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

function libelleDu(record: RecordDuProfil, position: Position | undefined): string {
  if (!position) return record.exercice;
  return position.fluence.titre ?? position.lecon.titre;
}

function estLaFluenceDuRecord(exercice: Exercice, record: RecordDuProfil): boolean {
  return estUneFluence(exercice) && cleDeLaFluence(exercice) === record.exercice;
}

function estUneFluence(exercice: Exercice): exercice is ExerciceFluence {
  return exercice.type === "fluence";
}
