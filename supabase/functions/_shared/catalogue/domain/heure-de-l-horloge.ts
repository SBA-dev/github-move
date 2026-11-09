import { LeconMalFormee } from "./erreurs.ts";

const ECRITURE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
const HEURES_SUR_LE_CADRAN = 12;
const MINUTES_PAR_HEURE = 60;

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

  surLeCadran(): number {
    return (this.heures % HEURES_SUR_LE_CADRAN) * MINUTES_PAR_HEURE + this.minutes;
  }

  egaleSurLeCadran(autre: HeureDeLHorloge): boolean {
    return this.surLeCadran() === autre.surLeCadran();
  }

  egale(autre: HeureDeLHorloge): boolean {
    return this.heures === autre.heures && this.minutes === autre.minutes &&
      this.secondes === autre.secondes;
  }

  ecriture(): string {
    if (this.secondes > 0) return `${this.heures} h ${this.minutes} min ${this.secondes} s`;
    if (this.minutes > 0) return `${this.heures} h ${this.minutes}`;
    return `${this.heures} h`;
  }

  private verifierLesBornes(ecriture: string): void {
    if (this.heures > 23 || this.minutes > 59 || this.secondes > 59) {
      throw new LeconMalFormee(`l'heure « ${ecriture} » est hors de la journée`);
    }
  }
}
