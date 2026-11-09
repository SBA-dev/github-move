import { LeconMalFormee } from "./erreurs.ts";
import { HeureDeLHorloge } from "./heure-de-l-horloge.ts";
import type { CodeDeNiveau, Niveau } from "./niveau.ts";

const PAS_EN_SECONDES = {
  "heure": 3600,
  "demi-heure": 1800,
  "quart-d-heure": 900,
  "cinq-minutes": 300,
  "minute": 60,
  "seconde": 1,
} as const;

export type EcriturePrecisionDeLHeure = keyof typeof PAS_EN_SECONDES;

const PRECISION_PAR_DEFAUT: Record<CodeDeNiveau, EcriturePrecisionDeLHeure> = {
  CP: "heure",
  CE1: "quart-d-heure",
  CE2: "minute",
  CM1: "minute",
  CM2: "seconde",
};

const SECONDES_PAR_MINUTE = 60;

export class PrecisionDeLHeure {
  private constructor(private readonly nom: EcriturePrecisionDeLHeure) {}

  static lire(ecriture: string): PrecisionDeLHeure {
    const nom = (Object.keys(PAS_EN_SECONDES) as EcriturePrecisionDeLHeure[])
      .find((connu) => connu === ecriture);
    if (nom === undefined) {
      throw new LeconMalFormee(
        `la précision « ${ecriture} » doit être l'une de : ${Object.keys(PAS_EN_SECONDES).join(", ")}`,
      );
    }
    return new PrecisionDeLHeure(nom);
  }

  static parDefaut(niveau: Niveau): PrecisionDeLHeure {
    return new PrecisionDeLHeure(PRECISION_PAR_DEFAUT[niveau.valeur]);
  }

  ecriture(): EcriturePrecisionDeLHeure {
    return this.nom;
  }

  respectee(heure: HeureDeLHorloge): boolean {
    const secondesDansLHeure = heure.minutes * SECONDES_PAR_MINUTE + heure.secondes;
    return secondesDansLHeure % this.pas() === 0;
  }

  permiseAu(niveau: Niveau): boolean {
    return this.pas() >= PrecisionDeLHeure.parDefaut(niveau).pas();
  }

  private pas(): number {
    return PAS_EN_SECONDES[this.nom];
  }
}
