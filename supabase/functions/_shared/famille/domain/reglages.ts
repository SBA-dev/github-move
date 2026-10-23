import { ClavierDesDictees } from "./clavier-des-dictees.ts";
import { LangueDuParent } from "./langue-du-parent.ts";

export type ReglagesBruts = {
  modeDys?: boolean;
  toutLireAVoixHaute?: boolean;
  parcoursLibre?: boolean;
  clavierDesDictees?: string;
  langueDuParent?: string;
};

export class Reglages {
  private constructor(
    readonly modeDys: boolean,
    readonly toutLireAVoixHaute: boolean,
    readonly parcoursLibre: boolean,
    readonly clavierDesDictees: ClavierDesDictees,
    readonly langueDuParent: LangueDuParent,
  ) {}

  static parDefaut(): Reglages {
    return new Reglages(false, false, false, ClavierDesDictees.automatique(), LangueDuParent.aucune());
  }

  static depuis(brut: ReglagesBruts, depart: Reglages = Reglages.parDefaut()): Reglages {
    return new Reglages(
      brut.modeDys ?? depart.modeDys,
      brut.toutLireAVoixHaute ?? depart.toutLireAVoixHaute,
      brut.parcoursLibre ?? depart.parcoursLibre,
      brut.clavierDesDictees === undefined ? depart.clavierDesDictees : ClavierDesDictees.de(brut.clavierDesDictees),
      brut.langueDuParent === undefined ? depart.langueDuParent : LangueDuParent.de(brut.langueDuParent),
    );
  }
}
