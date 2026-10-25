import type { FormeConjuguee } from "../../catalogue/domain/index.ts";
import { groupeDuVerbe } from "./groupe-du-verbe.ts";
import { normaliser } from "./texte-normalise.ts";

const H_ASPIRES = new Set([
  "hurler",
  "huer",
  "hacher",
  "hisser",
  "hausser",
  "heurter",
  "hanter",
  "harceler",
  "hocher",
  "hululer",
  "hater",
  "hennir",
  "hasarder",
  "herisser",
  "happer",
]);

const VERBES_EN_ER_IRREGULIERS = new Set(["aller"]);
const DEBUT_ELIDE = /^[aeiouyéèêâîô]/;
const EN_YER_ELER_ETER = /(yer|eler|eter)$/;
const E_CONSONNE_ER = /[eé][^aeiouyéèêâîô]er$/;
const E_ACCENTUE_CONSONNES_ER = /é[^aeiouyéèêâîô]+er$/;
const E_CONSONNE_LIQUIDE_ER = /e[^aeiouyéèêâîô][rl]er$/;

export function presentDuPremierGroupe(infinitif: string): FormeConjuguee[] {
  const verbe = infinitif.toLowerCase();
  const radical = verbe.slice(0, -2);
  return [
    { pronom: pronomJe(verbe), forme: `${radical}e` },
    { pronom: "tu", forme: `${radical}es` },
    { pronom: "il", forme: `${radical}e` },
    { pronom: "nous", forme: `${radicalDeNous(radical)}ons` },
    { pronom: "vous", forme: `${radical}ez` },
    { pronom: "ils", forme: `${radical}ent` },
  ];
}

export function verbeAConjuguer(verbes: readonly string[]): string | undefined {
  return verbes.map((verbe) => verbe.toLowerCase()).find(
    estRegulierDuPremierGroupe,
  );
}

function pronomJe(verbe: string): string {
  const voyelle = DEBUT_ELIDE.test(verbe);
  const hMuet = verbe.startsWith("h") && !H_ASPIRES.has(normaliser(verbe));
  return voyelle || hMuet ? "j'" : "je";
}

function radicalDeNous(radical: string): string {
  if (radical.endsWith("g")) return `${radical}e`;
  if (radical.endsWith("c")) return `${radical.slice(0, -1)}ç`;
  return radical;
}

function estRegulierDuPremierGroupe(infinitif: string): boolean {
  const verbe = infinitif.toLowerCase();
  return groupeDuVerbe(verbe) === "1" &&
    !VERBES_EN_ER_IRREGULIERS.has(verbe) &&
    !EN_YER_ELER_ETER.test(verbe) &&
    !E_CONSONNE_ER.test(verbe) &&
    !E_ACCENTUE_CONSONNES_ER.test(verbe) &&
    !E_CONSONNE_LIQUIDE_ER.test(verbe);
}
