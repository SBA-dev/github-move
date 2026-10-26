import { type CodeDeMatiere, type Lecon, toutesLesMatieres } from "../../catalogue/domain/index.ts";

export type Badge = Readonly<{
  cle: string;
  nom: string;
  matiere: CodeDeMatiere;
  lecons: readonly string[];
}>;

export function nomDuBadge(lecon: Lecon): string {
  return competenceDe(lecon) ?? `Je sais : ${lecon.titre}`;
}

export function badgesDuProfil(acquises: ReadonlySet<string>, lecons: readonly Lecon[]): Badge[] {
  const leconsParCle = new Map<string, Lecon[]>();
  for (const lecon of lecons.filter((candidate) => acquises.has(candidate.id)).sort(comparerDansLeCatalogue)) {
    const cle = cleDuBadge(lecon);
    leconsParCle.set(cle, [...(leconsParCle.get(cle) ?? []), lecon]);
  }
  return [...leconsParCle].map(([cle, leconsDuBadge]) => ({
    cle,
    nom: nomDuBadge(leconsDuBadge[0]),
    matiere: leconsDuBadge[0].matiere.code,
    lecons: leconsDuBadge.map((lecon) => lecon.id),
  }));
}

function competenceDe(lecon: Lecon): string | undefined {
  const competence = lecon.competence?.trim();
  return competence ? competence : undefined;
}

function cleDuBadge(lecon: Lecon): string {
  return competenceDe(lecon) ?? `lecon:${lecon.id}`;
}

function comparerDansLeCatalogue(a: Lecon, b: Lecon): number {
  return rangDeLaMatiere(a) - rangDeLaMatiere(b) || comparerNiveaux(a, b) || a.ordre - b.ordre;
}

function rangDeLaMatiere(lecon: Lecon): number {
  return toutesLesMatieres().findIndex((matiere) => matiere.code === lecon.matiere.code);
}

function comparerNiveaux(a: Lecon, b: Lecon): number {
  if (a.niveau.estAuDessusDe(b.niveau)) return 1;
  return b.niveau.estAuDessusDe(a.niveau) ? -1 : 0;
}
