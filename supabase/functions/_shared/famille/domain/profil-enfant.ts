import type { CleUnivers } from "../../motivation/domain/index.ts";
import type { Niveau } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, RattachementsInvalides } from "./erreurs.ts";
import type { ParentId } from "./parent-id.ts";
import type { Prenom } from "./prenom.ts";
import type { ProfilEnfantId } from "./profil-enfant-id.ts";
import { Reglages } from "./reglages.ts";

export type FaitDuProfilEnfant =
  | { type: "ProfilEnfantCree"; profil: string; parent: string; niveau: string; univers: string }
  | { type: "NiveauDuProfilChange"; profil: string; ancienNiveau: string; nouveauNiveau: string }
  | { type: "ReglagesChanges"; profil: string; reglages: Reglages };

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
    private _reglages: Reglages,
  ) {}

  static creer(
    id: ProfilEnfantId,
    parent: ParentId,
    prenom: Prenom,
    niveau: Niveau,
    univers: CleUnivers,
    creeLe: Date,
    reglages: Reglages = Reglages.parDefaut(),
  ): ProfilEnfant {
    const profil = new ProfilEnfant(id, prenom, niveau, univers, creeLe, [parent], reglages);
    profil.faits.push({
      type: "ProfilEnfantCree",
      profil: id.valeur,
      parent: parent.valeur,
      niveau: niveau.valeur,
      univers,
    });
    return profil;
  }

  static reconstituer(
    id: ProfilEnfantId,
    prenom: Prenom,
    niveau: Niveau,
    univers: CleUnivers,
    creeLe: Date,
    parents: ParentId[],
    reglages: Reglages = Reglages.parDefaut(),
  ): ProfilEnfant {
    if (parents.length < 1 || parents.length > 2) throw new RattachementsInvalides();
    return new ProfilEnfant(id, prenom, niveau, univers, creeLe, [...parents], reglages);
  }

  get rattaches(): readonly ParentId[] {
    return this.parents;
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

  get reglages(): Reglages {
    return this._reglages;
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

  changerLesReglages(par: ParentId, reglages: Reglages): void {
    if (!this.estRattacheA(par)) throw new ParentNonRattache();
    this._reglages = reglages;
    this.faits.push({ type: "ReglagesChanges", profil: this.id.valeur, reglages });
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
