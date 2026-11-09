const JUSQU_A_SEIZE = [
  "zéro",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante"];
const PREMIERE_DIZAINE_COMPOSEE = 17;
const PREMIERE_DIZAINE_PLEINE = 20;
const UNITES_PAR_DIZAINE = 10;

/** Écrit en lettres un nombre de 0 à 59. */
export function nombreEnLettres(nombre: number, feminin = false): string {
  if (nombre === 1 && feminin) return "une";
  if (nombre < PREMIERE_DIZAINE_COMPOSEE) return mot(JUSQU_A_SEIZE, nombre);
  if (nombre < PREMIERE_DIZAINE_PLEINE) return `dix-${mot(JUSQU_A_SEIZE, nombre - UNITES_PAR_DIZAINE)}`;
  const dizaine = mot(DIZAINES, Math.floor(nombre / UNITES_PAR_DIZAINE));
  const unite = nombre % UNITES_PAR_DIZAINE;
  if (unite === 0) return dizaine;
  if (unite === 1) return `${dizaine} et ${feminin ? "une" : "un"}`;
  return `${dizaine}-${mot(JUSQU_A_SEIZE, unite)}`;
}

function mot(mots: readonly string[], rang: number): string {
  const trouve = mots[rang];
  if (trouve === undefined) throw new RangeError(`nombre hors de 0 à 59 : ${rang}`);
  return trouve;
}
