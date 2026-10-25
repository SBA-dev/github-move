import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeBullesEtDEcoute } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-25T10:30:00Z");
const cleDesBulles = CleDeQuestion.de("bulles", "Dans le mot « poule », quel son entends-tu ?ou");
const cleDeLEcoute = CleDeQuestion.de("ecoute", "cat");

function commencer(): Seance {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconDeBullesEtDEcoute(),
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

Deno.test("une séance terminée donne ses questions ratées à retenir avec leur leçon d'origine, la position de leur exercice et leur type", () => {
  const seance = commencer();
  seance.repondre(Reponse.choix("on"));
  seance.repondre(Reponse.choix("ou"));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("chat"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, [
    {
      identite: cleDesBulles,
      origine: { leconDOrigine: "an-cp-bulles-et-ecoute", position: 0, type: "bulles" },
    },
    {
      identite: cleDeLEcoute,
      origine: { leconDOrigine: "an-cp-bulles-et-ecoute", position: 1, type: "ecoute" },
    },
  ]);
});

Deno.test("une séance terminée sans erreur n'a aucune question à retenir", () => {
  const seance = commencer();
  seance.repondre(Reponse.choix("ou"));
  seance.repondre(Reponse.choix("chat"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, []);
});
