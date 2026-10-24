import { TirageInvalide } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";
import type { MotAEcrire } from "./mot-a-ecrire.ts";
import type { CodeDeNiveau } from "../../catalogue/domain/index.ts";

export type ReglageDuClavier = "automatique" | "lettresDuMot" | "clavierComplet";

const LETTRES_INTRUSES_POSSIBLES = [..."aeioulnrstcmpbdvé"];
const NIVEAUX_DU_CLAVIER_COMPLET_EN_AUTOMATIQUE: readonly CodeDeNiveau[] = ["CE2", "CM1", "CM2"];
const TOUCHES_PAR_MOT = 8;
const INTRUSES_AU_MOINS = 2;
const INTRUSES_AU_PLUS = 3;
const RANGEES_DU_CLAVIER_COMPLET = [
  [..."azertyuiop"],
  [..."qsdfghjklm"],
  [..."wxcvbnéèêà"],
  [..."çùëïôâîû"],
  ["œ"],
];

type GenreDeClavier = "lettresDuMot" | "clavierComplet";

export class ClavierPropose {
  private constructor(readonly genre: GenreDeClavier, readonly rangees: readonly (readonly string[])[]) {}

  static choisir(reglage: ReglageDuClavier, niveau: CodeDeNiveau, mot: MotAEcrire, hasard: Hasard): ClavierPropose {
    if (genreAttendu(reglage, niveau) === "clavierComplet") return ClavierPropose.complet();
    const lettres = mot.lettresAEcrire();
    const intruses = melanger(intrusesPossibles(lettres), hasard).slice(0, nombreDIntruses(lettres));
    return ClavierPropose.avecLesLettresDuMot(melanger([...lettres, ...intruses], hasard));
  }

  static depuisTirage(
    reglage: ReglageDuClavier,
    niveau: CodeDeNiveau,
    mot: MotAEcrire,
    tirage: readonly string[],
  ): ClavierPropose {
    if (genreAttendu(reglage, niveau) === "clavierComplet") {
      if (tirage.length > 0) throw new TirageInvalide();
      return ClavierPropose.complet();
    }
    if (!estUnTirageDeLettres(tirage, mot.lettresAEcrire())) throw new TirageInvalide();
    return ClavierPropose.avecLesLettresDuMot([...tirage]);
  }

  private static complet(): ClavierPropose {
    return new ClavierPropose("clavierComplet", RANGEES_DU_CLAVIER_COMPLET);
  }

  private static avecLesLettresDuMot(touches: readonly string[]): ClavierPropose {
    return new ClavierPropose("lettresDuMot", [touches]);
  }

  get touches(): string[] {
    return this.rangees.flat();
  }

  tirage(): string[] {
    return this.genre === "lettresDuMot" ? this.touches : [];
  }
}

function genreAttendu(reglage: ReglageDuClavier, niveau: CodeDeNiveau): GenreDeClavier {
  if (reglage === "automatique") {
    return NIVEAUX_DU_CLAVIER_COMPLET_EN_AUTOMATIQUE.includes(niveau) ? "clavierComplet" : "lettresDuMot";
  }
  return reglage;
}

function intrusesPossibles(lettres: readonly string[]): string[] {
  return LETTRES_INTRUSES_POSSIBLES.filter((lettre) => !lettres.includes(lettre));
}

function nombreDIntruses(lettres: readonly string[]): number {
  return Math.min(INTRUSES_AU_PLUS, Math.max(INTRUSES_AU_MOINS, TOUCHES_PAR_MOT - lettres.length));
}

function estUnTirageDeLettres(tirage: readonly string[], lettresDuMot: readonly string[]): boolean {
  const intruses = [...tirage];
  for (const lettre of lettresDuMot) {
    const rang = intruses.indexOf(lettre);
    if (rang === -1) return false;
    intruses.splice(rang, 1);
  }
  return intruses.length === nombreDIntruses(lettresDuMot) &&
    new Set(intruses).size === intruses.length &&
    intruses.every((lettre) => intrusesPossibles(lettresDuMot).includes(lettre));
}
