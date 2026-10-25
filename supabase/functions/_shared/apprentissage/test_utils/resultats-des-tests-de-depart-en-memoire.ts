import type {
  IssueDeLEnregistrementDuTestDeDepart,
  ResultatsDesTestsDeDepart,
} from "../application/ports/resultats-des-tests-de-depart.ts";
import { ResultatDuTestDeDepart } from "../domain/resultat-du-test-de-depart.ts";

function copie(resultat: ResultatDuTestDeDepart): ResultatDuTestDeDepart {
  return ResultatDuTestDeDepart.reconstituer({
    enfant: resultat.enfant,
    faitLe: resultat.faitLe,
    leconsReussies: new Set(resultat.leconsReussies),
  });
}

function reunion(
  existant: ResultatDuTestDeDepart | undefined,
  resultat: ResultatDuTestDeDepart,
): ResultatDuTestDeDepart {
  if (existant === undefined) return copie(resultat);
  return ResultatDuTestDeDepart.reconstituer({
    enfant: resultat.enfant,
    faitLe: existant.faitLe > resultat.faitLe ? existant.faitLe : resultat.faitLe,
    leconsReussies: new Set([...existant.leconsReussies, ...resultat.leconsReussies]),
  });
}

export class ResultatsDesTestsDeDepartEnMemoire implements ResultatsDesTestsDeDepart {
  private readonly resultats = new Map<string, ResultatDuTestDeDepart>();
  private readonly testsEnregistres = new Set<string>();

  de(enfant: string): Promise<ResultatDuTestDeDepart | null> {
    const resultat = this.resultats.get(enfant);
    return Promise.resolve(resultat ? copie(resultat) : null);
  }

  enregistrer(resultat: ResultatDuTestDeDepart, test: string): Promise<IssueDeLEnregistrementDuTestDeDepart> {
    if (this.testsEnregistres.has(test)) return Promise.resolve("dejaEnregistre");
    this.testsEnregistres.add(test);
    this.resultats.set(resultat.enfant, reunion(this.resultats.get(resultat.enfant), resultat));
    return Promise.resolve("enregistre");
  }
}
