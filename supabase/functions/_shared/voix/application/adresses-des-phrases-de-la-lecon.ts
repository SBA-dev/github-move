import { motsDitsLentementDansLaLecon, textesDitsDansLaLecon } from "../../apprentissage/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { adresseDuMp3, type Allure, phrasesAvecCle, type RepertoireDesPhrasesEnregistrees } from "../domain/index.ts";

export function adressesDesPhrasesDeLaLecon(
  lecon: Lecon,
  repertoire: Pick<RepertoireDesPhrasesEnregistrees, "phrases">,
): readonly string[] {
  const adresses = new Set<string>();
  const ajouter = (brut: string, allure: Allure) => {
    for (const { cle } of phrasesAvecCle(brut)) {
      const empreinte = repertoire.phrases[cle]?.[allure];
      if (empreinte !== undefined) adresses.add(adresseDuMp3(cle, empreinte, allure));
    }
  };
  for (const texte of textesDitsDansLaLecon(lecon)) ajouter(texte, "normale");
  for (const mot of motsDitsLentementDansLaLecon(lecon)) ajouter(mot, "lente");
  return [...adresses];
}
