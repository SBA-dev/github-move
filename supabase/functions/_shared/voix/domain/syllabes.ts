export type SegmentSyllabe = { texte: string; syllabes?: string[] };

const VOYELLES = "aeiouyàâäéèêëîïôöùûüœæ";
const GROUPES_INSEPARABLES = [
  "bl",
  "br",
  "cl",
  "cr",
  "dr",
  "fl",
  "fr",
  "gl",
  "gr",
  "pl",
  "pr",
  "tr",
  "vr",
  "ch",
  "ph",
  "gn",
  "th",
  "qu",
  "gu",
];
const LETTRES = "A-Za-zÀ-ÿœæ";
const MOT = new RegExp(`([${LETTRES}]+(?:['’][${LETTRES}]+)*)`);
const DEBUT_DE_MOT = new RegExp(`^[${LETTRES}]`);
const LONGUEUR_MINIMALE_POUR_DECOUPER = 4;

const estVoyelle = (lettre: string | undefined) => lettre !== undefined && VOYELLES.includes(lettre.toLowerCase());

export function syllabesDuMot(mot: string): string[] {
  const lettres = [...mot];
  const longueur = lettres.length;
  if (longueur < LONGUEUR_MINIMALE_POUR_DECOUPER) return [mot];

  const syllabes: string[] = [];
  let debut = 0;
  let i = 0;
  while (i < longueur && !estVoyelle(lettres[i])) i++;
  while (i < longueur) {
    while (i < longueur && estVoyelle(lettres[i])) i++;
    let j = i;
    while (j < longueur && !estVoyelle(lettres[j])) j++;
    if (j >= longueur) break;
    const coupure = positionDeCoupure(lettres.slice(i, j).join("").toLowerCase(), i, j);
    syllabes.push(lettres.slice(debut, coupure).join(""));
    debut = coupure;
    i = j;
  }
  syllabes.push(lettres.slice(debut).join(""));
  return syllabes.filter(Boolean);
}

function positionDeCoupure(consonnes: string, debutConsonnes: number, finConsonnes: number): number {
  if (consonnes.length <= 1) return debutConsonnes;
  if (GROUPES_INSEPARABLES.includes(consonnes.slice(-2))) return finConsonnes - 2;
  return finConsonnes - 1;
}

export function syllabesDuTexte(texte: string): SegmentSyllabe[] {
  return texte
    .split(MOT)
    .filter((morceau) => morceau !== "")
    .map((morceau) =>
      DEBUT_DE_MOT.test(morceau) ? { texte: morceau, syllabes: syllabesDuMot(morceau) } : { texte: morceau }
    );
}
