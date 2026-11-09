import { LeconMalFormee } from "./erreurs.ts";

const ECRITURE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
const HEURES_SUR_LE_CADRAN = 12;
const SECONDES_PAR_MINUTE = 60;
const SECONDES_PAR_HEURE = 3600;
const DERNIERE_HEURE_DU_JOUR = 23;
const DERNIERE_MINUTE_DE_L_HEURE = 59;
const DERNIERE_SECONDE_DE_LA_MINUTE = 59;

export class HeureDeLHorloge {
  private constructor(
    readonly heures: number,
    readonly minutes: number,
    readonly secondes: number,
  ) {}

  static lire(ecriture: string): HeureDeLHorloge {
    const lue = ECRITURE.exec(ecriture);
    if (lue === null) {
      throw new LeconMalFormee(`l'heure « ${ecriture} » doit s'écrire « H:MM » ou « H:MM:SS »`);
    }
    const [, heures, minutes, secondes] = lue;
    const heure = new HeureDeLHorloge(Number(heures), Number(minutes), Number(secondes ?? 0));
    heure.verifierLesBornes(ecriture);
    return heure;
  }

  /** Minutes écoulées depuis 12 h, avec la fraction due aux secondes. */
  surLeCadran(): number {
    return this.secondesSurLeCadran() / SECONDES_PAR_MINUTE;
  }

  egaleSurLeCadran(autre: HeureDeLHorloge): boolean {
    return this.secondesSurLeCadran() === autre.secondesSurLeCadran();
  }

  egale(autre: HeureDeLHorloge): boolean {
    return this.heures === autre.heures && this.minutes === autre.minutes &&
      this.secondes === autre.secondes;
  }

  estMinuit(): boolean {
    return this.heures === 0 && this.minutes === 0 && this.secondes === 0;
  }

  ecriture(): string {
    if (this.secondes > 0) return `${this.heures} h ${this.minutes} min ${this.secondes} s`;
    if (this.minutes > 0) return `${this.heures} h ${this.minutes}`;
    return `${this.heures} h`;
  }

  private secondesSurLeCadran(): number {
    return (this.heures % HEURES_SUR_LE_CADRAN) * SECONDES_PAR_HEURE +
      this.minutes * SECONDES_PAR_MINUTE + this.secondes;
  }

  private verifierLesBornes(ecriture: string): void {
    if (
      this.heures > DERNIERE_HEURE_DU_JOUR || this.minutes > DERNIERE_MINUTE_DE_L_HEURE ||
      this.secondes > DERNIERE_SECONDE_DE_LA_MINUTE
    ) {
      throw new LeconMalFormee(`l'heure « ${ecriture} » est hors de la journée`);
    }
  }
}
