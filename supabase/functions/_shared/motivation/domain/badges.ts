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
  const regroupement = new Map<string, { premiere: Lecon; ids: string[] }>();
  for (const lecon of lecons.filter((candidate) => acquises.has(candidate.id)).sort(comparerDansLeCatalogue)) {
    const cle = cleDuBadge(lecon);
    const existant = regroupement.get(cle);
    if (existant) existant.ids.push(lecon.id);
    else regroupement.set(cle, { premiere: lecon, ids: [lecon.id] });
  }
  return [...regroupement].map(([cle, { premiere, ids }]) => ({
    cle,
    nom: nomDuBadge(premiere),
    matiere: premiere.matiere.code,
    lecons: ids,
  }));
}

export function badgeGagneParLaSeance(
  acquisesAvant: ReadonlySet<string>,
  leconAcquise: string | undefined,
  lecons: readonly Lecon[],
): Badge | undefined {
  if (leconAcquise === undefined) return undefined;
  const [badge] = badgesDuProfil(new Set([leconAcquise]), lecons);
  const dejaGagne = badgesDuProfil(acquisesAvant, lecons).some(({ cle }) => cle === badge?.cle);
  return dejaGagne ? undefined : badge;
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
