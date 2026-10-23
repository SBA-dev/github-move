import type { CleUnivers } from "../../motivation/domain/index.ts";
import type { Niveau } from "../../catalogue/domain/index.ts";
import { ParentNonRattache } from "./erreurs.ts";
import type { ParentId } from "./parent-id.ts";
import type { Prenom } from "./prenom.ts";
import type { ProfilEnfantId } from "./profil-enfant-id.ts";

export type FaitDuProfilEnfant =
  | { type: "ProfilEnfantCree"; profil: string; parent: string; niveau: string; univers: string }
  | { type: "NiveauDuProfilChange"; profil: string; ancienNiveau: string; nouveauNiveau: string };

export type ModificationDuProfilEnfant = {
  prenom?: Prenom;
  niveau?: Niveau;
  univers?: CleUnivers;
};

export class ProfilEnfant {
  private faits: FaitDuProfilEnfant[] = [];

  private constructor(
    readonly id: ProfilEnfantId,
    private _prenom: Prenom,
    private _niveau: Niveau,
    private _univers: CleUnivers,
    readonly creeLe: Date,
    private readonly parents: ParentId[],
  ) {}

  static creer(
    id: ProfilEnfantId,
    parent: ParentId,
    prenom: Prenom,
    niveau: Niveau,
    univers: CleUnivers,
    creeLe: Date,
  ): ProfilEnfant {
    const profil = new ProfilEnfant(id, prenom, niveau, univers, creeLe, [parent]);
    profil.faits.push({
      type: "ProfilEnfantCree",
      profil: id.valeur,
      parent: parent.valeur,
      niveau: niveau.valeur,
      univers,
    });
    return profil;
  }

  get prenom(): Prenom {
    return this._prenom;
  }

  get niveau(): Niveau {
    return this._niveau;
  }

  get univers(): CleUnivers {
    return this._univers;
  }

  estRattacheA(parent: ParentId): boolean {
    return this.parents.some((rattache) => rattache.valeur === parent.valeur);
  }

  modifier(par: ParentId, modification: ModificationDuProfilEnfant): void {
    if (!this.estRattacheA(par)) throw new ParentNonRattache();
    this._prenom = modification.prenom ?? this._prenom;
    this._univers = modification.univers ?? this._univers;
    if (modification.niveau !== undefined) this.changerDeNiveau(modification.niveau);
  }

  retirerFaits(): FaitDuProfilEnfant[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }

  private changerDeNiveau(nouveau: Niveau): void {
    if (nouveau.valeur === this._niveau.valeur) return;
    this.faits.push({
      type: "NiveauDuProfilChange",
      profil: this.id.valeur,
      ancienNiveau: this._niveau.valeur,
      nouveauNiveau: nouveau.valeur,
    });
    this._niveau = nouveau;
  }
}
