import type { AdresseEmail } from "./adresse-email.ts";
import { TropDEssaisDeReinitialisation } from "./erreurs.ts";

const ESSAIS_RATES_AVANT_BLOCAGE = 5;
const DUREE_DU_BLOCAGE_EN_MS = 60 * 60 * 1000;
const DUREE_AVANT_OUBLI_EN_MS = 24 * 60 * 60 * 1000;

export class EssaisDeReinitialisation {
  private constructor(
    readonly adresse: AdresseEmail,
    private _essaisRates: number,
    private _dernierRateLe: Date | null,
    private _bloqueJusquA: Date | null,
  ) {}

  static nouveaux(adresse: AdresseEmail): EssaisDeReinitialisation {
    return new EssaisDeReinitialisation(adresse, 0, null, null);
  }

  static reconstituer(
    adresse: AdresseEmail,
    essaisRates: number,
    dernierRateLe: Date | null,
    bloqueJusquA: Date | null,
  ): EssaisDeReinitialisation {
    return new EssaisDeReinitialisation(adresse, essaisRates, dernierRateLe, bloqueJusquA);
  }

  get essaisRates(): number {
    return this._essaisRates;
  }

  get dernierRateLe(): Date | null {
    return this._dernierRateLe;
  }

  get bloqueJusquA(): Date | null {
    return this._bloqueJusquA;
  }

  verifierQueLaReinitialisationEstOuverte(maintenant: Date): void {
    if (this.estBloque(maintenant)) throw new TropDEssaisDeReinitialisation();
  }

  estBloque(maintenant: Date): boolean {
    return this._bloqueJusquA !== null && maintenant < this._bloqueJusquA;
  }

  enregistrerUnEssaiRate(maintenant: Date): void {
    if (this.estOublie(maintenant)) this.oublier();
    this._essaisRates += 1;
    this._dernierRateLe = maintenant;
    if (this._essaisRates >= ESSAIS_RATES_AVANT_BLOCAGE) {
      this._bloqueJusquA = new Date(maintenant.getTime() + DUREE_DU_BLOCAGE_EN_MS);
    }
  }

  enregistrerUneReussite(): void {
    this.oublier();
  }

  private oublier(): void {
    this._essaisRates = 0;
    this._dernierRateLe = null;
    this._bloqueJusquA = null;
  }

  estOublie(maintenant: Date): boolean {
    if (this._essaisRates === 0) return true;
    if (this._bloqueJusquA && maintenant >= this._bloqueJusquA) return true;
    return this._dernierRateLe !== null &&
      maintenant.getTime() - this._dernierRateLe.getTime() >= DUREE_AVANT_OUBLI_EN_MS;
  }
}
