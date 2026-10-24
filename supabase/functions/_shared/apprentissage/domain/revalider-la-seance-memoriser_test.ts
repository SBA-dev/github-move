import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");

const versDuClair = ["Au clair de la lune,", "Mon ami Pierrot,", "Ma chandelle est morte,"];

function leconDeLaPoesie(): Lecon {
  return lireLecon({
    id: "fr-ce1-poesie",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{ type: "memoriser", titre: "Au clair de la lune", vers: versDuClair }],
  });
}

function poesieJoueeJusquAuBout() {
  const seance = seanceCommencee(leconDeLaPoesie(), hasardFixe(0, 0, 0.5, 0.2, 0.7, 0.1, 0.4, 0.9, 0.3, 0.6));
  seance.repondre(Reponse.placement("Mon ami Pierrot,"));
  versDuClair.forEach((unVers) => seance.repondre(Reponse.placement(unVers)));
  seance.repondre(Reponse.choix("Pierrot"));
  ["clair", "Pierrot", "chandelle"].forEach((mot) => seance.repondre(Reponse.choix(mot)));
  return seance;
}

Deno.test("rejouer une poésie dont les vers ont été mélangés, avec une erreur par entraînement, redonne le fait de la séance d'origine", () => {
  const seance = poesieJoueeJusquAuBout();
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(leconDeLaPoesie(), seance.aEnregistrer()), fait);
});
