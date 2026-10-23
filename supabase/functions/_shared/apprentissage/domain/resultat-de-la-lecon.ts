import { Etoiles, type NombreDEtoiles } from "./etoiles.ts";

export type FaitDeResultat =
  | { type: "LeconReussie"; enfant: string; lecon: string }
  | { type: "LeconAcquise"; enfant: string; lecon: string; competence: string };

export type EtatDuResultat = {
  enfant: string;
  lecon: string;
  competence: string;
  meilleures?: NombreDEtoiles;
  dernieres?: NombreDEtoiles;
  nombreDeSeances: number;
};

const SEUIL_DE_LECON_REUSSIE = 1;
const SEUIL_DE_LECON_ACQUISE = 2;

export class ResultatDeLaLecon {
  private faits: FaitDeResultat[] = [];

  private constructor(private etat: EtatDuResultat) {}

  static commencer(enfant: string, lecon: string, competence: string): ResultatDeLaLecon {
    return new ResultatDeLaLecon({ enfant, lecon, competence, nombreDeSeances: 0 });
  }

  static reconstituer(etat: EtatDuResultat): ResultatDeLaLecon {
    return new ResultatDeLaLecon({ ...etat });
  }

  get enfant(): string {
    return this.etat.enfant;
  }

  get lecon(): string {
    return this.etat.lecon;
  }

  get meilleures(): NombreDEtoiles | undefined {
    return this.etat.meilleures;
  }

  get dernieres(): NombreDEtoiles | undefined {
    return this.etat.dernieres;
  }

  get nombreDeSeances(): number {
    return this.etat.nombreDeSeances;
  }

  estReussie(): boolean {
    return (this.etat.meilleures ?? 0) >= SEUIL_DE_LECON_REUSSIE;
  }

  estAcquise(): boolean {
    return (this.etat.meilleures ?? 0) >= SEUIL_DE_LECON_ACQUISE;
  }

  enregistrerSeance(etoiles: NombreDEtoiles): void {
    const etaitReussie = this.estReussie();
    const etaitAcquise = this.estAcquise();

    const gagnees = Etoiles.de(etoiles);
    const meilleures = this.etat.meilleures === undefined ? undefined : Etoiles.de(this.etat.meilleures);
    this.etat.dernieres = etoiles;
    this.etat.meilleures = gagnees.meilleureQue(meilleures).nombre;
    this.etat.nombreDeSeances += 1;

    if (!etaitReussie && this.estReussie()) {
      this.faits.push({ type: "LeconReussie", enfant: this.enfant, lecon: this.lecon });
    }
    if (!etaitAcquise && this.estAcquise()) {
      this.faits.push({
        type: "LeconAcquise",
        enfant: this.enfant,
        lecon: this.lecon,
        competence: this.etat.competence,
      });
    }
  }

  retirerFaits(): FaitDeResultat[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }
}
