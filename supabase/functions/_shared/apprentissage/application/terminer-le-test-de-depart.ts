import { ParentNonRattache } from "../domain/erreurs.ts";
import { leconsReussiesAuTestDeDepart } from "../domain/lecons-reussies-au-test-de-depart.ts";
import { type FaitDeTestDeDepart, ResultatDuTestDeDepart } from "../domain/resultat-du-test-de-depart.ts";
import { revaliderLeTestDeDepart } from "../domain/revalider-le-test-de-depart.ts";
import type { TestDeDepartTermineAEnregistrer } from "../domain/test-de-depart-termine-a-enregistrer.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { NiveauDuProfil } from "./ports/niveau-du-profil.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { ResultatsDesTestsDeDepart } from "./ports/resultats-des-tests-de-depart.ts";

export class TerminerLeTestDeDepart {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly niveaux: NiveauDuProfil,
    private readonly resultats: ResultatsDesTestsDeDepart,
  ) {}

  async executer(
    { parent, test }: { parent: string; test: TestDeDepartTermineAEnregistrer },
  ): Promise<FaitDeTestDeDepart[]> {
    if (!await this.rattachements.estRattache(parent, test.enfant)) throw new ParentNonRattache();
    const lecons = await this.lecons.toutes();
    const niveau = await this.niveaux.de(test.enfant);

    const termine = revaliderLeTestDeDepart(test, lecons, niveau);
    const leconsReussies = leconsReussiesAuTestDeDepart(lecons, niveau, termine.questions);
    const resultat = await this.resultats.de(termine.enfant);
    if (resultat) resultat.enregistrer(termine, leconsReussies);
    const aEnregistrer = resultat ?? ResultatDuTestDeDepart.premier(termine, leconsReussies);

    const issue = await this.resultats.enregistrer(aEnregistrer, termine.test);
    return issue === "enregistre" ? [{ ...termine, leconsReussies }] : [];
  }
}
