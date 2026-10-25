import { AucuneCitationDansLaSection } from "./erreurs.ts";
import type { SectionDuProgramme } from "../../catalogue/domain/index.ts";
import { normaliser } from "./texte-normalise.ts";

const DECOUPAGE_EN_PHRASES = /(?<=[.;!?])\s+|\s{2,}|•|\||\s[-−—]\s|(?<=[a-zéèêàùûôîç)])\s+(?=[A-ZÉÈÀ][a-zéèêàùûôîç])/u;
const LONGUEUR_MINIMALE = 25;
const LONGUEUR_MAXIMALE = 450;
const LONGUEUR_IDEALE = 120;

type Candidate = { phrase: string; cle: number[] };

export function citationDeLaSection(
  section: SectionDuProgramme,
  motsCles: string[],
): string {
  const motsNormalises = motsCles.map(normaliser);
  let meilleure: Candidate | undefined;
  for (const phrase of phrasesDe(section.extrait)) {
    const candidate = { phrase, cle: cleDeClassement(phrase, motsNormalises) };
    if (!meilleure || estMeilleure(candidate.cle, meilleure.cle)) {
      meilleure = candidate;
    }
  }
  if (!meilleure) throw new AucuneCitationDansLaSection();
  return meilleure.phrase;
}

function phrasesDe(extrait: string): string[] {
  return extrait
    .split(DECOUPAGE_EN_PHRASES)
    .map((morceau) => morceau.replace(/^[ \-−—]+|[ \-−—]+$/gu, ""))
    .filter((p) => p.length >= LONGUEUR_MINIMALE && p.length <= LONGUEUR_MAXIMALE);
}

function cleDeClassement(phrase: string, motsNormalises: string[]): number[] {
  const texte = normaliser(phrase);
  const presents = motsNormalises.filter((mot) => texte.includes(mot)).length;
  return [
    presents > 0 ? 1 : 0,
    estPropre(phrase) ? 1 : 0,
    presents,
    -Math.abs(phrase.length - LONGUEUR_IDEALE),
  ];
}

function estMeilleure(cle: number[], reference: number[]): boolean {
  for (const [i, valeur] of cle.entries()) {
    const valeurDeReference = reference[i] ?? 0;
    if (valeur !== valeurDeReference) return valeur > valeurDeReference;
  }
  return false;
}

function estPropre(phrase: string): boolean {
  const deuxColonnesMelangees = /[a-zéèàù,]\s+(L’élève|L'élève|Il |Elle |Les élèves|Dès la période|Au plus tard)/u
    .test(phrase) ||
    /\s(du|de|la|le|les|des|un|une|et|à|en)\s*$/u.test(phrase);
  const coupeEnFinDeLigne = /(grapho|phono|[,:(—-])$/u.test(phrase);
  return /^\p{Lu}/u.test(phrase) && !coupeEnFinDeLigne &&
    compter(phrase, "(") === compter(phrase, ")") && !deuxColonnesMelangees;
}

function compter(texte: string, caractere: string): number {
  return texte.split(caractere).length - 1;
}
