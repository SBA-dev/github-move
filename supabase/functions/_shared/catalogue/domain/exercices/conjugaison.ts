import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, listeDeTextes, listeFacultative, type Objet, texteRequis } from "../lecture.ts";

const NOMBRE_MINIMAL_DE_FORMES = 2;

export type FormeConjuguee = Readonly<{ pronom: string; forme: string }>;

export type ExerciceConjugaison = Readonly<{
  type: "conjugaison";
  titre?: string;
  consigne: string;
  verbe: string;
  temps: string;
  formes: readonly FormeConjuguee[];
  distracteurs: readonly string[];
}>;

export function lireConjugaison(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceConjugaison {
  const verbe = texteRequis(brut.verbe, "le verbe");
  const temps = texteRequis(brut.temps, "le temps");
  const formes = liste(brut.formes, "les formes").map(lireForme);
  if (formes.length < NOMBRE_MINIMAL_DE_FORMES) throw new LeconMalFormee("l'exercice n'a pas assez de formes");
  const distracteurs = listeDeTextes(listeFacultative(brut.distracteurs, "les distracteurs") ?? [], "les distracteurs");
  verifierQueChaquePersonnePropose2Formes(formes, distracteurs);
  return Object.freeze({
    type: "conjugaison",
    titre: communs.titre,
    consigne: communs.consigne ?? consigneParDefaut(verbe, temps),
    verbe,
    temps,
    formes: Object.freeze(formes),
    distracteurs,
  });
}

function consigneParDefaut(verbe: string, temps: string): string {
  return `Conjuguons le verbe ${verbe} au ${temps}. Choisis la bonne forme pour chaque personne.`;
}

function lireForme(brut: unknown): FormeConjuguee {
  const objet = enObjet(brut, "une forme");
  return Object.freeze({
    pronom: texteRequis(objet.pronom, "le pronom"),
    forme: texteRequis(objet.forme, "la forme"),
  });
}

function verifierQueChaquePersonnePropose2Formes(
  formes: readonly FormeConjuguee[],
  distracteurs: readonly string[],
): void {
  for (const { pronom, forme } of formes) {
    const autresChoix = [...distracteurs, ...formes.map((autre) => autre.forme)].filter((choix) => choix !== forme);
    if (autresChoix.length === 0) {
      throw new LeconMalFormee(`la personne « ${pronom} » ne peut pas proposer deux formes`);
    }
  }
}
